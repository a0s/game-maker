---
name: game-maker
description: Build any game from a description and references (city builder, RTS, action/roguelike, shooter, racing, open world, platformer, puzzle, flight, 3D or 2D) to a stated visual and gameplay bar with a fleet of agents. Studies the references into checkable look targets, derives the module decomposition from the genre, writes the architecture and verification harness first, runs one builder per module in dependency waves with an integrator for the shared core, an art-director critic that scores its own captures against the rubric, blind A/B judges, and a persisted status file so the loop resumes from the weakest module. Use whenever the request is to build or extend a game, to make a scene "look AAA" or "like <title>", to run a builder/critic loop, or to turn a one-line game idea plus screenshots into a runnable multi-agent brief. Produces docs/REFERENCE.md, ARCHITECTURE.md, docs/DECISIONS.md, docs/STATUS.json, a capture tool with JSON logs, per-module showcases, ranked critic reports, and a playable demo, not a tech demo with no game in it.
license: MIT
compatibility: Node 18+, a Chromium for captures (puppeteer), a real GPU-backed browser for perf numbers. Blender optional. Multi-agent orchestration via the host's Agent/Workflow tools; sequential Agent calls otherwise.
metadata:
  version: "1.1"
  seed: a public "Cities: Skylines II in Three.js" brief, analysed in references/prompt-analysis.md; the method is genre-agnostic
---

# Game maker

You are running a studio, not writing a scene. The work is split so that
nobody has to reason about the whole codebase, and every claim of progress
is a file on disk that a different agent can open. The one principle that
decides quality: **constrain the evidence, not the method.** Builders are
free in how they reach the bar. They are not free in what counts as proof.

The genre, the stack and the module list are *inputs* derived from the
user's description and references. Nothing below assumes a particular
game.

## The loop in one screen

```
description + references
  ─► reference study → docs/REFERENCE.md (checkable look targets)      wave 0
  ─► brief → genre playbook → module list, waves, definition of done     wave 0
  ─► ARCHITECTURE.md + DECISIONS.md + core/ + capture tool               wave 0
  ─► builders in parallel, one per module folder                         wave N
  ─► integrator merges, applies core requests, tags wave-N
  ─► critic per module: own captures, rubric + REFERENCE targets, ranked issues
  ─► FAIL → builder again (≤ round cap)   PASS / CEILING → next
  ─► demo → whole-game critic → judges → STATUS.json
  ─► loop from the module with the largest expected gain until every
     module is pass or ceiling and the final gate has run
```

Read `references/orchestration.md` for roles and waves, and load the
`workflow-authoring` skill before writing a workflow script. If the user
has not opted into multi-agent orchestration, run the same roles as
sequential Agent calls; the contract is identical.

## Step 0a: study the references

Follow `references/reference-study.md`. Open every image in
`docs/reference/`, sample any video, and write `docs/REFERENCE.md`: camera,
scale cues, value range, material families, light model, density and
variety, UI style, motion, the signature of the look, per-preset targets,
and genre tells. If the user named titles but gave no images, derive the
targets from knowledge and say so. If they gave only prose, pick the
closest known titles, state the assumption, proceed. The critic quotes
REFERENCE.md lines in every report; without this file "AAA" is a mood.

## Step 0b: the brief and the decomposition

If the user gave a full brief, keep it and fill only the gaps below. If
they gave one line, write the brief from `references/brief-template.md`
into `docs/BRIEF.md` with the assumptions stated. Then derive the module
list, wave order, shared presets, evidence types and visibility weights
with `references/genre-playbook.md`. Do not ask.

The gaps a brief almost always has (see `references/prompt-analysis.md`):

1. **Definition of done** for the demo as a playable slice: the verbs the
   player performs and what must visibly happen.
2. **`core/` defined and owned**: renderer setup, camera and shared
   presets, world data model, event bus, seeded RNG, input, material and
   asset library with semantic names, module loader with failure
   isolation, ready signal and debug API, capture tool.
3. **Termination**: `pass` or `ceiling` per module; the loop ends when all
   modules are one of the two and the final gate has run.
4. **Reference basis**: images in `docs/reference/` if present, else
   REFERENCE.md from knowledge; the critic says which.
5. **Perf budget with a scene scale and hardware**: fps, draw calls, entity
   counts, at the demo's largest preset, on a real GPU.
6. **Evidence type per module**: image, image+log, audio
   loudness/spectrogram, action log, state-based acceptance.
7. **Git**: worktree per builder, tag per wave, `best` tag.
8. **Stack and asset caps**, a neutral project name (no trademark in the
   repo), the stack decision written once in `docs/DECISIONS.md`.

## Step 1: architecture and harness before features

The integrator writes `ARCHITECTURE.md` against
`references/architecture-checklist.md`, records the stack, renderer and
shading decisions in `docs/DECISIONS.md` with reasons, builds `core/`,
copies `scripts/shoot.mjs` from this skill into the project and adapts the
ready signal and debug API names, starts the dev server on the fixed port,
and proves the loop with one capture of the empty world. No builder starts
before that capture exists and has been opened.

Full contract in `references/verification-loop.md`: ready signal, URL
query for showcase/preset/scenario/time/seed/freeze, JSON log fields,
headless vs real-GPU rule, evidence types, and state-based acceptance
tests for gameplay.

## Step 2: waves

One builder per module, own worktree, own folder, plus
`docs/shots/<module>/`. Wave 0 is core and harness. Then by dependency and
by visible impact: what the player sees at the widest preset first. The
first playable slice (one verb of the definition of done end to end) is
scheduled as early as the dependency graph allows, never only at the end.

Builders never touch `core/`; they write `docs/core-requests/<module>-<n>.md`
and degrade gracefully meanwhile. The integrator merges between waves,
answers every request in its file, fixes seams in core or as a note to the
builder, tags the wave, and captures the shared presets.

Agent definitions to spawn with: `.agents/agents/game-builder.md`,
`game-integrator.md`, `game-critic.md`, `game-judge.md`. Each prompt
names the module, the game, and the paths to BRIEF, REFERENCE,
ARCHITECTURE and STATUS.

## Step 3: the gauntlet

After every builder round the critic follows `references/critic-rubric.md`:
its own captures at the shared presets (wide, close, hardest lighting,
motion), re-scores last round's captures first to keep the scale stable,
describes each capture before scoring, runs the generic tells plus the
genre tells from REFERENCE.md, scores as the lowest of the set, applies
the gates (uncaught errors, rejections, context loss, API contract,
budget allowance), and returns ranked issues each with capture id,
region, severity, the REFERENCE line it violates, and what +1 looks like.

No gain for two consecutive rounds → `ceiling`, with the blocking reason.
A ceiling is honest and is listed in the final report; it is never
relabelled as a pass.

## Step 4: final gate and judges

Whole-game critic: definition of done first, verb by verb, using the
state-based acceptance tests; then the visual rubric on the shared
presets; then the perf budget on a real GPU with the GPU string in the
report. Judges get shuffled A/B pairs with no provenance and return
winner, confidence, reason, and the tell if they spotted one. Judging is
recorded in `docs/judging/`, not gating.

## Step 5: STATUS.json and resuming

`docs/STATUS.json` (schema in `references/status-schema.md`) is written
before every spawn and after every report, so a usage limit or a crash
loses nothing. On resume: read it, do `nextAction`, do not re-derive. The
next module is the one with the largest `(threshold - score) × visibility`
that is not `pass`, `ceiling`, or waiting on a core request.

## Extending an existing game

Same loop, smaller scope. Read REFERENCE, ARCHITECTURE, DECISIONS and
STATUS first. A feature that touches several modules is a mini-wave:
builders for the touched modules, integrator for seams, critic on the
affected presets plus a regression pass on the `best` tag's captures.

## Rules

- Never inflate. Real numbers, failed rounds, ceilings, what is missing.
- Never edit another module's folder. Core changes go through the
  integrator, in writing.
- Keep the dev server up and `main` loadable. A merge that breaks the load
  is reverted first, fixed second.
- Do not ask the user questions. Decide, write the assumption in the
  ledger, continue. Never end a turn with "say the word and I'll start"
  while STATUS has a `nextAction`; the loop is the default.
- Nothing is claimed that was not captured, opened, and described.
- Assets under a permissive licence only (CC0 by default), vendored,
  within caps, attributed. No runtime network.
- Everything written into the project is in English.

## Files in this skill

| Path | Use it when |
|------|-------------|
| `references/reference-study.md` | turning images, video or titles into checkable look targets |
| `references/genre-playbook.md` | deriving modules, waves, presets and evidence from the genre |
| `references/brief-template.md` | writing or completing a brief; two worked examples |
| `references/prompt-analysis.md` | why each rule exists; improving a brief |
| `references/architecture-checklist.md` | the integrator writes ARCHITECTURE.md |
| `references/verification-loop.md` | building the harness; what counts as evidence |
| `references/critic-rubric.md` | scoring; generic tells; report format |
| `references/orchestration.md` | roles, wave derivation, git, workflow skeleton |
| `references/status-schema.md` | writing or reading STATUS.json |
| `references/field-notes.md` | real numbers and lessons from the seed run |
| `scripts/shoot.mjs` | reference capture tool to copy into the project |
