# TalentGrid Decision Log

## Product direction locked
TalentGrid is an internal staffing BD intelligence and lightweight account-management tool. Company-level hiring signals inform prospecting; they are not assumed to prove staffing demand.

## Scope boundaries
No full ATS, candidate database, automated LinkedIn scraping, mass outreach, full CRM replacement, opaque AI scoring, autonomous agents or feature expansion without evidence.

## Scoring model (initial hypothesis)
Role/service fit 30%, hiring intensity 25%, freshness 20%, persistence 15%, source reliability 10%. Weights require calibration from outcomes and must remain explainable.

## Development order
Reliability/data foundation → company-centric radar → explainable prioritisation → prospecting CRM → decision-maker research and prospect brief → outcome feedback.

## Data distinctions
Source posted date, TalentGrid first observed and last observed must remain separate.

## Architecture status
The current repository implementation is static frontend plus serverless fetching and browser-local storage. The locked blueprint is the target direction; implementation status must be represented honestly.
