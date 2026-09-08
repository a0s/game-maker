# Analysis of the original brief

The brief that seeded this skill (a Cities: Skylines II–class city builder in
Three.js + Vite, built by a fleet of agents) is reproduced in
`brief-template.md` as the worked example. This file records what is strong in
it, where it will fail in practice, and what to change — with the constraint
that the model executing it is assumed to be smarter than the author, so every
fix must widen the evidence required, never narrow the method allowed.

## What is strong — keep verbatim

1. **A taste target and an anti-goal.** "AAA bar, photographic PBR, never
   programmer art" is a stronger steer than any list of techniques. It lets a
   capable model pick the technique.
2. **Architecture before code, with concrete contents.** Units, +Y up, seeded
   RNG, a numeric perf budget, an asset licence policy, and failure isolation
   are exactly the things a fleet of agents cannot agree on after the fact.
3. **Verification loop before the game.** Screenshot tool + ready signal +
   per-module showcase + "no claim without a screenshot you looked at" is the
   single most valuable paragraph. It converts opinion into evidence.
4. **Dependency-ordered waves with single ownership.** One folder per builder,
   one integrator for the shared code, and integration only between waves,
   prevents the merge chaos that kills multi-agent runs.
5. **A critic who writes no code**, a calibrated scale with named anchors, a
   pass threshold, and a bounded number of rounds.
6. **Blind A/B judging** at the end, order shuffled, "which and why".
7. **Persisted state** (`docs/STATUS.json`) so a loop resumes from the weakest
   part, not from zero.
8. **Honesty and autonomy rules.** Never inflate, report failed rounds, do not
   ask questions, state assumptions.

## Where it will fail in practice

1. **No termination other than success.** "Loop until every critic passes" plus
   "never inflate scores" plus a bar of 8.5 against a AAA title can be a loop
   that never ends. There is no plateau rule and no budget.
2. **The reference images do not exist.** The critic is told to score against
   "real Cities: Skylines II reference screenshots" and the judges compare
   against them, but nobody supplies them, the agent cannot legally fetch them,
   and the asset policy is CC0. Without a rule, the critic will pretend to have
   compared.
3. **`core` is referenced but never defined.** The integrator is "the only one
   allowed to touch core", yet core is not in the module list. Camera, renderer
   setup, the material/asset library, the event bus, the world data model and
   the screenshot harness all need a home and an owner. Without a shared
   material library each module will invent its own PBR look and the city will
   never read as one place.
4. **Perf budget without a scene scale or hardware.** "≥50 fps at 1080p" is
   meaningless on an empty scene and unmeasurable in headless Chrome
   (SwiftShader). The budget needs the demo-city scale and a real GPU, with the
   hardware recorded in the log.
5. **"Screenshot everything" cannot cover audio.** Audio needs its own evidence
   (loudness log, spectrogram or a rendered waveform image); the rule as
   written makes audio unverifiable or exempt.
6. **Blind judging inside one model family is weakly blind.** A real
   screenshot and a Three.js render are easy to tell apart. Judging is still
   useful as a ranked reason list, but it must be recorded, not gating, and the
   judges must be told the comparison basis honestly.
7. **The gameplay slice is undefined.** The brief is ninety percent visuals. A
   capable model may deliver a beautiful renderer with no game. The demo city
   needs a definition of done: place roads, zone, buildings grow, traffic
   flows, day passes.
8. **Concurrency and rollback are not addressed.** Nothing about git, commits
   per wave, worktrees per builder, or tagging the best-scoring state. Failure
   isolation at the module level is good; failure isolation at the repo level
   is missing.
9. **The critic persona invites unactionable harshness.** "Brutal art
   director" without an output format produces adjectives. The builder needs a
   ranked list where each issue names the screenshot, the region and what a
   +1 looks like. Scores also drift between rounds unless the critic re-scores
   the previous round's screenshots first.
10. **Builder and critic share blind spots.** The same model family that
    produced a flat, uniformly rough scene will often accept it. A checklist of
    programmer-art tells (uniform roughness, no AO, no colour variation, visible
    tiling, hard shadow edges, no aerial perspective, emissives without bloom)
    is a reference the critic runs through, not a rule the builder must follow.
11. **Dev server contract is implicit.** "Keep it running" needs a fixed port,
    a health check, and a ready signal that survives HMR so screenshots are
    never taken mid-reload.
12. **"Three.js latest release" hides a large decision.** WebGPURenderer with
    TSL versus WebGLRenderer changes every module's shaders. The brief should
    not decide, but it should require the decision to be recorded once with a
    reason, so it is not relitigated in every wave.
13. **Console gate is under-specified.** "Zero errors" should mean uncaught
    exceptions and unhandled rejections; warnings are counted and reported but
    do not gate, otherwise a third-party deprecation notice blocks a wave.
14. **Effort has no priority.** Thirteen modules times four rounds times a
    critic is a large budget. Visible-impact modules (terrain, sky, roads,
    buildings) deserve rounds before audio does.
15. **Asset policy has no size cap.** "Poly Haven" with no cap and no vendoring
    rule can pull gigabytes and make the game depend on the network at runtime.

## Improvements — each widens evidence, none narrows method

| # | Change | Why it does not over-constrain |
|---|--------|--------------------------------|
| 1 | Two terminal states per module: **pass** or **ceiling** (no score gain for two consecutive rounds, documented with the blocking reason). Loop ends when all modules are in one of the two and the final gate has run. | Adds an exit, changes nothing about how the bar is reached. |
| 2 | Reference set rule: if `docs/reference/` holds user-supplied images, score against them; otherwise score against the written rubric and say so. Never claim a comparison that did not happen. | Honesty rule, not a technique. |
| 3 | Define `core/` explicitly (renderer, camera, world model, event bus, material and asset library, screenshot harness) with a single owner and a published API. | Names an owner; the owner still designs it. |
| 4 | Perf budget is measured on the demo city at its largest preset, on a real GPU, hardware and browser recorded in the log; headless SwiftShader runs are for correctness only. | Makes the existing number measurable. |
| 5 | Evidence types per module: image for visual modules, image plus log for traffic and simulation, loudness/spectrogram for audio, log for tools and UI actions. | Extends "screenshot everything" to what can actually be captured. |
| 6 | Definition of done for the demo city as a playable slice (roads, zoning, growth, traffic, day cycle, save state). | States the outcome, not the implementation. |
| 7 | Dev server contract: fixed port, health endpoint or URL, `window.__GAME_READY__` (or equivalent) that the screenshot tool awaits and that resets on HMR. | A contract between two tools, not a design rule. |
| 8 | Git: commit at every wave boundary, a worktree per builder, tag the best-scoring state so a regression can be reverted. | Safety net; no effect on code. |
| 9 | Critic output format: ranked issues, each with screenshot id, region, severity, and "what +1 looks like"; critic first re-scores the previous round's images to calibrate. | Makes feedback actionable and stable. |
| 10 | Programmer-art tells checklist shipped with the critic rubric, marked as *reference*. | Sharpens the critic's eye; the builder never sees it as a rule. |
| 11 | Record big decisions once (`docs/DECISIONS.md`): renderer, shading approach, world model. Later waves cite, not reopen. | Prevents churn; does not prescribe the answer. |
| 12 | Console gate = uncaught exceptions + unhandled rejections + WebGL context loss. Warnings reported, counted, non-gating. | Precision, not restriction. |
| 13 | Effort priority: visible-impact first; critic can lower a module's threshold only by writing the reason into STATUS.json. | Budget guidance stays with the orchestrator. |
| 14 | Asset policy: CC0, vendored into the project, per-texture and total size caps, attribution file kept accurate. | Legal and operational hygiene. |
| 15 | Assumptions ledger in ARCHITECTURE.md: every routine decision the brief did not make is written down, so "do not ask me questions" has a paper trail. | Keeps autonomy while keeping the user informed. |

## The one principle behind all of it

**Constrain the evidence, not the method.** A brief for a model smarter than
its author should say what must be true at the end and what proof is accepted,
and stay silent on how. Every rule above is a rule about proof, ownership, or
termination. None is a rule about shaders.
