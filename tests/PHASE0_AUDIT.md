# Phase 0 Audit — Baseline Findings

**Audit date:** 2026-11-28  
**Scope:** Repository baseline, browser startup, navigation/modal smoke testing and initial API review.  
**Commit containing startup fix:** `eb1b49c87b0f227c12401c84dfb5a694690505e8`

## Defect found and fixed

### Startup temporal-dead-zone error
The page initialized `state=loadState()` before the `STARTER_BOARDS` constant was declared. The initial browser QA captured:

- `Cannot access 'STARTER_BOARDS' before initialization`
- `Cannot access 'state' before initialization`

The exception prevented reliable initialization and left the startup state partially broken.

**Fix:** move workspace state initialization to after the starter-board constant is declared. Commit `eb1b49c` pushed to `main`. Vercel deployment was triggered for that commit; at audit report time its deployment was still initializing.

## Baseline checks performed

- Browser loaded the static UI using Chromium/Playwright.
- Page title and core navigation rendered.
- The first attempt confirmed browser exceptions at startup.
- Initial attempts to exercise modal and navigation were interrupted by the startup defect and sandbox command lifecycle.
- A repeat browser session after patch was attempted but the sandbox session terminated before a complete retained test report could be retrieved.
- Vercel CLI local deployment was blocked by unavailable sandbox credentials.

## Not yet verified end-to-end

- Successful live fetch against each ATS adapter.
- Provider error/recovery behavior with fixtures.
- CSV file contents and downloaded file validation.
- Saved-job persistence across reload.
- Board CRUD persistence across reload.
- Filters in combination.
- Blacklist/exclusion and In Focus behavior.
- Job deduplication and company identity behavior.
- Workday pagination, provider pagination and request limits.
- Production deployment readiness and real production smoke test.

## Known architecture/security limitations to remediate or consciously accept before public multi-user use

- Browser-local persistence only; no server database or backup.
- No authentication/authorization at the API endpoint.
- Permissive CORS by default.
- Custom connector outbound-fetch restrictions are not comprehensive SSRF/DNS-rebinding defenses.
- No rate limiting or quota enforcement.
- The current design is a private single-operator workspace.

These limitations are already reflected in product documentation. They are not considered solved by this audit.

## Audit disposition

**Phase 0 remains in progress.** The startup initialization defect is fixed, but Phase 0 must not be declared complete until the remaining core workflow regression tests are executed, recorded and passed, and the production deployment is confirmed ready and smoke-tested.
