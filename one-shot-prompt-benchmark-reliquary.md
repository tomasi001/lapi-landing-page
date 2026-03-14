# ONE-SHOT PROMPT: Cinematic Benchmark Reliquary Launch Video

---

## CONTEXT & OBJECTIVE

Create a **53–57 second cinematic launch video** rendered at **9:16 vertical resolution (1080×1920)**. The film should feel like a luxury product reveal crossed with a ritualized systems demo: controlled, suspenseful, architectural, and unmistakably premium.

The central subject is **not a die**. Instead, build a new hero asset:

> a **sealed kinetic reliquary**: a tall sculptural monolith made of interlocking machined shells, hidden seams, recessed chambers, and an inner energy core.

This object must feel like a physical artifact designed for judgment, measurement, and withheld information. It should visually support the supplied voiceover pacing about performance, categories, channels, and a locked reveal.

No text, subtitles, captions, UI, or overlaid graphics appear in the film. The object, light, motion, and camera language do all the storytelling.

---

## STEP 1: MATCH THE CURRENT 3D STACK EXACTLY

Before writing code or creating assets, scan the project and confirm the existing rendering stack. Use **the same stack, same quality tier, and same implementation philosophy** already present in this repo.

### The current project stack you must match

1. **Renderer / runtime**
   - Vanilla HTML + ES module setup
   - **Three.js r0.172.x** via import map / CDN
   - `WebGLRenderer` with:
     - `antialias: true`
     - `ACESFilmicToneMapping`
     - `SRGBColorSpace`
     - `PCFSoftShadowMap`
   - No React, no React Three Fiber, no Babylon, no off-the-shelf cinematic framework

2. **Material system**
   - Heavy use of **custom `ShaderMaterial` GLSL shaders**
   - Procedural textures and normal maps generated with `CanvasTexture`
   - `onBeforeCompile` shader overrides where useful
   - PBR-inspired response built manually through shader logic:
     - Fresnel
     - anisotropic/specular behavior
     - layered procedural detail
     - custom emissive and distortion effects

3. **Lighting approach**
   - Main site: ambient + directional + hemisphere + soft shadow receiving
   - Existing cinematic file: explicit **key / fill / rim** light vectors and intensity uniforms
   - Soft implied ground / glow treatment rather than a visible heavy set
   - Strong shadow direction, controlled contrast, no flat lighting

4. **Scene atmosphere**
   - Sparse dust / ambient particle field using `Points`
   - Soft environmental depth through fog, glow, falloff, or subtle haze
   - Implied surface treatment rather than literal set dressing when needed

5. **Post pipeline**
   - `EffectComposer`
   - `RenderPass`
   - `UnrealBloomPass`
   - custom `ShaderPass` stages for:
     - vignette
     - film grain
     - heat distortion / refraction
     - final fade

6. **Animation / choreography**
   - Deterministic procedural timing driven by code
   - Custom camera paths, easing utilities, quaternion-driven rotations
   - No external physics engine unless the repo already uses one for this scene

7. **Rendering/export**
   - Programmatic frame-by-frame render path in-browser
   - PNG sequence export
   - final compile with `ffmpeg`

### Non-negotiable constraint

Do **not** downgrade the stack. The new scene must feel like it belongs to the same world and engineering standard as the existing project.

---

## STEP 2: THE SUBJECT — A SEALED KINETIC RELIQUARY

### Core idea

Replace the dice concept with a **vertical monolithic artifact** designed around secrecy, benchmarking, and controlled reveals.

Imagine a hybrid of:

- a luxury sci-fi vault
- a ceremonial measuring instrument
- a premium hardware prototype
- a suspended archival object built to reveal information only when permitted

### Form language

The reliquary should be built from **four long vertical faces**, but it must **not** read like a plain box. It should feel sculpted and engineered.

Design principles:

- **Tall, portrait-friendly silhouette** suited to 9:16 framing
- **Interlocking outer shells** with precision seam lines and shallow stepped bevels
- **Recessed face chambers** on each of the four sides, like hidden bays or sealed inspection ports
- **Weighted lower body** so the object feels grounded and expensive
- **Tapered upper crown** or split fin geometry to give the piece tension and upward pull
- **Subtle asymmetry** so it feels designed, not mathematically sterile
- **Micro-geometry detail**:
  - hairline seams
  - panel breaks
  - tiny vent slits
  - machined chamfers
  - minute surface imperfections visible only in macro

### Mechanical behavior

This object should have **small controlled movements**, not chaotic transformation.

- Outer face panels can:
  - slide
  - iris open
  - split
  - unlock by millimetres
  - expose inner recesses
- Internal components can:
  - emit light through seams
  - rotate with deliberate resistance
  - reveal engraved symbols in recessed chambers
- Motion should always feel:
  - heavy
  - engineered
  - damped
  - expensive

### Material & surface design

Primary shell:

- Dark anthracite / blackened titanium / smoked gunmetal
- Satin-matte finish with restrained specular response
- Slight cool bias in the highlights
- Fine brushed directionality visible in macro shots

Secondary edge treatment:

- Bevels and chamfers catch a brighter cooler metallic sheen
- Slightly more polished than the body panels

Interior chamber material:

- Dark ceramic or soft matte carbon
- Less reflective than the exterior shell
- Helps symbols and glow read cleanly

Core energy accents:

- Mostly neutral and monochrome
- Only brief controlled color moments during the channel reveals
- Thermal moment can move through red-orange internal heat

### Symbol system

The four faces should function as four controlled chambers:

1. **Google Ads**
2. **Meta**
3. **Email**
4. **Unknown / locked category**

The symbols should not feel printed on. They must appear as:

- recessed engravings
- light-burnished etchings
- machined apertures
- or mechanically revealed insets

Keep them integrated into the physical object.

---

## STEP 3: ENVIRONMENT

The reliquary exists in a **black void with atmospheric depth**.

Requirements:

- Background is near-total black
- No visible room, walls, horizon, or literal stage
- A soft diffused ground bloom or shadow field beneath the asset suggests an implied surface
- Sparse airborne particles drift slowly and only appear when they catch light
- Atmosphere should feel spatial and real, not empty

The void should read as a deliberate stage for judgment, not just “nothingness.”

---

## STEP 4: CAMERA, LIGHTING & MOTION CHOREOGRAPHY

Use the voiceover below only as a **timing and emotional pacing guide**. Do not render audio.

**Voiceover pacing reference**:
```text
0:00–0:04  "Welcome to Day SIX of our journey."
0:04–0:10  "ONE brand crafted by human hands. ONE generated by AI."
0:10–0:16  "Same constraints. Same timeline. We are watching... who survives the fire."
0:16–0:22  "To win, you need to PERFORM. Three channels. Google. Meta. Email."
0:22–0:28  "Same creative volume. Same spend. Same conditions. Both brands go head-to-head across ALL THREE."
0:28–0:36  "Category ONE is performance. HARD DATA. Clicks... conversions... results. The stuff that ACTUALLY pays the bills. No opinions. Just numbers."
0:36–0:42  "Category TWO? We're keeping THAT one... locked... for now. It will reveal itself... when the time is right."
0:42–0:50  "WE handle the operational data gathering. But YOU set the benchmark. What METRICS prove a brand is actually working? Comment your thoughts below."
0:50–0:55  "See you again... soon."
```

Total runtime: **53–57 seconds**.

---

## ACT 1 — THE SEAM (0:00 – 0:09)

**Mood:** Mystery. Inspection. Human hand vs machine precision.  
**Script alignment:** “Welcome to Day SIX…” / “ONE brand crafted by human hands. ONE generated by AI.”

Open in **extreme macro**. The audience should not yet understand the object.

- **Camera**
  - Travel laterally across a hairline seam where two exterior shell plates meet
  - Move like a stabilized probe inspecting a premium artifact
  - Add extremely subtle micro-drift so it never feels synthetic

- **Visual detail**
  - Brushed-metal grain must be legible
  - A shallow bevel catches a razor-thin ribbon of light
  - Tiny machining marks, edge polish changes, and miniature vent slits should read in close-up

- **Lighting**
  - One narrow, raking key light only
  - Deep falloff into black
  - Chiaroscuro contrast

- **Key beat at ~0:04**
  - As “ONE brand…” lands, the camera crosses a seam from one shell plate to another
  - This should feel like crossing from one maker to another, or one philosophy to another, while still revealing it is all part of one artifact

---

## ACT 2 — THE TRIAL (0:09 – 0:16)

**Mood:** Stress test. Internal heat. Survival under constraint.  
**Script alignment:** “Same constraints…” / “who survives the fire.”

The reliquary is still close-up, but now something inside it begins to wake.

- **Camera**
  - Continue macro-to-close drift
  - Pull back slightly so one recessed chamber and several seams become visible

- **Thermal event**
  - Around **0:10**, a dull ember begins inside the object, visible first through:
    - seam gaps
    - micro vents
    - chamber recess depth
  - Heat should feel **internal**, not like open flames on the surface
  - Use emissive subsurface behavior plus very restrained distortion in the air above the object

- **Peak at ~0:15**
  - Internal red-orange thermal intensity reaches its maximum precisely on “fire”
  - Several seam lines pulse brighter
  - The chamber interior briefly glows like the object is enduring a pressure or temperature event

- **Immediate recovery**
  - By **0:16**, the heat collapses back down
  - Warm orange falls to cherry red, then disappears
  - One faint wave of heat haze lingers for a beat

The message is survival, not destruction.

---

## ACT 3 — THE REVEAL (0:16 – 0:22)

**Mood:** Authority. Activation. Controlled confidence.  
**Script alignment:** “To win, you need to PERFORM. Three channels. Google. Meta. Email.”

This is the first full reveal of the hero asset.

- **Camera**
  - Pull back decisively from intimate close-up to a hero mid-shot
  - The full reliquary now occupies the center of the vertical frame
  - The audience should immediately understand it as a premium engineered object

- **Lighting shift**
  - Introduce a cooler fill from the opposite side
  - Keep the warm key, but balance it with a blue-white edge response
  - Add a controlled rim so the silhouette separates cleanly from black

- **Object motion**
  - The reliquary begins a slow suspended yaw
  - Perhaps the inner core rotates independently by a few degrees behind the shell
  - Outer face seams subtly unlock, as if the naming of the channels activates the system

- **Performance beat**
  - On “PERFORM,” the object should feel fully awakened
  - The glow beneath it strengthens slightly
  - The shell alignment settles with intent

---

## ACT 4 — THE CHANNEL REVEALS (0:22 – 0:28)

**Mood:** Precision. Scope. Competitive system activation.  
**Script alignment:** “Same creative volume…” / “across ALL THREE.”

Instead of a dice rotation, use **sequential chamber reveals** across different faces of the reliquary.

### Face 1 — Google Ads (0:22 – 0:24)

- The first chamber rotates or slides into view
- Mechanical shutters part just enough to expose a recessed symbol field
- The **Google Ads mark** emerges through a clean angular transformation:
  - triangular rails align
  - a notch resolves
  - a faint yellow-green-blue energy flicker passes through, then collapses back to mostly monochrome
- The motion should feel hard-edged and decisive

### Face 2 — Meta (0:24 – 0:26)

- The reliquary yaws to a second face
- A recessed cavity reveals the **Meta infinity mark**
- This reveal should feel more fluid than Google:
  - a liquid-metal loop
  - or a traced inset line that bends into the final infinity form
- A soft cool blue pulse can travel across the chamber edges as it locks in

### Face 3 — Email (0:26 – 0:28)

- The third chamber presents the **Email / envelope symbol**
- This should be the cleanest and most technical reveal:
  - vertices align
  - straight lines etch in
  - the final icon feels crisp and engineered
- A restrained white tracing emission is enough

### “ALL THREE” beat (~0:28)

At the exact “ALL THREE” moment, the audience should feel cumulative completion.

Possible ways to land it:

- a quarter turn that briefly implies multiple revealed chambers
- a synchronized micro-pulse across all active faces
- or a composed angle where two faces are visible and the third is strongly implied by the preceding rhythm

---

## ACT 5 — THE WEIGH-IN / THE LOCK (0:28 – 0:42)

This act has two halves.

### Part A — Measurement (0:28 – 0:36)

**Mood:** Serious. Quantified. Unromantic.  
**Script alignment:** “Category ONE is performance. HARD DATA. Clicks... conversions... results... No opinions. Just numbers.”

- **Camera**
  - Hold at an authoritative hero distance
  - Let the object continue a slow deliberate rotation

- **Behavior**
  - Inner core pulses in disciplined intervals, not dramatic surges
  - Thin chamber edges catch controlled specular flashes in sync with the staccato phrasing
  - Consider subtle telemetry-like line motion inside the recesses, but keep it physical and restrained

- **Lighting**
  - Stable, confident two-tone setup
  - Less theatrical than the fire act
  - More clarity, less mystery

The object should feel like a machine for judgment.

### Part B — The Locked Category (0:36 – 0:42)

**Mood:** Withheld information. Provocation. Tension.  
**Script alignment:** “Category TWO? We're keeping THAT one locked...”

The final face does **not** reveal cleanly like the others.

- **Camera**
  - Push in slightly
  - Slow the rotation and let the fourth face take over frame

- **Behavior**
  - The fourth chamber remains sealed longer than expected
  - Mechanical bars, shutters, or overlapping plates refuse to open fully
  - A partial internal glyph begins to form behind the obstruction
  - That incomplete reveal resolves into a **question mark** or ambiguous lock-state symbol

- **Critical note**
  - This should not feel playful
  - It should feel deliberate and slightly confrontational

- **Lighting shift**
  - Warmth recedes
  - Cool fill becomes more dominant
  - The object becomes colder, more withholding

- **Hold from 0:40 – 0:42**
  - No major motion
  - Let the sealed chamber sit in stillness

---

## ACT 6 — THE HANDOFF (0:42 – 0:50)

**Mood:** Invitation. Space. Viewer participation.  
**Script alignment:** “WE handle the operational data gathering. But YOU set the benchmark...”

The film stops presenting and starts inviting.

- **Camera**
  - Begin a slow centered retreat
  - Let the reliquary shrink in frame

- **Object behavior**
  - Return to a slow idle rotation
  - Revealed chambers remain present but subdued
  - The locked face is the last dominant impression before it rotates away

- **Lighting**
  - Soften the contrast slightly
  - Still cinematic, but less confrontational
  - Let more negative space breathe around the asset

- **Atmosphere**
  - Dust becomes slightly more visible at scale
  - The void feels deep, inhabited, dimensional

By **0:50**, the object should occupy only a modest portion of the frame with generous darkness around it.

---

## ACT 7 — BLACK (0:50 – 0:55)

**Mood:** Departure. Promise. Restraint.  
**Script alignment:** “See you again... soon.”

- Key light fades first
- Fill and rim linger briefly
- The reliquary falls into silhouette
- Then into absence

Hold on **pure black** for roughly 3 seconds.

Final frame: `#000000`

No logo. No end card. No text.

---

## STEP 5: RENDERING & OUTPUT SPECS

- **Resolution:** 1080 × 1920
- **Aspect ratio:** 9:16 portrait
- **Frame rate:** 60fps preferred, 30fps acceptable
- **Duration:** 53–57 seconds
- **Output:** MP4 (`H.264`) or WebM

### Rendering approach

Use the repo’s existing real-time Three.js approach, but render the final video **frame-by-frame** for consistency and quality. Export PNG frames and compile via `ffmpeg`.

### Required image treatment

- ACES-style filmic tone mapping
- soft bloom, used sparingly
- subtle vignette
- restrained film grain, under 5% perceived opacity
- heat distortion only during the thermal act
- anti-aliasing at the highest practical quality for the existing renderer path

### Color grade

- cool shadows
- neutral mids
- slightly warm highlights
- restrained palette
- only brief accent color during the channel reveal moments

---

## STEP 6: QUALITY BENCHMARKS

Before considering the output complete, verify:

1. **Macro credibility**
   - Opening shots must reveal brushed detail, seam fidelity, and surface nuance clearly

2. **Lighting discipline**
   - The object is never flat
   - Every frame has directional intent, depth, and controlled specular hierarchy

3. **Mechanical weight**
   - Panel motion and chamber reveals feel damped and expensive
   - No cheap or floaty movement

4. **Thermal plausibility**
   - The heat event feels internal and physically motivated
   - It should interact with material response and air distortion convincingly

5. **Symbol integration**
   - Meta, Google Ads, Email, and the locked category all feel embedded in the object, not pasted onto it

6. **Atmospheric depth**
   - The void feels like a real stage with distance and air, not a flat black backdrop

7. **Timing accuracy**
   - Fire peak, full reveal, each chamber reveal, lock hold, retreat, and blackout all land against the invisible voiceover rhythm

---

## IMPORTANT NOTES

- No text or typography anywhere in the render
- No audio rendered
- The voiceover is only a pacing reference
- The object must feel tangible, machined, and photographable
- Prioritize image quality, motion quality, and material credibility over implementation speed
