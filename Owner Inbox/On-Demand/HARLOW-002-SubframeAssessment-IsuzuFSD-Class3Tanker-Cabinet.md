# Engineering Assessment — Subframe Requirement
**Build:** Rigid tanker + cabinet, Class 3 fuels, Isuzu FSD 140-240 AM R56
**Prepared by:** Harlow — Heavy Vehicle Body Engineer
**Reviewed by:** MEO
**Date:** 19 May 2026
**Sources:** Isuzu Body Builder Guide (2018); Isuzu FSD 140/120-240 Specification Guide (isuzu.com.au, 2604 R3); VSB 06 Section J — Heavy Vehicle Body Mounting Guidelines; AS 2809.2:2020; AS/NZS 3678; AS/NZS 1163

---

## Owner-Provided Data
- Tank + liquid (nominal): 7,000 kg — owner-provided, 19 May 2026
- Cabinet (between tank and cabin): ~750 kg — owner-provided, 19 May 2026

---

## 1. Chassis Weight Budget — First Check

Before subframe design, payload margin must be confirmed.

| Item | Weight | Source |
|------|--------|--------|
| GVM | 14,000 kg | Isuzu FSD 140/120-240 spec, isuzu.com.au — observed 19 May 2026 |
| Front axle limit | 5,000 kg | Isuzu FSD 140/120-240 spec, isuzu.com.au — observed 19 May 2026 |
| Rear axle limit | 9,000 kg | Isuzu FSD 140/120-240 spec, isuzu.com.au — observed 19 May 2026 |
| Cab chassis tare | ~4,071 kg | Isuzu FSD 140/120-240 spec, isuzu.com.au — observed 19 May 2026 |
| Available payload | ~9,929 kg | Derived: GVM minus tare |
| Tank + liquid | 7,000 kg | Owner-provided, 19 May 2026 |
| Cabinet | ~750 kg | Owner-provided, 19 May 2026 |
| Subframe estimate | ~300–400 kg | Engineering estimate, allowance only |
| **Total body load** | **~8,050–8,150 kg** | — |
| **Remaining margin** | **~1,780–1,880 kg** | — |

**Total laden weight is within GVM.** Payload budget is not the constraint.

**However — axle load distribution IS the constraint to watch.** See Section 6.

---

## 2. Is a Subframe Required?

**Yes — mandatory.**

Same engineering reasoning as any rigid tanker build: the Isuzu FSD chassis rails are designed for controlled longitudinal flex. The tank shell and cabinet are rigid bodies. The subframe is the engineered interface that manages load transfer and prevents torsional stress from being transferred directly into the chassis rails or the bodies.

For this build, the subframe carries two bodies (tank and cabinet) with different load characteristics and different CoG heights. A properly designed subframe is the only way to manage this cleanly.

*Source: Isuzu Body Builder Guide 2018 — observed: 19 May 2026*

---

## 3. Are Cross Members Required?

**Yes — mandatory.**

Isuzu BBI confirms cross members are required to prevent lateral movement and provide torsional rigidity. For a two-body build, cross members also provide the structural transition point between the cabinet section and the tank section of the subframe — particularly important where the body type changes and load distribution shifts.

Place cross members at:
- Front and rear of cabinet
- Transition point between cabinet and tank
- At each tank baffle position
- At each tank saddle/cradle
- Rear end of tank
- Maximum unsupported span: 900–1,200 mm

*Source: Isuzu Body Builder Guide 2018 — observed: 19 May 2026*

---

## 4. Cross Member Material

**Grade 350 RHS to AS/NZS 1163. Same specification as the Volvo FM build.**

| Component | Specification |
|-----------|--------------|
| Cross members | Grade 350 RHS — AS/NZS 1163 |
| Subframe rails | Grade 350 C-channel or RHS — AS/NZS 3678 / 1163 |
| Minimum yield strength | 360 MPa |

Do not use Grade 250 mild steel. The dynamic loading from liquid surge in a Class 3 tanker combined with the cabinet overhang load makes Grade 250 inadequate.

*Source: AS/NZS 3678; AS/NZS 1163 — observed: 19 May 2026*

---

## 5. Isuzu-Specific Mounting Rules — Critical Differences from Volvo

**The Isuzu BBI has a hard rule that differs from Volvo:**

> **The subframe must be bolted to the chassis frame. It must NOT be welded.**

This is non-negotiable for Isuzu. Welding the subframe to the Isuzu chassis frame voids the chassis warranty and violates the BBI. All attachment is via bolted brackets through the chassis web.

Additional Isuzu-specific requirements:
- Subframe must be mounted **as close to the cab as possible** — do not leave a gap between the back of the cab and the start of the subframe
- Subframe must be **contoured to match** the chassis frame profile — do not use a flat-profile subframe on a chassis with a kick-up
- Bolts or brackets must be positioned **at least 50 mm behind the front kick-up point** of the chassis rail
- Do not attach within **200 mm of any chassis cross member or bend**
- Where U-bolts are used: install **reinforcement blocks inside the chassis rail** to prevent flange distortion under bolt load
- Front two mountings: allow **longitudinal movement** — use slotted holes. Do not rigidly fix the front
- Subframe front leading edge: **taper required** to reduce stress concentration at the end of the subframe. Industry standard is 25–30°, chamfered on the bottom face

*Source: Isuzu Body Builder Guide 2018; VSB 06 Section J — observed: 19 May 2026*

---

## 6. Two-Body Configuration — Axle Load Flag

**This is the key engineering risk in this build. It requires a full axle load calculation before the subframe is detailed.**

The cabinet sits between the tank and the cab. Depending on its exact longitudinal position relative to the front axle, 750 kg of cabinet weight forward of the tank's CoG can materially shift the overall body CoG toward the front axle.

The front axle limit on this chassis is **5,000 kg**. The cab chassis already contributes ~2,564 kg to the front axle at tare. That leaves only **~2,436 kg** of front axle capacity for body load.

Cabinet weight and its position relative to the front axle must be confirmed before committing to subframe rail lengths, cross member positions, and saddle locations. If the cabinet pushes the front axle over 5,000 kg laden, the design must be revised — either by repositioning the cabinet further rearward, or adjusting tank placement.

**Required before detailing the subframe:**
1. Confirm wheelbase (R56 dimension in mm) from Isuzu spec sheet or dealer
2. Confirm cabinet CoG position (distance from front axle centreline)
3. Confirm tank CoG position when fully laden
4. Run axle load calculation: front and rear laden weights must sit within 5,000 kg and 9,000 kg respectively

*Source: Isuzu FSD 140/120-240 spec, isuzu.com.au — observed: 19 May 2026; VSB 06 Section J — observed: 19 May 2026*

---

## 7. Class 3 Fuel — Additional Considerations

Same requirements as the Volvo FM build apply:
- Tank earthed and bonded to chassis — saddle/mounting interface design must accommodate bonding strap connection points
- Tank shell inspection access must not be obstructed by cross member placement
- ADG Code 7th Edition and AS 2809.2 compliance required — design approval via WorkSafe (Vic) or equivalent state authority before manufacture

---

## 8. Key Assumption

The R56 wheelbase code has not been confirmed from a primary source in this session — PDF spec sheets were inaccessible. The axle load calculation in Section 6 requires the confirmed wheelbase in mm. Obtain this from the Isuzu dealer or the chassis compliance plate before proceeding with detailed design.

---

## Summary

| Question | Answer |
|----------|--------|
| Subframe required? | **Yes — mandatory** |
| Cross members required? | **Yes — mandatory** |
| Cross member material | **Grade 350 RHS — AS/NZS 1163** |
| Subframe rail material | **Grade 350 C-channel or RHS — AS/NZS 3678 / 1163** |
| Mounting method | **Bolted only — NO welding to Isuzu chassis (BBI hard rule)** |
| Front mounting | **Sliding / longitudinal movement must be permitted** |
| Leading edge | **Taper 25–30°, chamfered bottom face** |
| GVM margin | **Sufficient — ~1,780 kg remaining** |
| Critical risk | **Front axle load — must calculate before detailing subframe** |
| Blocker | **Confirm R56 wheelbase (mm) from Isuzu dealer or compliance plate** |

*Harlow — Heavy Vehicle Body Engineer, The Works | 19 May 2026*
