# Brief template (improved)

Fill the placeholders, delete nothing else. The sections in **bold** are the
ones the original brief lacked. Two worked examples follow the template: the
city builder that seeded this skill, and a third-person action roguelike to
show the same template on a different genre. The placeholders' values come
from the reference study and the genre playbook.

---

# Goal

Build a {GENRE}-class {GAME TYPE} in {STACK}, from this folder. The bar is
{BAR: e.g. AAA}: {three or four concrete visual and feel qualities, taken
from docs/REFERENCE.md}. Never {ANTI-GOAL}. References: {images in
docs/reference/ | named titles | prose}; look targets in docs/REFERENCE.md.

**Definition of done for the demo:** {a playable slice in one sentence, with
the verbs the player performs and the things that must visibly happen}.

# How to work

1. **Reference study and architecture first.** Write `docs/REFERENCE.md`
   from the references (camera, scale, value, materials, light, density,
   UI, motion, signature, per-preset targets, genre tells). Then
   `ARCHITECTURE.md`: one folder per subsystem ({LIST, derived from the
   genre playbook}), plus `core/` (renderer setup, camera, the shared world
   data model, event bus, input, material and asset library, the
   verification harness) owned by the integrator only. For each module: its
   public API, the events it emits, its showcase preset. Units {UNITS}, up
   axis {AXIS}. Determinism: seeded RNG for all generation; the frame clock is
   the only permitted nondeterminism and the harness can freeze it. Perf
   budget: {FPS} at {RES} on the demo scene at its largest preset, {DRAW CALLS}
   max, measured on a real GPU with the hardware recorded. Asset policy:
   {LICENCE} only, vendored, {SIZE CAPS}, attribution file kept accurate.
   Isolate module failures so one broken module never takes the game down.
   **Record big decisions once** in `docs/DECISIONS.md` with a reason
   (renderer, shading approach, world model); later waves cite, not reopen.
   **Keep an assumptions ledger**: every routine decision the brief did not
   make is written down there.

2. **Verification loop before the game.** A headless-browser capture tool
   that loads the app, waits for the ready signal, applies a preset, a
   scenario and a time, freezes the clock, and writes PNG plus a JSON log
   (uncaught errors, unhandled rejections, context loss, warning count, fps,
   draw calls, entity counts, hardware). A debug API that exposes real
   state, waits N frames and drives input deterministically, so every
   gameplay criterion is a given/when/then test written before the
   feature. Every module ships a showcase mode that stages a
   representative scene of just that module. **Evidence per module type:**
   image for visual modules; image plus event log for simulation and traffic;
   loudness or spectrogram image for audio; action log for tools and UI. No
   agent claims anything it has not captured and looked at. **Dev server
   contract:** fixed port, health URL, ready signal that resets on HMR.

3. **Fan out.** Use multi-agent orchestration. One builder per module, owning
   only its folder, in its own worktree. Waves by dependency: {WAVES}.
   Between waves one integrator (the only writer of `core/`) applies builders'
   core-change requests, fixes seams, **commits and tags the wave**.
   **Effort priority:** visible-impact modules get rounds first.

4. **Gauntlet every module.** After each builder round a separate critic (an
   art director who writes no code) takes its own captures at several times
   of day and zoom levels, checks the API contract, the console log and perf,
   and scores 0–10 against {REFERENCE BASIS}: 10 = indistinguishable, 8.5 =
   AAA with nits, 7 = good indie, 5 = programmer art. Pass = ≥{THRESHOLD} with
   zero uncaught errors. **Reference rule:** score against user-supplied
   images in `docs/reference/` if present, else against `docs/REFERENCE.md`
   written from title knowledge, and say which. **Output format:** ranked issues, each with capture id,
   region, severity, and what +1 looks like. **Calibration:** re-score last
   round's captures before scoring new ones. Below pass, the builder gets the
   list and goes again, up to {ROUNDS} rounds. **Ceiling rule:** no gain for
   two consecutive rounds → mark `ceiling` with the blocking reason and move
   on.

5. **Final gate.** A whole-game critic scores the demo (level, map, track or
   match) against the definition of done. Then blind judges get pairs labelled A and B (ours vs. reference,
   shuffled) and say which looks better and why. **Judging is recorded, not
   gating**, and judges are told the comparison basis honestly.

6. **Loop** until every module is `pass` or `ceiling` and the final gate has
   run. Persist scores, open issues, ceilings and the last capture ids to
   `docs/STATUS.json` so each iteration resumes from the module with the
   largest expected gain, not from scratch.

# Rules

- Never inflate scores. Report real numbers, failed rounds, ceilings, and what
  is still missing.
- Never edit another module's folder. Core changes go through the integrator.
- Keep the dev server running and the app loadable at all times; other agents
  are capturing it. A broken build is reverted to the last tag first, fixed
  second.
- Do not ask me questions. Make routine decisions yourself, write them in the
  assumptions ledger, keep going.
- **Uncaught errors, unhandled rejections and WebGL context loss gate.
  Warnings are counted and reported; they do not gate.**

Start now.

---

## Worked example A: Cities: Skylines II–class city builder

GENRE/GAME TYPE: Cities: Skylines II–class city builder.
STACK: Three.js (latest release, version pinned in package.json) + Vite, plain
ES modules.
BAR: AAA — photographic PBR materials, physically plausible sun/sky/shadows,
atmospheric depth, a living city at night, believable roads and traffic.
ANTI-GOAL: programmer art.
DEFINITION OF DONE: the player draws roads, paints residential, commercial and
industrial zones, watches buildings grow along them, sees vehicles drive the
network and lights come on as the day passes, and can save and reload the
city.
LIST: terrain, environment (sky/weather), roads, zoning, buildings, props,
traffic, effects, simulation, tools (in-game build tools), ui, audio, demo
city.
UNITS/AXIS: metres, +Y up.
FPS/RES/DRAW CALLS: ≥50 fps at 1080p, ≤1500 draw calls, on the demo city at
its largest preset.
LICENCE/SIZE CAPS: CC0 only (Poly Haven, ambientCG, procedural); ≤8 MB per
texture set, ≤300 MB total vendored assets.
WAVES: (1) core + verification harness; (2) terrain, environment, roads,
simulation, ui, audio, effects; (3) zoning, buildings, props, traffic, tools;
(4) demo city.
REFERENCE BASIS: Cities: Skylines II look — user-supplied screenshots in
`docs/reference/` if present, else the written rubric in `critic-rubric.md`.
THRESHOLD/ROUNDS: 8.5, up to 4 rounds per module per wave.

## Worked example B: third-person action roguelike

GENRE/GAME TYPE: Hades-class isometric action roguelike.
STACK: Three.js (pinned) + Vite, plain ES modules; 3D characters with
stylised shading, fixed isometric camera.
BAR: AAA feel — readable silhouettes at the fixed camera distance, hit
feedback within 4 frames, animation with anticipation and follow-through,
painterly lit environments with strong value separation, a screen that
stays readable with twenty enemies and effects on it.
ANTI-GOAL: floaty movement, stiff animation, effects that hide the action.
DEFINITION OF DONE: the player moves, dashes, attacks with two weapons,
kills enemies of three types across three rooms, picks a boon between
rooms, dies, and restarts with meta-progression persisted.
LIST: level rooms and generation, character (rig, locomotion, animation),
camera, combat and hit resolution, enemies and AI, abilities and effects,
boons and progression, ui, audio, demo run.
UNITS/AXIS: metres, +Y up; fixed camera 50° down.
FPS/RES/ENTITIES: ≥60 fps at 1080p with 20 enemies, 200 projectiles and
effects on screen; ≤800 draw calls.
LICENCE/SIZE CAPS: CC0 only; ≤4 MB per texture set, ≤200 MB total; rigs
and animation procedural or CC0.
WAVES: (0) core + harness; (1) level rooms, character + animation, camera,
ui, audio; (2) combat, enemies/AI, abilities/effects, boons; (3) generation
and demo run.
REFERENCE BASIS: `docs/reference/` if the user supplies store-page images;
else REFERENCE.md from knowledge of the named title.
THRESHOLD/ROUNDS: 8.5, up to 4 rounds per module per wave.
Genre-specific evidence: animation log (no state pops), input-to-hit
latency measured in frames, a full run recorded as a state log, determinism
of a run at a fixed seed.
