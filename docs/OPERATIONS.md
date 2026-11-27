# TalentGrid Operations and Security

## Current operational model
The current application is a single-operator browser workspace. Boards and job/saved-job data use browser-local storage, so the data is not shared across devices and is not protected by a server-side backup. Export and manual backup procedures are important.

## Current security posture and known gaps
- The job endpoint is unauthenticated.
- CORS is permissive by default unless configured.
- Custom JSON connector fetches user-supplied public HTTPS endpoints; current basic host filtering is not a comprehensive SSRF defence.
- No rate limiting or user identity/authorization is implemented.
- The legacy token vault endpoint is disabled.
- Browser-local data can be lost when site data is cleared or browser profile is lost.

For public multi-user access, prioritize authentication, authorization, request limits, robust outbound allowlisting, secure storage, logging, privacy review and database backup.

## Data and sourcing principles
- Preserve original source links and retrieval context.
- Public postings are signals, not confirmation of vendor requirements.
- Avoid unsupported claims about hiring difficulty or company intent.
- Contact data must be appropriately sourced and minimally retained.
- LinkedIn scraping and automated mass outreach are not part of the locked plan.
- Respect platform terms, privacy laws and applicable retention requirements.

## Operator checklist
- Review provider errors and source changes.
- Export/backup browser-local data periodically.
- Keep credentials server-side and rotate if exposed.
- Review Vercel access protection and domains.
- QA before production changes.
- Record release and rollback information.
