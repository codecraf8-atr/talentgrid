const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');

const BASE_URL = process.env.TALENTGRID_BASE_URL || 'https://talentgrid-five.vercel.app';
const STORE = 'talentgrid_v1';

const fixtureJobs = [
  {
    id: 'phase0-example-1',
    title: 'Senior Software Engineer',
    company: 'ExampleCo',
    location: 'Bengaluru, India',
    department: 'Engineering',
    employmentType: 'Contract',
    source: 'greenhouse',
    postedAt: '2026-11-27T00:00:00.000Z',
    url: 'https://example.com/jobs/engineer',
    description: 'Software engineering platform role',
  },
  {
    id: 'phase0-example-2',
    title: 'Product Engineer',
    company: 'ExampleCo',
    location: 'Remote, India',
    department: 'Technology',
    employmentType: 'Full time',
    source: 'lever',
    postedAt: '2026-11-26T00:00:00.000Z',
    url: 'https://example.com/jobs/product',
    description: 'Product engineering role',
  },
  {
    id: 'phase0-other-1',
    title: 'Account Executive',
    company: 'OtherCo',
    location: 'Mumbai, India',
    department: 'Sales',
    employmentType: 'Full time',
    source: 'ashby',
    postedAt: '2026-11-25T00:00:00.000Z',
    url: 'https://example.com/jobs/sales',
    description: 'Sales role',
  },
  {
    ...{
      id: 'phase0-example-1-duplicate',
      title: 'Senior Software Engineer (duplicate source row)',
      company: 'ExampleCo',
      location: 'Bengaluru, India',
      department: 'Engineering',
      employmentType: 'Contract',
      source: 'lever',
      postedAt: '2026-11-28T00:00:00.000Z',
      url: 'https://example.com/jobs/engineer',
      description: 'Duplicate record with the same source URL',
    },
  },
];

function seedBrowser(page, jobs = fixtureJobs) {
  return page.addInitScript(({ store, rows }) => {
    if (sessionStorage.getItem('talentgrid-phase0-seeded')) return;
    localStorage.setItem(store, JSON.stringify({
      boards: [
        {
          id: 'starter_greenhouse_abnormal',
          company: 'Abnormal Security',
          name: 'Abnormal Security',
          provider: 'greenhouse',
          key: 'abnormal',
          country: 'India',
          starter: true,
        },
        {
          id: 'starter_greenhouse_addepar',
          company: 'Addepar',
          name: 'Addepar',
          provider: 'greenhouse',
          key: 'addepar',
          country: 'India',
          starter: true,
        },
        {
          id: 'starter_lever_razorpay',
          company: 'Razorpay',
          name: 'Razorpay',
          provider: 'lever',
          key: 'razorpay',
          country: 'India',
          starter: true,
        },
        {
          id: 'starter_ashby_postman',
          company: 'Postman',
          name: 'Postman',
          provider: 'ashby',
          key: 'postman',
          country: 'India',
          starter: true,
        },
      ],
      jobs: rows,
      saved: [],
      focusCompanies: [],
      excludedCompanies: [],
      results: [],
      lastSync: new Date().toISOString(),
      starterSeeded: true,
    }));
    sessionStorage.setItem('talentgrid-phase0-seeded', '1');
  }, { store: STORE, rows: jobs });
}

async function downloadText(page, button) {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    button.click(),
  ]);
  const path = await download.path();
  assert.ok(path, 'browser should produce a downloadable file');
  return {
    filename: download.suggestedFilename(),
    content: fs.readFileSync(path, 'utf8'),
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    acceptDownloads: true,
    viewport: { width: 1440, height: 960 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('503 (Service Unavailable)')) {
      errors.push(message.text());
    }
  });

  try {
    await seedBrowser(page);
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 45000 });

    assert.match(await page.title(), /TalentGrid/);
    assert.equal(await page.locator('.nav button').count(), 5);
    assert.equal(await page.locator('#jobList .job').count(), 3);
    assert.equal(await page.evaluate(() =>
      JSON.parse(localStorage.getItem('talentgrid_v1')).jobs.length
    ), 3, 'persisted duplicate URL rows should be deduplicated during migration');
    for (const [key, crumb] of [
      ['intelligence', 'In Focus'],
      ['boards', 'Company boards'],
      ['saved', 'Saved jobs'],
      ['integrations', 'Integrations'],
      ['jobs', 'Job feed'],
    ]) {
      await page.locator('[data-page="' + key + '"]').click();
      assert.equal(await page.locator('#crumbPage').innerText(), crumb);
    }
    console.log('PASS startup and five-section navigation');

    const migratedKeys = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('talentgrid_v1')).boards.map((board) => board.key)
    );
    assert.ok(migratedKeys.includes('abnormalsecurity'));
    assert.ok(migratedKeys.includes('addepar1'));
    const migratedBoards = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('talentgrid_v1')).boards
    );
    const razorpay = migratedBoards.find((board) => board.id === 'starter_lever_razorpay');
    const postman = migratedBoards.find((board) => board.id === 'starter_ashby_postman');
    assert.equal(razorpay.provider, 'greenhouse');
    assert.equal(razorpay.key, 'razorpaysoftwareprivatelimited');
    assert.equal(postman.provider, 'workday');
    assert.equal(postman.key, 'https://postman.wd108.myworkdayjobs.com/careers');
    const recruiteeOptions = await page.locator('#sourceFilter option').evaluateAll((options) =>
      options.filter((option) => option.value === 'recruitee').length
    );
    assert.equal(recruiteeOptions, 1);
    console.log('PASS legacy starter-board migration and duplicate filter-option check');

    await page.locator('[data-page="boards"]').click();
    assert.equal(await page.locator('#boardList .board').count(), 4);
    await page.locator('#page-boards .pagehead button').click();
    await page.locator('#companyName').fill('Phase0 CRUD Employer');
    await page.locator('#provider').selectOption('greenhouse');
    await page.locator('#boardKey').fill('phase0-crud-fixture');
    await page.locator('#boardForm button[type="submit"]').click();

    let card = page.locator('#boardList .board').filter({ hasText: 'Phase0 CRUD Employer' });
    assert.equal(await card.count(), 1);
    await card.getByTitle('Edit').click();
    assert.equal(await page.locator('#companyName').inputValue(), 'Phase0 CRUD Employer');
    await page.locator('#companyName').fill('Phase0 CRUD Employer Edited');
    await page.locator('#boardForm button[type="submit"]').click();
    card = page.locator('#boardList .board').filter({ hasText: 'Phase0 CRUD Employer Edited' });
    assert.equal(await card.count(), 1);
    page.once('dialog', (dialog) => dialog.accept());
    await card.getByTitle('Remove').click();
    assert.equal(await page.locator('#boardList .board').count(), 4);
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('[data-page="boards"]').click();
    assert.equal(await page.locator('#boardList .board').count(), 4);
    assert.equal((await page.locator('#boardList').innerText()).includes('Phase0 CRUD Employer'), false);
    console.log('PASS board create/edit/delete and reload persistence');

    await page.locator('[data-page="jobs"]').click();
    await page.locator('#searchInput').fill('ExampleCo');
    assert.equal(await page.locator('#jobList .job').count(), 2);
    await page.locator('#sourceFilter').selectOption('greenhouse');
    assert.equal(await page.locator('#jobList .job').count(), 1);
    await page.locator('#sourceFilter').selectOption('');
    await page.locator('#searchInput').fill('');
    await page.locator('#regionFilter').selectOption('india-remote');
    assert.equal(await page.locator('#jobList .job').count(), 1);
    await page.locator('#regionFilter').selectOption('');
    await page.locator('#industryFilter').selectOption('technology');
    await page.locator('#typeFilter').selectOption('contract');
    assert.equal(await page.locator('#jobList .job').count(), 1);
    await page.locator('#industryFilter').selectOption('');
    await page.locator('#typeFilter').selectOption('');
    const jobsCsv = await downloadText(page, page.locator('#exportBtn'));
    assert.match(jobsCsv.filename, /talentgrid-jobs-/);
    assert.match(jobsCsv.content, /Senior Software Engineer/);
    assert.match(await page.locator('#jobList .job a.jobtitle').first().getAttribute('rel'), /noopener/);
    console.log('PASS search, source, region, industry, combined filters, main CSV and safe external links');

    await page.locator('#jobList .job').first().getByTitle('Save job').click();
    await page.locator('[data-page="saved"]').click();
    assert.equal(await page.locator('#savedList .job').count(), 1);
    const savedCsv = await downloadText(page, page.locator('#savedExportBtn'));
    assert.match(savedCsv.filename, /talentgrid-jobs-/);
    assert.match(savedCsv.content, /Senior Software Engineer/);
    console.log('PASS saved jobs, saved persistence state and CSV contents');

    await page.locator('[data-page="intelligence"]').click();
    const exampleCompany = page.locator('#intelList .job').filter({ hasText: 'ExampleCo' });
    await exampleCompany.getByRole('button', { name: /In Focus/ }).click();
    assert.equal(await page.locator('#intelSaved').innerText(), '1');
    const prospectsCsv = await downloadText(page, page.getByRole('button', { name: /Export companies/ }));
    assert.equal(prospectsCsv.filename, 'talentgrid-prospects.csv');
    assert.match(prospectsCsv.content, /ExampleCo/);
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('[data-page="intelligence"]').click();
    assert.equal(await page.locator('#intelSaved').innerText(), '1');
    assert.match(await page.locator('#intelList').innerText(), /ExampleCo/);
    console.log('PASS In Focus company shortlist, persistence and prospects CSV');

    await page.locator('[data-page="jobs"]').click();
    await page.locator('#jobList .job').filter({ hasText: 'ExampleCo' }).first().getByTitle('Exclude company').click();
    assert.equal(await page.locator('#jobList .job').count(), 1);
    assert.match(await page.locator('#jobList').innerText(), /OtherCo/);
    await page.locator('[data-page="intelligence"]').click();
    assert.equal(await page.locator('#excludedCount').innerText(), '1 companies');
    assert.match(await page.locator('#excludedList').innerText(), /ExampleCo/);
    assert.doesNotMatch(await page.locator('#intelList').innerText(), /ExampleCo/);
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('[data-page="jobs"]').click();
    assert.equal(await page.locator('#jobList .job').count(), 1);
    await page.locator('[data-page="intelligence"]').click();
    await page.locator('#excludedList').getByRole('button', { name: 'Restore' }).click();
    await page.locator('[data-page="jobs"]').click();
    assert.equal(await page.locator('#jobList .job').count(), 3);
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('[data-page="jobs"]').click();
    assert.equal(await page.locator('#jobList .job').count(), 3);
    console.log('PASS company exclusion, feed/Intelligence filtering, restore and reload persistence');

    await page.route('**/api/jobs', (route) =>
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'QA simulated upstream failure' }),
      })
    );
    const beforeFailure = await page.locator('#jobList .job').count();
    await page.locator('#refreshBtn').click();
    await page.waitForTimeout(250);
    assert.equal(await page.locator('#jobList .job').count(), beforeFailure);
    assert.match(await page.locator('#toast').innerText(), /QA simulated upstream failure/);
    assert.match(await page.locator('#boardList').innerText(), /Error: QA simulated upstream failure/);
    assert.equal(await page.locator('#refreshBtn').isDisabled(), false);
    await page.unroute('**/api/jobs');
    console.log('PASS refresh failure visibility and existing-feed retention');

    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.locator('.nav button').first().isVisible(), true);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 5);
    assert.equal(overflow, false, 'mobile viewport should not have horizontal page overflow');
    console.log('PASS mobile viewport sanity');

    const emptyContext = await browser.newContext({ acceptDownloads: true });
    const emptyPage = await emptyContext.newPage();
    emptyPage.on('pageerror', (error) => errors.push(error.message));
    emptyPage.on('console', (message) => {
      if (message.type() === 'error' && !message.text().includes('503 (Service Unavailable)')) {
        errors.push(message.text());
      }
    });
    await emptyPage.addInitScript(() => {
      localStorage.setItem('talentgrid_v1', JSON.stringify({
        boards: [], jobs: [], saved: [], focusCompanies: [], excludedCompanies: [],
        results: [], lastSync: null, starterSeeded: true,
      }));
    });
    await emptyPage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 45000 });
    assert.match(await emptyPage.locator('#jobList').innerText(), /Your job feed is ready/);
    await emptyPage.locator('#exportBtn').click();
    assert.equal(await emptyPage.locator('#toast').innerText(), 'No jobs to export');
    await emptyContext.close();
    console.log('PASS empty-feed state and empty-export feedback');

    assert.deepEqual(errors, [], 'browser page/console errors');
    console.log('PASS no browser JavaScript or console errors');
    console.log('Phase 0 browser suite passed against ' + BASE_URL);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
