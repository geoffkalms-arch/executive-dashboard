# PTO & PTO Pump Specification Template
## Fuel Pumping Vehicles — All Makes and Models
**Prepared by:** Harlow (Heavy Vehicle Body Engineer) + Petra (Process & Instrumentation Engineer), The Works
**Date:** 19 May 2026
**Purpose:** Guide young engineers through the complete PTO and PTO pump specification process for fuel pumping vehicles. Complete every section in order. Do not skip sections — each feeds the next.

---

> **HOW TO USE THIS TEMPLATE**
> Work top to bottom. Sections 1–3 gather facts about the vehicle. Section 4 defines what the pump system needs to deliver. Section 5 matches the PTO to the transmission. Section 6 sizes and selects the pump. Section 7 checks everything fits. Section 8 records your final specification. Flag any field you cannot confirm — never assume or estimate without noting it.

---

## SECTION 1 — Vehicle Information

*Purpose: Establish the chassis you are working with. Every PTO selection depends on the transmission. Get this right before anything else.*

| Field | Entry | Source / Notes |
|-------|-------|---------------|
| Vehicle make | | |
| Vehicle model | | |
| Model year | | |
| VIN / chassis number | | Confirm from compliance plate |
| Engine make and model | | |
| Engine max power | kW @ rpm | From OEM spec sheet |
| Engine max torque | Nm @ rpm | From OEM spec sheet |
| Engine governed speed (max RPM) | rpm | From OEM spec sheet |
| PTO drive speed at engine idle | rpm | Calculate: see Section 5 |
| Transmission make and model | | e.g. Allison 3000, ZF 9-speed, Eaton Fuller |
| Transmission type | ☐ Manual ☐ Automated Manual (AMT) ☐ Automatic (AT) ☐ Torque Converter | |
| Transmission serial number | | From transmission ID plate |
| Number of PTO ports available | | Check OEM body builder instructions |
| PTO port locations available | ☐ Top ☐ Side (LH) ☐ Side (RH) ☐ Rear ☐ Front | Check OEM BBI |
| GVM | kg | |
| GCM (if applicable) | kg | |
| Body builder instructions (BBI) version | | Record document title and revision |

**Notes / observations:**

---

## SECTION 2 — Application Information

*Purpose: Define what the vehicle does. Fuel type and duty cycle drive every subsequent decision.*

| Field | Entry | Notes |
|-------|-------|-------|
| Application type | ☐ Fuel delivery ☐ Bulk fuel ☐ Aviation fuel ☐ LPG ☐ Chemical ☐ Other: | |
| Fuel / product class (ADG) | ☐ Class 2.1 (LPG) ☐ Class 3 (flammable liquid) ☐ Class 6 ☐ Class 8 ☐ Other | |
| Fluid being pumped | e.g. diesel, petrol, avgas, LPG | |
| Fluid vapour pressure at max operating temp | kPa abs | Required for NPSH calculation — see Section 6 |
| Fluid density at operating temperature | kg/m³ | e.g. diesel ~820–840 kg/m³ |
| Fluid viscosity at operating temperature | cSt | Required for pump selection |
| Max operating temperature of fluid | °C | |
| Min ambient temperature (cold start) | °C | Affects viscosity and pump priming |
| Required delivery flow rate | L/min | Owner/customer specification |
| Required operating pressure (differential) | kPa | Owner/customer specification |
| Duty cycle | ☐ Continuous (>30 min) ☐ Intermittent (<30 min) ☐ Short burst (<5 min) | Drives PTO and pump thermal rating |
| Expected daily operating hours | hr/day | For service life calculation |
| Vehicle operating environment | ☐ On-road ☐ Off-road ☐ Both | Affects mounting and vibration |

**Notes / observations:**

---

## SECTION 3 — Existing System (If Rehorse / Modification)

*Complete this section only if modifying or rehorseing an existing pump system. Skip if new build.*

| Field | Entry | Notes |
|-------|-------|-------|
| Existing PTO make and model | | |
| Existing PTO ratio | :1 | |
| Existing pump make and model | | |
| Existing pump displacement | cc/rev | |
| Existing pump max speed | rpm | |
| Known issues with existing system | | |
| Reason for replacement / modification | | |
| Any existing drawings or approvals to carry over | | Note document numbers |

---

## SECTION 4 — System Performance Requirements

*Purpose: Define the numbers the pump must hit. This section is the brief for pump selection. Do not proceed to Section 5 or 6 until these are confirmed.*

### 4.1 Flow and Pressure Requirements

| Parameter | Required Value | Confirmed by | Date |
|-----------|---------------|--------------|------|
| Minimum delivery flow rate | L/min | | |
| Maximum delivery flow rate | L/min | | |
| Operating differential pressure | kPa | | |
| Maximum allowable system pressure | kPa | | |
| Relief valve set pressure | kPa | Note: must be ≤ max system pressure |

### 4.2 Pump Power Requirement (Calculate Before Selecting PTO)

Use this calculation to determine the minimum power the PTO must deliver to the pump.

```
PUMP SHAFT POWER (kW) = [Flow (L/min) × Pressure (kPa)] ÷ [60,000 × Pump efficiency]

Typical pump efficiency:
  Gear pump:    0.80 – 0.88
  Vane pump:    0.80 – 0.88
  Piston pump:  0.85 – 0.93

Example:
  Flow = 200 L/min, Pressure = 700 kPa, Efficiency = 0.85
  Power = (200 × 700) ÷ (60,000 × 0.85) = 2.75 kW
```

| Calculation Step | Value | Units |
|-----------------|-------|-------|
| Required flow | | L/min |
| Operating pressure | | kPa |
| Assumed pump efficiency | | (decimal) |
| **Calculated pump shaft power** | | **kW** |
| Add 25% service factor | × 1.25 | |
| **Minimum PTO output power required** | | **kW** |

### 4.3 NPSH Check (Suction Capability)

*Prevents pump cavitation — critical for volatile fuels such as petrol and LPG.*

```
NPSHA (available) = (Atmospheric pressure − Fluid vapour pressure) ÷ (ρg) + Static head − Suction losses

NPSHA must exceed pump manufacturer's NPSHR (required) by at least 0.5 m.
If NPSHA < NPSHR + 0.5 m: reposition pump, enlarge suction line, or use a flooded suction arrangement.
```

| Parameter | Value | Units |
|-----------|-------|-------|
| Atmospheric pressure | 101.3 | kPa abs (std) |
| Fluid vapour pressure at max temp | | kPa abs |
| Fluid density | | kg/m³ |
| Static suction head (positive if flooded) | | m |
| Estimated suction line losses | | m |
| **Calculated NPSHA** | | **m** |
| Pump manufacturer's NPSHR | | m |
| Margin (NPSHA − NPSHR) | | m (must be ≥ 0.5 m) |
| ☐ NPSH check PASSED   ☐ FAILED — redesign suction arrangement | | |

---

## SECTION 5 — PTO Selection

*Purpose: Match a PTO to the transmission. The OEM Body Builder Instructions (BBI) for the specific transmission must be obtained and consulted before any PTO is ordered.*

### 5.1 Transmission PTO Requirements

| Field | Entry | Source |
|-------|-------|--------|
| OEM approved PTO list for this transmission | | From BBI — list approved part numbers |
| PTO mounting position selected | ☐ Top ☐ Side (LH) ☐ Side (RH) ☐ Rear | From BBI |
| PTO engagement method required | ☐ Mechanical (clutch) ☐ Pneumatic ☐ Electric ☐ Hydraulic | From BBI / application |
| PTO engagement — vehicle must be | ☐ Stationary only ☐ Moving permitted | From BBI |
| Transmission max PTO torque rating at this port | Nm | From BBI — do not exceed |
| PTO output rotation direction | ☐ CW ☐ CCW (viewed from PTO output shaft) | Confirm with pump rotation requirement |

> **IMPORTANT — Automatic and AMT Transmissions:**
> Allison, ZF Traxon, and Eaton UltraShift have specific PTO engagement windows and torque limits that differ by transmission software version. Always confirm with the transmission OEM or dealer before specifying. Engaging PTO outside the approved window can damage the transmission without warning.

### 5.2 Required PTO Output Speed

```
PTO OUTPUT SPEED (rpm) = Engine RPM × PTO Ratio

PTO Ratio is stamped on the PTO nameplate and listed in the parts catalogue.
Common ratios: 0.55:1, 0.68:1, 0.80:1, 1.00:1, 1.05:1, 1.25:1

Target: PTO output speed must fall within the pump's rated speed range.
```

| Parameter | Value | Units |
|-----------|-------|-------|
| Target pump operating speed | | rpm |
| Engine RPM at target pump speed | | rpm |
| Required PTO ratio | :1 | Calculated: pump rpm ÷ engine rpm |
| Selected PTO ratio (nearest available) | :1 | From OEM PTO catalogue |
| Actual PTO output speed at operating engine RPM | | rpm |
| Is actual speed within pump rated range? | ☐ Yes ☐ No — select different ratio | |
| PTO output speed at engine idle | | rpm — check pump min speed |
| PTO output speed at engine max | | rpm — must not exceed pump max speed |

### 5.3 PTO Torque Check

```
PTO OUTPUT TORQUE (Nm) = Pump shaft power (kW) × 9549 ÷ PTO output speed (rpm)

This must be LESS THAN the transmission's rated PTO torque at that port.
Apply a 1.25 service factor: Torque required × 1.25 ≤ Transmission PTO torque limit
```

| Parameter | Value | Units |
|-----------|-------|-------|
| Pump shaft power (from Section 4.2) | | kW |
| PTO output speed | | rpm |
| Calculated PTO output torque | | Nm |
| With 1.25 service factor | | Nm |
| Transmission PTO torque limit (from BBI) | | Nm |
| Margin available | | Nm (must be positive) |
| ☐ Torque check PASSED   ☐ FAILED — review power requirements or PTO selection | | |

### 5.4 PTO Selection Record

| Field | Entry |
|-------|-------|
| Selected PTO make | |
| Selected PTO model / part number | |
| PTO ratio | :1 |
| PTO output torque rating | Nm |
| PTO output speed at operating RPM | rpm |
| PTO mounting position | |
| Engagement method | |
| OEM approval confirmed | ☐ Yes — note BBI reference: |
| Transmission warranty implications checked | ☐ Yes ☐ No — investigate before ordering |

---

## SECTION 6 — PTO Pump Selection

*Purpose: Select the pump that meets the performance requirements, driven by the PTO specified in Section 5.*

### 6.1 Pump Type Selection Guide

| Pump Type | Best For | Not Suitable For | Typical Max Pressure |
|-----------|----------|-----------------|---------------------|
| **Gear pump (external)** | Clean fuels (diesel, petrol); robust; simple; low cost | High-viscosity cold fluids; fluids with solids | 200–250 bar |
| **Gear pump (internal / gerotor)** | Low-noise; moderate pressure; self-priming | Abrasive fluids | 100–200 bar |
| **Vane pump** | Smooth flow; low pulsation; moderate pressure | Abrasive or high-viscosity fluids | 100–175 bar |
| **Piston pump (axial)** | High pressure; variable displacement; efficient | High cost; maintenance complexity; not for low-viscosity fuels at high speed | 350–450 bar |
| **Liquid ring / regenerative** | LPG; volatile liquids; vapour-tolerant | High pressure applications | 15–20 bar |
| **Centrifugal** | High flow, low pressure; not self-priming | Any application requiring self-prime; high differential pressure | 5–10 bar |

**Pump type selected:** ____________________   **Reason:** ____________________

### 6.2 Pump Sizing

```
PUMP DISPLACEMENT (cc/rev) = [Flow (L/min) × 1000] ÷ [PTO speed (rpm) × Volumetric efficiency]

Typical volumetric efficiency:
  Gear pump:    0.88 – 0.94
  Vane pump:    0.88 – 0.92
  Piston pump:  0.92 – 0.97
```

| Calculation Step | Value | Units |
|-----------------|-------|-------|
| Required flow at operating condition | | L/min |
| PTO output speed (from Section 5) | | rpm |
| Assumed volumetric efficiency | | (decimal) |
| **Calculated displacement** | | **cc/rev** |
| Selected pump displacement (nearest catalogue size) | | cc/rev |
| Actual flow at operating speed | | L/min (verify ≥ required) |
| Pump max rated speed | | rpm (verify PTO speed ≤ this) |
| Pump min rated speed | | rpm (verify PTO idle speed ≥ this) |
| Pump max rated pressure | kPa | (verify ≥ system max pressure) |

### 6.3 Rotation and Porting

| Field | Entry | Notes |
|-------|-------|-------|
| Required pump rotation direction | ☐ CW ☐ CCW (viewed from drive end) | Must match PTO output rotation |
| PTO output rotation confirmed | ☐ CW ☐ CCW | From Section 5 |
| Rotation match confirmed | ☐ Yes ☐ No — specify adaptor or alternate pump | |
| Pump inlet port size and type | | e.g. 2" BSP female |
| Pump outlet port size and type | | e.g. 1-1/4" BSP female |
| Drive shaft type | ☐ SAE A 2-bolt ☐ SAE B 2-bolt ☐ SAE C 2-bolt ☐ SAE B 4-bolt ☐ Other | Must match PTO output flange |
| Coupling / adaptor required | ☐ Yes — specify: ☐ No | |

### 6.4 Fluid Compatibility Check

| Check | Result | Notes |
|-------|--------|-------|
| Pump seals compatible with fuel/product | ☐ Yes ☐ No — specify alternate seal material | e.g. Viton seals for aromatic fuels |
| Pump body material compatible with product | ☐ Yes ☐ No | e.g. cast iron OK for diesel; check for ethanol blends |
| Pump suitable for ADG Class of product | ☐ Yes ☐ No | Confirm with pump manufacturer |
| ATEX / hazardous area rating required | ☐ Yes — zone: ___ ☐ No | Check AS/NZS 60079 zone classification for vehicle |
| Fuel authority approval required (metering) | ☐ Yes — note requirements ☐ No | Trade measurement — NMI approval if used for sale |

### 6.5 Pump Selection Record

| Field | Entry |
|-------|-------|
| Selected pump make | |
| Selected pump model / part number | |
| Pump displacement | cc/rev |
| Pump max speed | rpm |
| Pump max pressure | kPa |
| Actual flow at operating speed | L/min |
| Seal material | |
| Drive configuration | |
| Fluid compatibility confirmed | ☐ Yes |
| Manufacturer data sheet attached | ☐ Yes ☐ No |

---

## SECTION 7 — Installation Checks

*Purpose: Confirm the selected PTO and pump can be physically installed on this chassis without conflict.*

### 7.1 Clearance and Fitment

| Check | Result | Notes |
|-------|--------|-------|
| PTO clears chassis cross members | ☐ Yes ☐ No — modify | Measure with PTO fitted to transmission model |
| PTO clears exhaust system | ☐ Yes ☐ No — heat shield or reroute required | |
| PTO clears driveline and driveshafts | ☐ Yes ☐ No | |
| PTO clears cab tilt mechanism (forward cab) | ☐ Yes ☐ No | Critical — check full tilt arc |
| Pump mounting location identified | | |
| Pump mounting bracket required | ☐ Yes — design required ☐ No | |
| Pump accessible for maintenance and oil change | ☐ Yes ☐ No — revise location | |
| Driveshaft / coupling alignment within tolerance | ☐ Yes ☐ No — realign | Max angular misalignment: per coupling manufacturer |

### 7.2 Hydraulic Lines

| Check | Result | Notes |
|-------|--------|-------|
| Suction line diameter adequate for flow rate | ☐ Yes ☐ No | Max suction velocity: 1.0–1.5 m/s for fuel |
| Suction line as short and direct as possible | ☐ Yes ☐ No — revise routing | Minimise bends; no high points in suction |
| Suction line rated for vacuum (not just pressure) | ☐ Yes ☐ No | Must not collapse under suction |
| All hoses rated for product and pressure | ☐ Yes ☐ No | Check hose specs against product class |
| Hose routing avoids heat sources (exhaust) | ☐ Yes ☐ No — reroute / shield | |
| Hose routing avoids sharp edges and chafe points | ☐ Yes ☐ No — add protection | |
| Bonding and earthing to chassis (Class 3 / LPG) | ☐ Yes ☐ No — install bonding strap | ADG Code requirement |

### 7.3 Controls

| Check | Result | Notes |
|-------|--------|-------|
| PTO engagement control type | ☐ Dash-mounted switch ☐ Remote ☐ PTO control module | |
| PTO engagement interlock required | ☐ Yes — specify: ☐ No | e.g. park brake must be applied; vehicle stationary |
| Overspeed protection provided | ☐ Yes ☐ No | Protect pump from engine overspeed |
| Over-pressure protection (relief valve) fitted | ☐ Yes ☐ No — install | Relief valve set pressure = Section 4.1 |
| Deadman / emergency stop | ☐ Yes ☐ No | ADG Code requirement for Class 3 / LPG |

---

## SECTION 8 — Final Specification Summary

*Complete this section last. This is the formal record of what was specified and approved.*

| Item | Specification |
|------|--------------|
| **Vehicle** | Make: ___ Model: ___ Year: ___ VIN: ___ |
| **Transmission** | Make / model: ___ Serial: ___ |
| **PTO make / model** | |
| **PTO ratio** | :1 |
| **PTO output speed at operating RPM** | rpm |
| **PTO torque check** | ☐ Passed — margin: ___ Nm |
| **PTO approval in BBI** | ☐ Confirmed — BBI ref: |
| **Pump make / model** | |
| **Pump displacement** | cc/rev |
| **Pump type** | |
| **Actual flow at operating RPM** | L/min |
| **Operating pressure** | kPa |
| **NPSH check** | ☐ Passed — margin: ___ m |
| **Fluid compatibility** | ☐ Confirmed |
| **Seal material** | |
| **Rotation confirmed** | ☐ PTO and pump match |
| **Drive / coupling confirmed** | ☐ SAE flange matched |
| **Installation clearances** | ☐ All passed |
| **Relief valve set pressure** | kPa |
| **Earthing / bonding** | ☐ Specified |
| **Prepared by** | Name: ___ Date: ___ |
| **Reviewed by** | Name: ___ Date: ___ |
| **Approved by** | Name: ___ Date: ___ |

---

## APPENDIX A — Common PTO Ratios by Transmission

| Transmission | Common PTO Ratios Available | Notes |
|-------------|---------------------------|-------|
| Allison 3000 Series | 0.55, 0.68, 0.80, 0.87, 1.00 | Multiple ports; confirm ratio with Allison BBI |
| Allison 4000 Series | 0.55, 0.68, 0.80, 1.00, 1.05 | Higher torque capacity than 3000 |
| ZF 9-speed (AS Tronic / Traxon) | 0.55, 0.68, 1.00 | AMT — engagement conditions apply |
| Eaton Fuller (manual) | 0.68, 0.80, 0.87, 1.00, 1.05 | Mechanical engagement; multiple port options |
| Eaton UltraShift | 0.68, 1.00 | AMT — check software version for PTO support |
| Isuzu 6-speed AMT | Confirm with Isuzu BBI | Limited third-party PTO availability |
| Volvo I-Shift | Confirm with Volvo BBI | Volvo-specific PTO; OEM approval required |

*Always confirm available ratios against the specific transmission serial number — ratios vary by model year and specification.*

---

## APPENDIX B — Typical Pump Operating Speed Ranges

| Pump Type | Min Speed (rpm) | Max Speed (rpm) | Notes |
|-----------|----------------|----------------|-------|
| External gear pump (small, <25cc) | 400 | 3000 | Check manufacturer spec |
| External gear pump (large, >50cc) | 300 | 2500 | |
| Vane pump | 600 | 2500 | Minimum speed critical for vane loading |
| Axial piston pump | 500 | 3500 | Higher range possible |
| Corken Z-series (LPG) | 300 | 900 | Hydraulic motor driven — see Corken data |
| Blackmer sliding vane | 200 | 600 | Used for fuel transfer — confirm model |
| Ebsray (fuel/LPG) | 300 | 1750 | Confirm against specific model |

---

## APPENDIX C — Key References and Standards

| Document | Scope |
|----------|-------|
| OEM Body Builder Instructions (BBI) — transmission specific | PTO approval, torque limits, engagement conditions |
| OEM BBI — vehicle chassis | Mounting zones, prohibited areas, hydraulic line routing |
| ADG Code 7th Edition | Dangerous goods transport requirements by class |
| AS 1596:2014 | LPG storage and handling |
| AS 2809.1/2 | Road tank vehicles for dangerous goods |
| AS/NZS 60079 | Hazardous area classification — pump and motor selection |
| NMI (National Measurement Institute) | Trade measurement approval for metering applications |
| Pump manufacturer's data sheet | Displacement, speed range, pressure rating, seal compatibility |
| Transmission OEM engineering data | PTO torque ratings, approved PTO list, engagement windows |

---

*Harlow — Heavy Vehicle Body Engineer | Petra — Process & Instrumentation Engineer*
*The Works | 19 May 2026*
*This template is a specification aid. All final designs must be verified against current OEM BBI documentation and applicable Australian Standards. Calculations in this template are for guidance — confirm against manufacturer data before ordering.*
