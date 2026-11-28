# TalentGrid QA Plan

QA is an acceptance gate, not an optional ceremony.

## Core smoke tests
- Application loads and navigation renders.
- Boards configuration can be added, edited and removed.
- Fetch/refresh works and provides a visible progress/failure state.
- Provider errors are understandable and don't silently erase prior results.
- Job results have title, company, source and valid external link.
- External links open safely.
- Saved jobs persist as expected.
- Search and filters combine correctly.
- Blacklist/exclusion behavior is consistent.
- Export produces a usable file and correct data.
- Browser reload preserves expected local data.
- No duplicated controls or obvious layout regressions.
- Empty/loading/error states are tested.

## Adapter QA
For each configured adapter: valid identifier, successful response, empty response, malformed payload, unavailable endpoint, timeout, normalization and duplicate handling.

## Regression QA
- Existing board configurations remain.
- Existing saved data is not unintentionally cleared.
- Refresh does not duplicate results.
- Error handling does not replace a usable prior state with a misleading empty state.
- Mobile/desktop layout sanity.

## Target-module acceptance tests
Each roadmap phase has separate acceptance criteria in [Roadmap](ROADMAP.md). Do not claim target CRM, scoring, identity resolution or brief functionality is implemented until it is built and tested.

## Release evidence
Record tested commit, environment, steps, outcomes, failures, fixes, retest and deployment URL. Screenshots/logs should avoid exposing secrets or unnecessary personal data.


## Phase 0 audit results

See [Phase 0 Audit Report](../tests/PHASE0_AUDIT.md). The startup initialization defect was fixed and pushed. Phase 0 remains open until the remaining workflow and production smoke tests are completed and recorded.
