# TalentGrid Roadmap (Locked)

This sequence is the approved development order. Reliability gates expansion.

## Phase 0 — Reliability and Data Foundation (mandatory gate)
- Stable feeds and clear source errors.
- Reliable deduplication and company identity resolution.
- Search, filtering, refresh, blacklist/exclusion and export.
- Data persistence and preservation.
- Functional QA for core interactions.
- Canonical separation of Company, Job Posting, Job Source, Signal Event, Contact, CRM Account, Activity, Task and Opportunity.

**Exit criteria:** all core interactions tested; failures visible; no unintended data loss.

## Phase 1 — Company-centric Opportunity Radar
Aggregation, company matching, deduplication, role categorisation, filters, company profiles, evidence, dates, exclusion, saved companies and prospecting handoff.

**Acceptance:** duplicate listings don't inflate counts; multiple jobs grouped; source evidence visible; filters combine correctly; exclusions and export verified; refresh preserves stable data; feed errors surfaced.

## Phase 2 — Opportunity Intelligence
Configurable niche/role fit, explainable deterministic scoring, intensity, freshness, persistence, source quality, priority labels and sorting.

**Acceptance:** deterministic score for same inputs; explanation visible; score updates with signal changes; components inspectable; thresholds filterable; no opaque AI score or unsupported conversion probabilities.

## Phase 3 — Prospecting CRM
Accounts, contacts, pipeline, notes, activity log, tasks, follow-up reminders, history, deduplication, nurture/recycling, disqualification and export.

**Acceptance:** no accidental duplicate active accounts; stage/activity/task persistence; correct account/contact associations; follow-ups reliable; overdue visible; new signals update existing records; export verified.

## Phase 4 — Decision-maker research and Prospect Brief
Stakeholder suggestions, contact management, external links, evidence-based briefs, outreach context and refresh-on-signal-change.

**Acceptance:** no fabricated contacts/claims; sources visible; drafts editable; manual contact entry; evidence retained and connected to CRM.

## Phase 5 — Outcome feedback
Track score-to-conversation, role-category outcomes, response, signal usefulness, outreach effectiveness, clients, disqualification and source performance. Calibrate scoring only with real outcome evidence.

**Acceptance:** outcome data quality is reviewed and calibration changes are documented.

## Change control
Roadmap deviations require explicit approval or compelling evidence from real usage. Avoid scope drift.
