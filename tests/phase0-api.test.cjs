const test = require('node:test');
const assert = require('node:assert/strict');
const handler = require('../api/jobs');

function makeResponse(value, status = 200) {
  const body = typeof value === 'string' ? value : JSON.stringify(value);
  return new Response(body, { status, headers: { 'Content-Type': 'application/json' } });
}

function makeRes() {
  return {
    statusCode: 200,
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
    end() { this.ended = true; return this; },
  };
}

async function invoke(body, method = 'POST') {
  const res = makeRes();
  await handler({ method, body }, res);
  return res;
}

function withoutProviderKeys() {
  const previous = {
    jobvetta: process.env.JOBVETTA_API_KEY,
    joa: process.env.JOA_API_KEY,
    jobOpportunities: process.env.JOBOPPORTUNITIES_API_KEY,
  };
  delete process.env.JOBVETTA_API_KEY;
  delete process.env.JOA_API_KEY;
  delete process.env.JOBOPPORTUNITIES_API_KEY;
  return () => {
    for (const [key, value] of Object.entries({
      JOBVETTA_API_KEY: previous.jobvetta,
      JOA_API_KEY: previous.joa,
      JOBOPPORTUNITIES_API_KEY: previous.jobOpportunities,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  };
}

test('HTTP method and preflight contract', async () => {
  const get = await invoke({}, 'GET');
  assert.equal(get.statusCode, 405);
  assert.equal(get.body.error, 'Method not allowed');

  const options = await invoke({}, 'OPTIONS');
  assert.equal(options.statusCode, 204);
  assert.equal(options.ended, true);
});

test('empty configuration returns a clear 400 response', async () => {
  const restoreEnv = withoutProviderKeys();
  try {
    const result = await invoke({ boards: [] });
    assert.equal(result.statusCode, 400);
    assert.match(result.body.error, /Add company boards or configure/);
  } finally {
    restoreEnv();
  }
});

test('all seven board adapters normalize jobs and deduplicate matching URLs', async () => {
  const restoreEnv = withoutProviderKeys();
  const originalFetch = global.fetch;
  try {
    global.fetch = async (url) => {
      if (url.includes('boards-api.greenhouse.io')) {
        return makeResponse({ jobs: [{ id: 'g1', title: 'Engineer', absolute_url: 'https://jobs.example.com/shared' }] });
      }
      if (url.includes('api.lever.co')) {
        return makeResponse([{ id: 'l1', text: 'Product Engineer', hostedUrl: 'https://jobs.example.com/shared' }]);
      }
      if (url.includes('api.ashbyhq.com')) {
        return makeResponse({ jobs: [{ id: 'a1', title: 'AI Engineer', jobUrl: 'https://jobs.example.com/ashby' }] });
      }
      if (url.includes('api.smartrecruiters.com')) {
        return makeResponse({ content: [{ id: 's1', name: 'Analyst', applyUrl: 'https://jobs.example.com/smart' }] });
      }
      if (url.includes('.recruitee.com')) {
        return makeResponse({ offers: [{ id: 'r1', title: 'QA Engineer', careers_url: 'https://jobs.example.com/recruitee' }] });
      }
      if (url.includes('custom.example.com')) {
        return makeResponse({ results: [{ id: 'c1', title: 'DevOps Engineer', url: 'https://jobs.example.com/custom' }] });
      }
      if (url.includes('/wday/cxs/')) {
        return makeResponse({ jobPostings: [{ title: 'Workday Engineer', externalPath: '/job/workday-1' }] });
      }
      throw new Error('Unexpected URL: ' + url);
    };

    const result = await invoke({
      boards: [
        { id: 'g', provider: 'greenhouse', key: 'test', company: 'Greenhouse Co' },
        { id: 'l', provider: 'lever', key: 'test', company: 'Lever Co' },
        { id: 'a', provider: 'ashby', key: 'test', company: 'Ashby Co' },
        { id: 's', provider: 'smartrecruiters', key: 'test', company: 'Smart Co' },
        { id: 'r', provider: 'recruitee', key: 'test', company: 'Recruitee Co' },
        { id: 'c', provider: 'custom', endpoint: 'https://custom.example.com/jobs', company: 'Custom Co' },
        { id: 'w', provider: 'workday', key: 'https://acme.wd5.myworkdayjobs.com/en-US/careers', company: 'Workday Co' },
      ],
    });

    assert.equal(result.statusCode, 200);
    assert.equal(result.body.results.length, 7);
    assert.ok(result.body.results.every((entry) => entry.status === 'ok'));
    assert.equal(result.body.total, 6, 'duplicate URL from Greenhouse and Lever should be returned once');
    assert.ok(result.body.jobs.every((job) => job.title && job.company && job.url && job.source));
  } finally {
    global.fetch = originalFetch;
    restoreEnv();
  }
});

test('malformed JSON, malformed payloads and HTTP failures are surfaced per board', async () => {
  const restoreEnv = withoutProviderKeys();
  const originalFetch = global.fetch;
  try {
    global.fetch = async () => makeResponse({ jobs: { not: 'an array' } });
    let result = await invoke({ boards: [{ id: 'g', provider: 'greenhouse', key: 'test' }] });
    assert.equal(result.body.results[0].status, 'error');

    global.fetch = async () => makeResponse('not-json');
    result = await invoke({ boards: [{ id: 'g', provider: 'greenhouse', key: 'test' }] });
    assert.equal(result.body.results[0].status, 'error');
    assert.match(result.body.results[0].error, /invalid JSON/);

    global.fetch = async () => makeResponse({ error: 'upstream unavailable' }, 503);
    result = await invoke({ boards: [{ id: 'g', provider: 'greenhouse', key: 'test' }] });
    assert.equal(result.body.results[0].status, 'error');
    assert.match(result.body.results[0].error, /HTTP 503/);
  } finally {
    global.fetch = originalFetch;
    restoreEnv();
  }
});

test('aborted upstream requests are reported as timeouts', async () => {
  const restoreEnv = withoutProviderKeys();
  const originalFetch = global.fetch;
  try {
    global.fetch = async () => {
      throw Object.assign(new Error('aborted'), { name: 'AbortError' });
    };
    const result = await invoke({ boards: [{ id: 'g', provider: 'greenhouse', key: 'test' }] });
    assert.match(result.body.results[0].error, /timed out/);
  } finally {
    global.fetch = originalFetch;
    restoreEnv();
  }
});

test('custom adapter rejects private IP destinations', async () => {
  const restoreEnv = withoutProviderKeys();
  const result = await invoke({
    boards: [{ id: 'custom', provider: 'custom', endpoint: 'https://127.0.0.1/jobs' }],
  });
  restoreEnv();
  assert.equal(result.body.results[0].status, 'error');
  assert.match(result.body.results[0].error, /public HTTPS/);
});

test('Workday pagination follows a full page and stops on the short final page', async () => {
  const restoreEnv = withoutProviderKeys();
  const originalFetch = global.fetch;
  let requests = 0;
  try {
    global.fetch = async (_url, options) => {
      requests += 1;
      const offset = JSON.parse(options.body).offset;
      const count = offset === 0 ? 20 : 1;
      return makeResponse({
        jobPostings: Array.from({ length: count }, (_, index) => ({
          id: 'w-' + offset + '-' + index,
          title: 'Workday Role ' + index,
          externalPath: '/job/' + offset + '/' + index,
        })),
      });
    };
    const result = await invoke({
      boards: [{ id: 'workday', provider: 'workday', key: 'https://acme.wd5.myworkdayjobs.com/en-US/careers', company: 'Workday Co' }],
    });
    assert.equal(requests, 2);
    assert.equal(result.body.results[0].count, 21);
  } finally {
    global.fetch = originalFetch;
    restoreEnv();
  }
});
