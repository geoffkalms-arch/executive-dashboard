# Quality System — Baseline Analysis & Data Improvement Plan
## Aviation Manufacturing | June 2026

*Internal Working Document | Quality & Operations*

---

## Purpose

This document establishes a baseline of quality performance using repair action data captured to June 2026, identifies hotspots by cell, defect type, and job, and defines specific improvements to how data is collected so that future analysis is faster, more accurate, and more actionable.

---

## Section 1 — Dataset Overview

| Metric | Value |
|---|---|
| Total repair actions analysed | 4,964 |
| Date range | September 2024 – June 2026 |
| Primary site | Aviation (4,127) and Offline Aviation (789) |
| Records with status "Complete" | 4,206 (85%) |
| Records "To Do" (open) | 166 |
| Records "Pending PCA / post-ship" | 53 |
| Records "Won't Do / Hold / Duplicate" | 539 |

**Note on "Won't Do / Hold / Duplicate" (539 records):** This category should be reviewed. Some may be legitimate duplicates — but others may be deferred issues that were never properly resolved. A one-off audit of this category is recommended.

---

## Section 2 — Volume Trend

Repair action volume has grown 72% over 18 months. This is significantly faster than business growth alone would explain, indicating a process quality problem that is compounding with scale.

| Month | Actions | Month | Actions |
|---|---|---|---|
| Oct 2024 | 210 | May 2025 | 139 |
| Nov 2024 | 154 | Jun 2025 | 296 |
| Dec 2024 | 128 | Jul 2025 | 349 |
| Jan 2025 | 215 | Aug 2025 | 273 |
| Feb 2025 | 226 | Sep 2025 | 207 |
| Mar 2025 | 267 | Oct 2025 | 202 |
| Apr 2025 | 219 | Nov 2025 | 159 |
| | | Dec 2025 | 174 |
| | | Jan 2026 | 309 |
| | | Feb 2026 | 344 |
| | | Mar 2026 | **362 (peak)** |
| | | Apr 2026 | 276 |
| | | May 2026 | 249 |
| | | Jun 2026 | 195 |

**Action required:** Establish a monthly volume target and track against it. Without a target, trend data has no meaning. Suggested starting target: reduce monthly repair actions to below 150 within 12 months.

---

## Section 3 — Defect Type Analysis

### 3.1 Top Concern Categories

| Concern | Count | % of total |
|---|---|---|
| Missing | 1,625 | 33% |
| Loose | 177 | 4% |
| Not fitted | 120 | 2% |
| Incomplete | 85 | 2% |
| Not secured | 79 | 2% |
| Not sealed | 56 | 1% |
| Not filed | 56 | 1% |
| Not working | 41 | 1% |
| Leaking | 37 | 1% |
| Wrong / Incorrect | 32 | 1% |
| Dirty | 29 | 1% |
| Damaged | 25 | 1% |
| Rubbing / Clash | 24 | <1% |
| Blank / Not recorded | 149 | 3% |

**Key insight:** "Missing" at 33% dwarfs every other category. This is a BOM completeness and assembly checklist failure, not a workmanship failure. The fix is upstream — at engineering and planning, not on the floor.

### 3.2 Initiator Breakdown (Who Found It?)

| Initiator | Count | Meaning |
|---|---|---|
| Q — Quality Inspection | 2,895 | Caught by our inspection process |
| C — Customer | 392 | Reached the customer before detection |
| V — VASS | 90 | Caught at VASS inspection |
| S — Safety | 80 | Safety-related finding |
| M — Manufacturing | 20 | Self-identified on the floor |
| Not recorded | 1,421 | Unknown origin |

**Critical concern:** 392 customer-initiated issues. In aviation refuelling equipment, defects reaching the customer carry reputational and safety risk. This number must trend to zero.

**Data gap:** 1,421 records (29%) have no initiator recorded. This makes it impossible to understand where in the process issues are being caught. Mandatory field — see Section 5.

### 3.3 Recurring Part Issues — Systemic BOM Failures

The following items have appeared repeatedly across multiple jobs. Each represents a gap in the standard BOM or closing checklist that should be permanently fixed:

| Part | Occurrences | Recommended action |
|---|---|---|
| Build checklist incomplete | 29 | Enforce checklist completion as mandatory closure step |
| Spare wheel | 21 | Add to every relevant standard BOM |
| Fuel circuit plate/label | 14 | Add to every relevant standard BOM |
| Ladder | 14 | Add to every relevant standard BOM |
| Filter vessel elements | 11 | Clarify supply/fit responsibility in BOM |
| Weighbridge docket | 10 | Add to closing documentation checklist |
| Flameproofing | 10 | Add to every relevant standard BOM |
| Control panel nutserts | 9 | Add to every relevant standard BOM |
| 5th wheel VASS label | 9 | Add to closing documentation checklist |
| EWP compliance plate | 9 | Engineering to ensure current standard |
| Wheel nut indicators | 7 | Add to every relevant standard BOM |
| Pressure vessel door seal | 7 | Add to every relevant standard BOM |
| Soak test form | 7 | Add to closing documentation checklist |

**These fixes should be implemented within 2 weeks. Each is a one-time correction that eliminates a recurring defect permanently.**

---

## Section 4 — Hotspot Analysis

### 4.1 By Cell (Label field)

| Cell | Repair Actions | Notes |
|---|---|---|
| Manufacturing Aviation — General | 2,284 | *See note below* |
| Manufacturing Aviation — C8-9 | 1,061 | Highest specific cell — investigate |
| Engineering (Mech) | 352 | |
| Engineering (Documentation) | 289 | |
| Sales | 262 | Spec/handover related |
| Quality | 244 | Actions assigned to quality for resolution |
| Manufacturing Aviation — C1-4 | 179 | |
| Supplier (Stores/Purchasing) | 176 | Supply chain originated |
| Manufacturing Aviation — C5-7 | 174 | |
| Paint | 168 | |
| Manufacturing (WO) — Fabrication | 132 | |
| Engineering (Elect) | 125 | |
| Manufacturing Aviation — C10 | 120 | |
| Flame Proofing | 63 | |
| Engineering (Software) | 14 | |
| Ops | 8 | |

**"Manufacturing Aviation — General" (2,284 records):** This label is being used when an issue spans the whole build or the responsible cell is not identified. Nearly half the dataset cannot be attributed to a specific cell. This is the single biggest data quality problem in the system — you cannot fix what you cannot locate. See Section 5 for the fix.

**C8-9 Investigation:** C8-9 has more than double the repair actions of C1-4 and C5-7 combined. Before drawing conclusions, establish:
- Does C8-9 handle the most complex or final-stage assembly? (if so, higher visibility expected)
- Is the defect rate per job higher in C8-9, or just absolute volume?
- What are the dominant defect types in C8-9?

### 4.2 By Job — Highest Repair Action Count

| Job | Repair Actions |
|---|---|
| 801197 | 91 |
| 801153 | 87 |
| 801174 | 85 |
| 801212 | 83 |
| 801261 | 80 |
| 28567 | 76 |
| 801154 | 74 |
| 801125 | 69 |
| 801186 | 67 |
| 801175 | 67 |

**Recommended action:** Run a retrospective on the top 5 jobs. For each: what product type, what cell, what were the dominant defect categories? Are the same issues appearing across multiple high-count jobs? This will confirm whether the problem is job-type specific, cell specific, or systemic across the board.

### 4.3 Age of Open Items

| Category | Count |
|---|---|
| Open items (To Do + Pending) | 219 |
| Open more than 30 days | 1,062 |
| Open more than 90 days | 298 |
| Open more than 180 days | 108 |
| Maximum days open | 506 days |

**Items open more than 180 days (108 records) require immediate individual review.** An item open for 506 days is not a repair action — it is an unresolved structural problem. Each of these should be escalated, resolved, or formally closed with a documented reason.

### 4.4 Root Cause Closure Rate

| Metric | Value |
|---|---|
| Records with root cause owner documented | 108 |
| Records with root cause blank | 4,856 |
| Root cause closure rate | **2%** |

This is the most significant process gap in the quality system. We are recording that problems exist and recording that they were fixed. We are not recording why they happened or who is responsible for ensuring they don't happen again. The result: the same defects recur indefinitely.

### 4.5 Repair Time — Not Being Recorded

Only 3 of 4,964 records have repair time recorded. Total logged: 2 hours.

The true cost of poor quality — in labour hours diverted from productive work to rework — is completely invisible. Without this data, there is no business case for investment in prevention and no way to measure the financial return of quality improvement.

---

## Section 5 — Data Collection Improvements

The current dataset is valuable but significantly limited by incomplete data entry. The following changes will make every future analysis faster, more precise, and more actionable.

### 5.1 Mandatory Fields (must not be closeable without completion)

| Field | Current state | Required state | Why |
|---|---|---|---|
| **Initiator** | Blank on 29% of records | Mandatory at creation | Determines where in the process issues are caught |
| **Label (Cell)** | "General" used 46% of the time | Mandatory specific cell | Cannot fix what you cannot locate |
| **Root Cause Owner** | Blank on 98% of records | Mandatory before closure | Without this, every fix is one-off and issues recur |
| **Repair Time (Hours)** | Recorded on 3 records | Mandatory at closure | Makes cost of poor quality visible |
| **Part Number** | Largely blank | Mandatory where applicable | Enables supply chain and BOM analysis |

### 5.2 Retire the "General" Label

**The "Manufacturing Aviation — General" label must be retired.** It currently absorbs 46% of all repair actions and makes cell-level analysis impossible.

Replace with:
- A structured label set that mirrors your actual cell/area structure
- A mandatory rule: every action must be attributed to the most specific responsible cell possible
- Where an issue genuinely spans multiple cells, allow multi-select — but "General" as an escape hatch should not exist

### 5.3 Standardise the Concern Field

The "Concern" field is currently free text. This makes categorisation possible but inconsistent ("missing", "Missing", "Missing ", "not supplied", "Not supplied" are all the same category but appear as separate entries in analysis).

**Replace with a controlled dropdown:**

| Category | Examples |
|---|---|
| Missing — not in BOM | Part not specified in BOM |
| Missing — BOM correct, not fitted | Part specified, not installed |
| Incorrect — wrong part | Wrong specification fitted |
| Incorrect — wrong sealant/fastener | Wrong material used |
| Loose / Not secured | Fasteners, fittings, guards |
| Not sealed / Leaking | Seals, gaskets, connections |
| Not working / Functional failure | Electrical, pneumatic, hydraulic |
| Damaged | Transport, handling, manufacturing damage |
| Documentation missing | Manuals, certificates, forms |
| Documentation incorrect | Wrong version, incomplete |
| Not painted / Finish defect | Paint, coating, surface |
| Clash / Interference | Physical conflict between components |
| Compliance — label/plate | Regulatory labels, compliance plates |
| Compliance — certification | Missing certificates, out of date |
| Other (with mandatory description) | |

### 5.4 Add a Root Cause Category Field

Separate from "Root Cause Owner," add a **Root Cause Category** dropdown:

| Category | Description |
|---|---|
| BOM incomplete | Item not in bill of materials |
| BOM incorrect | Wrong item, wrong quantity in BOM |
| Engineering drawing error | Error in drawing released to floor |
| Engineering package late | Late release caused downstream issue |
| Assembly omission | BOM correct, item not fitted |
| Wrong specification | Built to wrong version/spec |
| Supplier defect | Part received defective or wrong |
| Supplier late delivery | Material not available when needed |
| Process not followed | Correct process exists, not followed |
| Process does not exist | No process defined |
| Documentation not filed | Physical/digital filing failure |
| Sales specification error | Incorrect spec at order stage |
| Customer-requested change | Post-order scope change |
| Transport damage | Damaged after leaving facility |

### 5.5 Introduce Repair Time Tracking

Implement mandatory repair time capture at action closure. Even rough estimates (0.5, 1, 2, 4, 8 hours) are valuable. Within 3 months this will produce:
- Total monthly rework hours by cell
- Cost-of-quality estimate (hours × labour rate)
- Return-on-investment data for quality improvement initiatives

### 5.6 Job Type Field

Add a field identifying the product type for each action:
- Aviation Refueller
- Aviation Dispenser / Hydrant Dispenser
- Fuel Tanker
- Bulk Liquid Transport
- Pump Skid
- Other

This enables defect rate analysis by product type — critical for understanding whether quality problems are concentrated in specific products.

---

## Section 6 — Reporting Cadence

Once data collection improves, the following reporting rhythm should be established:

### Weekly (Quality Lead)
- Open repair actions by cell — count and age
- New actions raised this week by cell
- Actions closed this week
- Any action open more than 30 days: flagged for escalation

### Monthly (Management Review)
- Total repair actions vs prior month vs same month last year
- Defect category breakdown — top 10 and trend
- Cell-level breakdown — who generated, who closed
- Customer-initiated defects — count and description
- Root cause closure rate (target: 100%)
- Repair time hours by cell (cost of poor quality)
- Top 5 recurring issues with corrective action status
- Jobs with highest repair action count — retrospective on outliers

### Quarterly (Leadership)
- Trend analysis — is the quality improvement programme working?
- Recurring issues resolved vs still open
- BOM and checklist improvement actions completed
- Customer defect trend
- KPI scorecard update

---

## Section 7 — Immediate Actions (Next 30 Days)

| Action | Owner | Due | Priority |
|---|---|---|---|
| Add recurring items to standard BOMs (spare wheel, ladder, nutserts, etc.) | Engineering | Week 1 | Critical |
| Make Initiator field mandatory in quality system | Quality / IT | Week 1 | Critical |
| Make Root Cause Owner mandatory before closure | Quality / IT | Week 1 | Critical |
| Add Repair Time field — mandatory at closure | Quality / IT | Week 2 | High |
| Retire "General" label — implement cell-specific labels | Quality / IT | Week 2 | High |
| Add Concern Category dropdown (retire free text) | Quality / IT | Week 3 | High |
| Add Root Cause Category dropdown | Quality / IT | Week 3 | High |
| Audit 108 items open more than 180 days — resolve or formally close | Quality Lead | Week 4 | High |
| Review 539 "Won't Do / Hold / Duplicate" items | Quality Lead | Week 4 | Medium |
| Run retrospective on top 5 jobs by repair action count | Quality + Production | Week 4 | Medium |
| Assign internal data analysis owner | Management | Week 2 | High |
| Set monthly volume target (baseline: 195 in June 2026) | Quality + Management | Week 2 | High |

---

## Section 8 — Data Ownership

**Who analyses this data going forward?**

The current dataset is being analysed manually. For this to become a management tool — not a one-off exercise — someone must own it.

**Minimum viable:** An internal person with Excel/Power BI capability dedicating 20–30% of their time to quality data. They produce the monthly report, flag trends, and own the corrective action register.

**Longer term:** A dedicated Quality/Continuous Improvement role whose job is to own the data, close root causes, and drive defect reduction. At the current volume of repair actions and the current growth trajectory, this role pays for itself in rework hours saved.

**In both cases:** the data owner needs authority to require corrective action, not just report on it. Reporting without authority produces dashboards, not improvement.

---

*Quality Analysis Baseline — June 2026*
*Version 1.0 | Internal Document*
