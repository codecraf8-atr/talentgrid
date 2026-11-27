# TalentGrid Deployment Guide

## Vercel
The current Vercel project is named `talentgrid` and is linked to the Git repository. Deployment is handled through the Vercel Git integration unless changed in project settings.

### Current repository configuration
- No framework build is configured; static application files are served.
- Serverless functions live in `api/*.js`.
- `vercel.json` configures a 30-second function duration and baseline security headers.
- Node version configured in project settings was observed as 26.x; package metadata specifies Node >=20. Confirm compatibility before changing runtime.

### Production verification
1. Confirm the Git commit and branch deployed.
2. Inspect Vercel build and runtime logs.
3. Confirm static UI loads.
4. Confirm `POST /api/jobs` behaves as expected using non-sensitive test configuration.
5. Test provider success and error states.
6. Confirm environment variables are present without exposing secret values.
7. Verify domains, access protection and production target.
8. Perform functional smoke tests and record results.

### Access protection
Project inspection indicated SSO protection enabled for deployments except custom domains. Verify the protection policy and domain access rules against the intended single-operator access model.

### Local development
```bash
npm install
npx vercel dev
```

## Environment variables
Provider credentials, when used, are set as Vercel server-side environment variables:
- `JOBVETTA_API_KEY`
- `JOA_API_KEY` or `JOBOPPORTUNITIES_API_KEY`
- Optional `ALLOWED_ORIGIN`

Do not commit secrets. Do not paste secret values into documentation or logs.

## Deployment workflow
1. Review changes and scope.
2. Create a branch for risky changes when feasible.
3. Commit documentation/code changes.
4. Deploy to preview.
5. Run QA checklist.
6. Promote/merge to production only after checks.
7. Record deployment and verification.

## Rollback
Use Vercel deployment rollback/previous production deployment promotion if a release causes regression. Preserve data and investigate before repeated redeployments. Confirm the restored version and smoke test it.
