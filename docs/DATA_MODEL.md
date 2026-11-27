# TalentGrid Data Model

The following is a target conceptual model, not a description of a currently provisioned database.

## Company
Canonical identity: id, name, normalized name, domain, industry, locations, size (when sourced), website, company LinkedIn URL, aliases, identity-resolution status and timestamps.

## JobPosting
Canonical job: id, company id, source id, source job identifier, title, normalized role/category, seniority, location, employment type, workplace type, original URL, original/source dates, first observed, last observed, status, content/description snapshot and deduplication fingerprint.

## JobSource
Source/board configuration, provider, company/board identifier, source URL, retrieval status, last checked, error details and reliability metadata. Secrets, if ever required, belong in server-side secret storage, not client data.

## SignalEvent
Event type (new, reposted, changed, still active, removed, etc.), company/job linkage, timestamp, evidence, source and signal dimensions.

## Contact
Name, title, company, profile URL, email/phone only when appropriately sourced, source, verification state, reviewed date, notes and relationship status.

## CRMAccount
Company linkage, owner, stage, priority, status, qualification/disqualification, notes, next action, follow-up date and history.

## Activity
Account/contact linkage, activity type, timestamp, summary, channel and outcome.

## Task
Account/contact linkage, owner, task type, due date, status, snooze, completion and notes.

## Opportunity
Account linkage, requirement/context, status, estimated value only when justified, owner, source signals, milestones and outcome.

## Persistence and integrity requirements
- Unique/normalized identity rules with auditable merge decisions.
- Idempotent signal ingestion.
- Deduplication without losing original source records.
- Referential integrity for activities and tasks.
- Change history for pipeline stage and scoring.
- Export/import and backup strategy.
- Retention and privacy controls.
- Migration strategy before replacing current browser-local storage.
