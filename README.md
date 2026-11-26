# TalentGrid — India Jobs Intelligence

A Vercel-deployable, India-focused employer ATS sourcing dashboard. The browser UI is a dependency-free static app; live ATS fetching runs through a Vercel serverless function in `api/jobs.js`.

## Included connectors

| Provider | Public endpoint support | Company-specific value needed |
|---|---|---|
| Greenhouse | Yes | Board token from `boards.greenhouse.io/{token}` |
| Lever | Yes | Site name from `jobs.lever.co/{site}` |
| Ashby | Yes | Board name from `jobs.ashbyhq.com/{board}` |
| SmartRecruiters | Yes | Company identifier |
| Workday | Public CXS job search endpoint | `tenant|site|wdN`, e.g. `acme|External|wd3` |
| Recruitee | Public offers endpoint | Company subdomain |
| Custom JSON | Yes, public HTTPS only | URL returning an array or `{ "jobs": [] }` |

Each ATS board must be added by the user. The app does not have a global ATS directory or a universal endpoint that reveals every employer using a provider. Greenhouse, Lever, Ashby, SmartRecruiters and Recruitee public boards generally do not need API credentials. Workday tenant endpoints and custom endpoints may vary or change. Darwinbox, SAP SuccessFactors, Oracle Recruiting, PeopleStrong, Keka and TurboHire are not represented as universal connectors because public job APIs/tenant schemas are not consistent across customers; connect those through a compatible public JSON endpoint where available or add a future tenant-specific adapter.

## Deploy to Vercel

1. Extract the ZIP and push the contents of this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Framework preset: **Other**. Build command: leave blank. Output directory: `.`.
4. Deploy. No build step or external API key is required for the included public connectors.
5. Open the deployment, go to **Company boards**, add the company and its ATS identifier, then select **Refresh jobs**.

The serverless function runs at `/api/jobs`. `vercel dev` runs the app locally.

## How to add a board

- Greenhouse: if the public career page is `https://boards.greenhouse.io/acme`, enter `acme`.
- Lever: if `https://jobs.lever.co/acme`, enter `acme`.
- Ashby: if `https://jobs.ashbyhq.com/acme`, enter `acme`.
- SmartRecruiters: enter the company identifier used by its public career page.
- Workday: enter `tenant|site|wdN`, for example `acme|External|wd3`. Confirm the tenant, site and region from the employer's actual career page.
- Recruitee: if `https://acme.recruitee.com`, enter `acme`.
- Custom JSON: enter a public HTTPS endpoint returning a JSON array or an object with `jobs`, `results`, or `data` array. It must provide a title and an absolute HTTPS application URL for each job.

## Current storage model and operational limits

- Company boards, fetched jobs and saved jobs are stored in the browser's `localStorage`. They persist in that browser profile, but are not shared across devices/users and are cleared if browser site data is removed.
- No external database, login system, scheduled background refresh, email alerts, or team collaboration is provisioned. Add a managed database and authentication before multi-user/team rollout.
- Refresh is user-triggered. The dashboard fetches up to 30 boards per request and at most 500 records per board (provider APIs may return fewer; Workday/SmartRecruiters pagination is currently limited to the first page).
- Job availability, posting dates, location formats and public endpoint access depend on each employer/ATS. A company board can block requests or change its schema. Errors are reported per board.
- India is the intended sourcing scope. Set each employer board's country to India when adding it. Some global boards may still expose roles outside India; inspect location before sourcing.
- Public career pages are not proof that an employer accepts staffing vendors. Confirm vendor empanelment, contract model and hiring status independently.

## Security notes

- Do not enter private API secrets into a custom URL or job description. Custom connector support is for public JSON endpoints only; it does not accept custom authorization headers.
- The `/api/jobs` route fetches user-supplied public HTTPS URLs for custom connectors. For a public production deployment, add authentication, rate limiting, strict outbound host allowlisting and an approved custom-domain policy before enabling untrusted users. The current version is designed as a private, single-operator workspace.
- API responses are treated as untrusted data and rendered as escaped text. External job links open in a new tab with `noopener noreferrer`.

## Local development

```bash
npm install
npx vercel dev
```

Open the local URL printed by Vercel CLI.
