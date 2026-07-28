# P&ID Review & LPG Spray Fill Differential Pressure Assessment
**Drawing reviewed:** 29629-10-01, Rev 1, 28/10/2025
**Build:** Supagas LPG Rigid Tanker Rehorse
**Prepared by:** Petra — Process & Instrumentation Engineer
**Reviewed by:** MEO
**Date:** 19 May 2026
**Sources:** Drawing 29629-10-01 Rev 1 (Fuel Craft / Liquip Victoria); ADG Code 7th Edition Class 2.1; AS 1596:2014 (LPG storage and handling); Victorian Dangerous Goods Act 1998; ISA 5.1 (P&ID symbology); ISO 5167 (orifice sizing)

---

## Owner-Provided Context
- Three pressure behaviours observed: 300 kPa (bypass active), 500 kPa (bypass closed / L3-50 open), 900 kPa (bypass closed / L3-50 closed)
- Target differential pressure: 700 kPa — currently not achievable
- Bypass valve: new poppet installed, appears snug
- Isolation valve on L3-50 pipework: physically present, **not shown on approved drawing**
- Owner-provided, 19 May 2026

---

## Part 1 — P&ID Drawing Review

### 1.1 Drawing Status
Drawing 29629-10-01 Rev 1 carries **Victorian WorkCover Authority approval**, stamped "APPROVED — Dangerous Goods." This is registered dangerous goods plant. Any modification to the system — physical or procedural — must be assessed against the Victorian Dangerous Goods Act 1998 and the Equipment (Public Safety) Act (Vic) before implementation.

### 1.2 Drawing Completeness — Issues Found

| # | Issue | Severity | Action Required |
|---|-------|----------|-----------------|
| 1 | Isolation valve on L3-50 pipework not shown on approved drawing | **High** | As-built revision required. Drawing must reflect the installed valve. Submit Rev 2 to WorkCover for noting or re-approval. |
| 2 | Line tag "L3-50" not clearly labelled on issued drawing — cross-reference against nodes table requires confirmation | Medium | Confirm line tag against physical installation. Update drawing if tag is incorrect or missing. |
| 3 | Torque settings table marked "TO BE COMPLETED ONLY ON AS-BUILT DRAWING" — values not populated on Rev 1 | Low | Ensure as-built Rev includes completed torque table before final approval. |

**The missing isolation valve on L3-50 is a compliance issue.** The approved drawing does not reflect the as-installed condition. This must be corrected before any operating procedure changes are implemented on this system.

### 1.3 P&ID Assessment — What the Drawing Shows

The P&ID documents a complete LPG road tanker liquid transfer system. Key process paths identified:

| Line | Service | Size | Notes |
|------|---------|------|-------|
| Spray Fill (A–B) | Liquid LPG spray fill | Ø50 (L4-50, L5-50) | Main spray fill delivery |
| Vapour (C–D) | Vapour equalisation | — | Vapour return to source vessel |
| Pump Suction (E–F) | Liquid suction from tanker | Ø40 | Via strainer/air eliminator (item 17) |
| Pump Discharge to Nozzle (P–J) | Pressurised liquid discharge | Ø50 | Via turbine meter, differential valve |
| Vapour Bypass (G–K) | Bypass recirculation | — | Via Ebsray RV19 VRS bypass valve (item 12) |
| Return/Relief (P–Q) | Return/recirculation path | Ø50 | L3-50 line |

The Corken Z3200 (item 7) is a positive displacement hydraulic motor-driven pump — correct selection for LPG liquid transfer. PD pumps produce a fixed flow rate at any given speed; pressure is determined by system resistance. This is fundamental to understanding the three observed pressure states.

---

## Part 2 — Differential Pressure Analysis

### 2.1 The Three Pressure States — Petra's Assessment

**State 1 — 300 kPa (Bypass wound out / active)**
The Ebsray RV19 VRS bypass valve is a spring-loaded differential pressure relief valve. "Wound out" means the spring pre-load has been reduced — the valve opens at a lower differential pressure. At 300 kPa differential, the bypass opens and recirculates pump output back to suction. The pump cannot build above this threshold because all excess flow is bypassed. This is a bypass valve setting issue, not a system or pump fault.

*Confirmed: hydraulically correct.*

**State 2 — 500 kPa (Bypass wound in / closed, L3-50 open)**
With the bypass closed, the pump output must travel through the process system. However, L3-50 provides a parallel return path — a low-resistance route from the high-pressure discharge side back to the low-pressure suction side. This is a hydraulic bypass loop. The Corken Z3200, as a PD pump, will deliver flow into whichever path offers least resistance. With L3-50 fully open, the combined resistance of the spray nozzle path and the L3-50 return path limits the achievable differential pressure to 500 kPa. The system self-balances at this point.

*Confirmed: hydraulically correct.*

**State 3 — 900 kPa (Bypass closed, L3-50 closed)**
All recirculation paths eliminated. The pump must deliver all flow through the spray nozzle. Resistance is at maximum; differential pressure rises to 900 kPa. This is the most important datum point.

*Confirmed: hydraulically correct. This result is diagnostic.*

### 2.2 What the 900 kPa Result Proves

The 900 kPa result eliminates the following as root causes:
- Pump wear or underperformance — a worn pump cannot reach 900 kPa
- Bypass valve body wear or internal leakage — a leaking bypass valve body would cap pressure below 900 kPa in State 3
- Spray nozzle blockage — a blocked nozzle would produce higher pressure, not lower
- Major downstream restriction fault

**The bypass poppet wear question is resolved.** The new poppet appears snug and State 3 reaches 900 kPa. Bypass valve body wear is not the cause of the 500 kPa ceiling. The recirculation loop via L3-50 is the sole cause.

### 2.3 Root Cause — Confirmed

L3-50, when open, acts as a hydraulic bypass across the pump. It is not a fault — it is a configuration issue. The system was not achieving 700 kPa because two recirculation paths were available (bypass valve and L3-50 return), and neither was being managed to set the operating point.

---

## Part 3 — Solution Assessment

### 3.1 Interim Solution — Throttling L3-50

**The proposed interim approach is hydraulically valid:**
1. Run system with bypass closed (wound in)
2. Gradually close L3-50 isolation valve
3. Stop at 700 kPa differential
4. Mark valve position

**Petra's assessment:** This will work. As L3-50 is progressively closed, return flow is restricted, effective system resistance increases, and differential pressure rises toward 700 kPa. The mark-and-lock approach is a legitimate interim measure.

**LPG-specific concern — throttling service on L3-50:**
This is the critical point. L3-50 appears to be a ball valve (DN50 FNPT both end — item 15 or similar). Ball valves are quarter-turn on/off devices — they are **not designed for throttling service**. In LPG service, partially closing a ball valve creates a high-velocity restriction point where LPG can flash to vapour (cavitation). This causes:
- Rapid erosion of the ball and seat
- Control instability (pressure hunting)
- Potential for the valve to become stuck in position over time

**The isolation valve on L3-50 should not be used as a permanent throttling device.** For the interim test (find the 700 kPa setpoint and mark it), single-use throttling to establish the operating point is acceptable. Do not operate continuously with L3-50 partially open using a ball valve.

### 3.2 Permanent Solutions — Petra's Ranking

| Option | Assessment | Recommendation |
|--------|------------|----------------|
| Restriction orifice (fixed) | Best permanent solution for LPG. Passive, no moving parts, no maintenance, no operator error. Correct for the duty. | **Recommended — first choice** |
| Control valve (modulating) | Active control, flexible, but expensive and requires maintenance. Justified only if differential pressure must vary dynamically during operation. | Second choice if variable setpoint needed |
| Lock ball valve in position | Viable as an interim only. Ball valve wear in throttled position is a known LPG failure mode. Not suitable for continuous service. | Interim only — not permanent |

### 3.3 Restriction Orifice Sizing — Preliminary Guidance

The owner's document suggests "~20–25 mm" orifice. **This is an estimate and must be calculated, not assumed.**

Correct sizing requires:
- Confirmed flow rate through L3-50 at the operating condition (requires measurement or pump curve data)
- LPG density and vapour pressure at operating temperature
- Required pressure drop across the orifice to achieve 700 kPa system differential
- Calculation to ISO 5167 or equivalent

**Petra will size the orifice correctly once the following data is provided:**
1. Corken Z3200 pump flow rate at operating speed (L/min or m³/hr) — available from Corken pump curve
2. Operating temperature of LPG at the pump (°C)
3. Measured flow split: what proportion of pump flow passes through L3-50 vs. spray nozzle at the 700 kPa operating point

Until this data is available, the 20–25 mm figure should be treated as a starting estimate only — do not fabricate an orifice to this size without calculation.

---

## Part 4 — Compliance Assessment

### 4.1 WorkCover Implications — Critical

This system carries Victorian WorkCover Authority approval on drawing 29629-10-01. The following actions trigger compliance obligations:

| Action | WorkCover obligation |
|--------|---------------------|
| Operating the L3-50 isolation valve differently from its designed intent (on/off → throttling) | Assess as a procedural modification. Likely requires a Management of Change (MOC) process and may require notification to WorkCover under the DG Act. **Do not implement permanently without this assessment.** |
| Installing a restriction orifice in L3-50 line | This is a physical modification to registered dangerous goods plant. **Requires design registration revision and WorkCover notification before installation.** Drawing 29629-10-01 must be revised to Rev 2 showing the orifice, with approval before fabrication. |
| As-built discrepancy (missing isolation valve on L3-50) | **Must be corrected regardless of other actions.** Issue a drawing revision (Rev 2 minimum) reflecting the installed valve. Submit to WorkCover for noting. |

### 4.2 Recommended Compliance Sequence

1. **Immediately:** Issue drawing revision 29629-10-01 Rev 2 showing the L3-50 isolation valve as installed
2. **Before interim operation:** Conduct MOC assessment for using L3-50 to set differential pressure — consult with WorkCover Victoria or a registered DG adviser on whether notification is required
3. **Before permanent modification:** Submit revised P&ID (Rev 3 or as applicable) showing restriction orifice to WorkCover for approval before fabrication
4. **On approval:** Fabricate and install orifice to calculated size. Update as-built drawing.

### 4.3 Immediate Safe Operating Guidance

Based on the analysis, the system can be operated at 700 kPa differential using the following procedure **for testing and setpoint establishment only:**

1. Confirm bypass valve is wound in (closed) and functional
2. Confirm L3-50 isolation valve is fully open (normal start position)
3. Start pump — system will stabilise at approximately 500 kPa
4. Slowly close L3-50 isolation valve — observe differential pressure gauge
5. Stop closing when differential pressure reaches 700 kPa
6. **Note valve position only — do not operate continuously in this partially closed position**
7. Use this position data to specify the restriction orifice

This procedure does not permanently throttle the ball valve — it uses one-time partial closure to find the operating point, which is acceptable.

---

## Part 5 — Summary

### Can the valve be used? — Petra's Answer

**Yes, for the purpose of finding the 700 kPa setpoint — once, to establish the orifice specification.**
**No, as a permanent throttling device — ball valves in LPG throttling service will fail.**

### Is the analysis correct? — Petra's Answer

**Yes. The hydraulic reasoning in the owner-provided analysis is correct in every material respect:**
- Three pressure states correctly diagnosed
- Recirculation loop correctly identified as the root cause
- 900 kPa datum correctly used to exonerate pump and bypass poppet
- Throttling L3-50 will achieve 700 kPa
- Permanent orifice is the right solution

The analysis does not address the WorkCover compliance obligations or the ball valve throttling service issue — these are the additions Petra brings.

### Outstanding Items Before Permanent Implementation

| Item | Owner | Action |
|------|-------|--------|
| As-built drawing revision (missing isolation valve) | Owner + Liquip Victoria (drawing originator) | Issue Rev 2 immediately |
| MOC assessment for interim operating procedure | Owner + DG adviser | Before operating L3-50 in throttled position |
| Orifice sizing calculation | Petra | Provide pump flow rate and operating temperature data |
| Drawing revision for orifice installation | Petra + Liquip Victoria | After orifice sized, before fabrication |
| WorkCover re-approval for orifice installation | Owner | Submit revised drawing before fabrication |

*Petra — Process & Instrumentation Engineer, The Works | 19 May 2026*
*Note: Petra advises. Statutory sign-off on WorkCover submissions requires a licensed CPEng — owner to engage where mandated by the Equipment (Public Safety) Act (Vic).*
