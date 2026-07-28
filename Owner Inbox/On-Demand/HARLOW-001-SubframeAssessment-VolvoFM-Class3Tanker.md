# Engineering Assessment — Subframe Requirement
**Build:** Rigid tanker, Class 3 fuels, Volvo FM chassis
**Prepared by:** Harlow — Heavy Vehicle Body Engineer
**Reviewed by:** MEO
**Date:** 19 May 2026
**Sources:** Volvo Body Builder Instructions (BBI) 2026; AS 2809.2:2020; AS 2809.1:2020/2023; SSAB frame rail guidance; Australian structural steel standards

---

## 1. Is a Subframe Required?

**Yes. A subframe is mandatory for this build.**

The Volvo FM chassis rails are designed with controlled longitudinal flexibility — they are not a rigid beam. A tanker shell, by contrast, is a structurally rigid body. Mounting a rigid tank shell directly to a flexible chassis without a subframe would transfer torsional stresses into the tank shell and chassis rails in ways neither is designed to absorb. This causes fatigue cracking in the chassis, weld failures in the tank shell, and potential catastrophic failure of the assembly — unacceptable for a Class 3 fuel tanker.

The subframe is the engineered interface between the tank and the chassis. It manages load transfer, protects the chassis rails from point loading, and provides the consistent, flat mounting surface the tank requires.

The Volvo FM BBI confirms subframe attachment as the standard method for rigid body mounting. Volvo specifies a 266 mm or 300 mm frame height option for rigids — the subframe design must match the selected frame profile.

*Subframe requirement — source: Volvo Body Builder Instructions 2026, Section 7; observed: 19 May 2026*

---

## 2. Are Cross Members Required?

**Yes. Cross members are required.**

The Volvo BBI explicitly states: *"An adequate number of cross members should also be installed in the subframe to prevent lateral movement."*

Cross members serve three functions in a tanker subframe:
1. **Prevent racking** — stop the subframe rails from parallelogramming under cornering loads
2. **Distribute load** — spread the tank's weight and liquid surge forces evenly across the subframe
3. **Torsional rigidity** — resist the twisting forces that arise when a laden tanker corners or traverses uneven ground

For a Class 3 fuel tanker, liquid surge during braking and cornering generates significant dynamic lateral and longitudinal forces. Cross member placement must account for these loads, not just static weight.

*Cross member requirement — source: Volvo Body Builder Instructions 2026, Section 7; observed: 19 May 2026*

---

## 3. Cross Member Placement — Guiding Principles

The BBI does not prescribe a fixed cross member count — "adequate number" is an engineering judgement based on your tank length, compartment layout, and baffle positions. Standard practice:

- **At or near each baffle position** — baffles concentrate surge loads; cross members here transfer those loads to the subframe rails
- **At tank mounting saddle positions** — directly under each tank saddle/cradle
- **Front and rear of tank** — end cross members are non-negotiable
- **Maximum unsupported span:** industry practice is 900–1200 mm between cross members for fuel tanker applications; confirm against your tank shell engineering

---

## 4. What Should Cross Members Be Made Of?

**Structural steel, Grade 350 (C350L0 to AS/NZS 3678).**

This is the Australian industry standard for heavy vehicle subframe and cross member construction. Grade 350 delivers:

| Property | Value |
|----------|-------|
| Yield strength | 360 MPa minimum (for plate/RHS ≤11mm) |
| Tensile strength | 480 MPa minimum |
| Standard | AS/NZS 3678 (plate/flats) or AS/NZS 1163 (hollow sections) |

**Section profile for cross members:** Rectangular Hollow Section (RHS), Grade 350 to AS/NZS 1163. RHS provides high bending strength in both axes and is far superior to flat plate or angle section for cross member applications. It resists torsion better than open sections and does not trap moisture the way channel sections can.

*Do not use mild steel (Grade 250) for cross members in a Class 3 tanker application — insufficient yield strength for the dynamic loading environment.*

**Subframe rails:** Same grade — Grade 350 C-channel or RHS to match your section modulus requirement. The subframe rails should have a yield strength equal to or greater than the Volvo FM chassis rail material (typically Grade 500–700 high-tensile in the Volvo FM). This does not mean matching the chassis rail grade; it means the subframe must not be the weakest structural element in the assembly.

*Material specification — source: AS/NZS 3678, AS/NZS 1163; SSAB frame rail guidance; observed: 19 May 2026*

---

## 5. Subframe Mounting Method — Key Requirements (Volvo FM Specific)

Per the Volvo BBI:

- **Front two anchorages:** Must allow **longitudinal movement** between chassis and subframe — do not rigidly fix the front. Use slotted bolt holes or a sliding bracket. This prevents the subframe fighting the chassis's natural flex.
- **Remaining anchorages:** Rigidly fixed — weld flat plates to the subframe web and bolt to the chassis rail web.
- **Front end taper:** Subframe front end must be tapered at **25°** to reduce stress concentration. The bottom leading edge must be chamfered to prevent chafing on the chassis rail.
- **Do not weld to the top flange of the Volvo chassis rail** — this is a BBI prohibition. Bolt through the web only.

*Mounting method — source: Volvo Body Builder Instructions 2026, Section 7; observed: 19 May 2026*

---

## 6. Class 3 Fuel — Additional Structural Considerations

AS 2809.2 (Flammable liquids) and the ADG Code 7th Edition impose requirements on top of the structural ones:

- The tank must be earthed and bonded to the chassis — this affects how you design your saddle/mounting interface
- Tank shell inspection access must not be obstructed by cross member placement
- Your subframe must not restrict access to chassis components requiring maintenance (per Volvo BBI)

---

## 7. Key Assumption

This assessment is based on a standard rigid FM chassis without a tag axle or pusher axle. If your FM spec includes a tag or pusher, axle load distribution will change and cross member placement must be recalculated against the revised load model.

---

## Summary

| Question | Answer |
|----------|--------|
| Subframe required? | **Yes — mandatory** |
| Cross members required? | **Yes — mandatory** |
| Cross member material | **Grade 350 RHS to AS/NZS 1163** |
| Subframe rail material | **Grade 350 to AS/NZS 3678 or AS/NZS 1163** |
| Front mounting | **Sliding / longitudinal movement allowed** |
| Remaining mountings | **Rigid — bolt through chassis web** |
| Front end taper | **25° taper, chamfered leading edge** |

*Harlow — Heavy Vehicle Body Engineer, The Works | 19 May 2026*
