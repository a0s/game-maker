# Verification loop

Built before the first feature. The point is to make "it looks good" a file
on disk that another agent can open.

## The contract

**Dev server.** `npm run dev` on a fixed port (default 5173, set `strictPort`
so a collision fails loudly instead of moving). Health = the root URL returns
200 and the page sets the ready signal.

**Ready signal.** The app sets `window.__GAME_READY__ = true` once the renderer
has produced its first frame with all requested modules loaded, and resets it
to `false` on HMR disposal. The app also exposes `window.__GAME__` with, at
minimum: `setPreset(name)`, `setScenario(name)`, `setTime(value)`,
`setSeed(n)`, `freeze(bool)`, `wait(frames)`, `state()`, and `stats()`
returning `{fps, drawCalls, triangles, programs, entities, memoryMB}`.
Names can differ if `ARCHITECTURE.md` says so; the harness and the app must
agree, and the harness reads them from one place.

**URL query.** `?showcase=<module>&preset=<name>&scenario=<name>&time=<value>&seed=<n>&freeze=1`
selects what is staged. `time` is whatever the game's clock means (hours of
day, match minute, run depth); ARCHITECTURE.md defines it. Every module
registers at least one showcase preset; the demo registers the shared
presets from the genre playbook (at least one wide, one close, one at the
hardest lighting condition, one in motion) so captures are comparable
across rounds and modules.

**Capture tool.** `scripts/shoot.mjs` (a reference implementation ships in
this skill's `scripts/`; copy it into the project and adapt it):

```
node scripts/shoot.mjs --showcase <module> --preset close --time 18.5 --seed 7 \
  --out docs/shots/<module>/r3-close-1830
```

Writes `<out>.png` and `<out>.json`. The JSON log carries:

```json
{
  "url": "...", "showcase": "<module>", "preset": "close", "scenario": null, "time": 18.5, "seed": 7,
  "readyMs": 3120, "settleMs": 1500,
  "errors": [], "rejections": [], "contextLost": false, "warnings": 2,
  "stats": {"fps": 61, "drawCalls": 812, "triangles": 1450000, "programs": 41},
  "gpu": {"renderer": "ANGLE (Apple, Apple M2 ...)", "headless": false},
  "viewport": [1920, 1080], "threeVersion": "r1xx", "takenAt": "ISO"
}
```

**Headless vs real GPU.** Headless Chrome renders through SwiftShader by
default. That is fine for correctness (errors, missing textures, wrong
composition) and useless for fps. The perf gate is measured in a real
GPU-backed browser (headful Chrome, or the Claude-in-Chrome tools) on the
demo at its largest preset, and the log records the GPU string. A perf number
from a SwiftShader run is reported as `"fps": null` with `"headless": true`.

**Freezing.** With `freeze=1` the harness stops the clock at the given time
and simulation tick so two captures of the same seed, preset and time are
pixel-comparable. Builders and critic both use freeze for scoring captures;
unfrozen captures are for motion checks (agents, animation, weather,
particles) and are labelled.

## Evidence types

| Module kind | Evidence |
|-------------|----------|
| World and environment (terrain, level, sky/weather, water, foliage, props, effects, demo) | PNG at ≥2 presets × the lighting conditions the game has (e.g. dawn, noon, night; or lit/dark interiors) plus the JSON log |
| Characters, vehicles, units (rig, locomotion, animation) | PNGs at close and wide plus an unfrozen motion capture sequence (3–5 frames at fixed intervals) and an animation log (state, blend weights, no pops) |
| Simulation, AI, economy, pathfinding | PNGs plus an event log (`docs/shots/<module>/<id>.events.jsonl`) showing ticks, counts, and invariants held; state-based acceptance results |
| Audio | A loudness log and a spectrogram or waveform PNG rendered from the mixed output over a scripted 30 s scene; plus the JSON log for errors |
| Tools, UI, input | Action log of a scripted interaction (the module's verbs, undo, resize) with before/after PNGs at two viewport sizes |
| Combat, physics, controllers | State-based acceptance results (timings, curves, determinism at fixed seed) plus a motion capture sequence |

A builder's round report lists every capture id it relied on. The critic never
reuses builder captures for scoring; it takes its own.

## State-based acceptance (gameplay, tools, simulation)

Screenshots prove a look; they do not prove a rule. For behaviour, the
harness exposes real state and a driver, and every criterion is written as
given / when / then with a measurable "then" *before* the feature exists:

- `window.__GAME__.state()` returns the live model (or a snapshot): time,
  entity counts and positions, the player's state, the active tool or
  input mode, save version. `window.__GAME__.wait(frames)` resolves after
  N rendered frames. `input(sequence)` drives keys, pointer and gamepad
  deterministically. All are declared in `ARCHITECTURE.md`.
- `?scenario=<name>` loads a staged state (an empty level with one
  platform, a saturated crossroads, a boss arena at 10 % health, a save
  from the previous version).
- A driver script (Puppeteer or Playwright) presses keys, clicks, and calls
  the debug API, then asserts on state and takes a capture.

Examples of the form:

```
given scenario=flat  when hold W for 60 frames  then player.z moved by speed*1s ±10 % and x unchanged
given scenario=empty  when the build tool drags (100,100)->(300,100)  then graph.segments == 1 and the capture shows the piece on the ground
given scenario=crossroads-busy  when wait(600)  then no agent position repeats for 60 frames (no deadlock) and agents.count >= 40
given scenario=arena  when press attack within 3 m of enemy  then enemy.hp decreased, hit-reaction animation state entered within 4 frames
given scenario=saved-v1  when load()  then state deep-equals the fixture except runtime fields
```

Hard checks (state, zero uncaught errors) are pass/fail in the JSON log.
Fuzzy checks (does the walk look right, is the HUD readable) go to the
critic with captures. Write the acceptance test first, watch it fail, then
build until it passes.

## Looking

Captures are opened with the image-reading tool and described in one or two
sentences in the round report before any claim about them. "Looks good" is
not a description. "The ground reads as one flat grey; no wear, the edge
where wall meets floor is a hard unshaded step; the character's feet float
2 cm above it" is.
