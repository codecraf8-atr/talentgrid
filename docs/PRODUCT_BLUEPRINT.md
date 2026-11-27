# TalentGrid — Product Blueprint (Locked)

## Positioning
TalentGrid is an internal staffing business-development intelligence and account-management system. Its commercial objective is to help consistently identify, qualify, approach, follow up with, and convert companies into staffing clients.

**Positioning line:** Hiring intelligence. Prospecting. Relationships.

TalentGrid complements LinkedIn, Sales Navigator, email and existing ATS/CRM systems. It is intended to replace manual job-board hunting, repeated company research, scattered prospect spreadsheets, forgotten follow-ups and unstructured qualification—not those external tools.

## Operating journey
1. **Discover:** hiring signals and company activity.
2. **Qualify:** fit, demand, timing and evidence quality.
3. **Research:** company context and buyer research.
4. **Engage:** human-controlled LinkedIn, email and calls.
5. **Convert:** requirements, client acquisition, revenue and learning.

Features must serve this journey.

## Five capabilities
### 1. Opportunity Radar
Company-level aggregation rather than treating every vacancy as an independent lead. Required target capabilities: company identity resolution, deduplication and repost detection, source links, source posted date, first observed and last observed timestamps, role/seniority/location/employment-type normalization, category grouping, relevant-role filters, exclusions/blacklists, saved searches and adding accounts to prospecting.

Keep three dates distinct: source-posted date, TalentGrid first-observed date and last-observed date.

### 2. Opportunity Intelligence
Explainable rule-based composite score, initially configurable:
- Service/role fit: 30%
- Hiring intensity: 25%
- Signal freshness: 20%
- Persistence/repeated demand: 15%
- Signal/source reliability: 10%

These are initial hypotheses, not validated weights. Score explanations must be inspectable. Scores are not probabilities of winning a client. Labels: Priority, Investigate, Monitor, Excluded.

### 3. Account & Decision-maker Research
Persistent account record: company name/domain, industry, location, size when available, website, LinkedIn company URL, hiring activity/history, notes, prospecting status, outreach history, contacts and tasks.

Suggested stakeholder roles are search targets, not presumed contacts: TA leaders, HR leadership, engineering leadership and CTO. Contact records should retain source, verification status, LinkedIn URL, notes, last-reviewed date and relationship status. Prefer public company information, supplied information and external research links. No automated LinkedIn scraping.

### 4. Prospect Brief & Outreach Context
Generate on demand from stored evidence. Include overview, hiring signals, why the account may merit outreach, suggested buyer (subject to validation), conversation angle and evidence links. Draft emails, LinkedIn messages, call openings and follow-ups are editable and human-controlled.

Never invent contacts or company facts. Distinguish verified facts from hypotheses; never assert a company is struggling without evidence.

### 5. Prospecting CRM
Pipeline stages: Discovered → Shortlisted → Researching → Contact identified → Outreach in progress → Engaged → Opportunity → Client. Additional states: Nurture, Disqualified, Closed-lost, Existing client.

Account fields include owner, priority, notes, history, hiring-signal timeline, contacts, activities, tasks, follow-up date, disqualification reason and sources. Activity types: call, email, LinkedIn, meeting, note, follow-up and custom. Tasks need due/overdue/upcoming, snooze and completion states.

New relevant signals should re-evaluate nurture accounts without erasing their history.

## Dashboard: Daily Prospecting Desk
Task-oriented, not vanity analytics. Sections: today's actions, priority accounts, new signals, pipeline and follow-ups. Focus on the daily workflow and commercial utility.

## Deliberately out of scope (for now)
- Full ATS or candidate database.
- Automated LinkedIn scraping.
- Automated mass outreach or autonomous agents.
- Full Salesforce/HubSpot-style CRM.
- AI chatbot for its own sake.
- Opaque AI scoring or conversion probabilities.
- Email sequencing or automated sending before process validation.
- Broad social-media monitoring.
- Paid contact database until ROI is demonstrated.
- Complex analytics before outcome data exists.

## Success measures
Operational: qualified/unique companies, duplicate rate, signal freshness, relevant openings/account, accounts reviewed and research time.
Commercial: shortlisted accounts, contacts identified, outreach, response rate, conversations, requirements, opportunities, clients, discovery-to-outreach time and conversion by signal.
Primary founder metrics: qualified accounts/week, discovery-to-outreach time, prospect-to-conversation conversion and conversation-to-requirement/client conversion.

## Guardrails
Source attribution, data minimization, controlled retention, transparency and applicable privacy/platform rules. Public information does not automatically grant permission for processing or marketing. Human judgment remains central.
