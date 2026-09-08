# Orchestration

Runs as a Workflow ("ultracode") when the user has opted in, or as a sequence
of Agent calls otherwise. The shape is the same either way.

## Roles

| Role | Definition | Writes | Reads |
|------|------------|--------|-------|
| integrator | `.agents/agents/game-integrator.md` | `core/`, `ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/STATUS.json`, git tags | everything |
| builder | `.agents/agents/game-builder.md` | its own module folder only, `docs/shots/<module>/` | `ARCHITECTURE.md`, `core/` API, critic reports |
| critic | `.agents/agents/game-critic.md` | `docs/reviews/<module>/rN.md`, `docs/shots/<module>/critic-*` | captures, STATUS, ARCHITECTURE |
| judge | `.agents/agents/game-judge.md` | `docs/judging/*.md` | shuffled pairs only |

The orchestrator (the session running the skill) never writes game code. It
reads STATUS, decides the next wave or the next module, spawns the roles,
and updates STATUS from their reports.

## Wave order

Derived per game with `genre-playbook.md`; the shape is always:

0. integrator: reference study, brief, ARCHITECTURE.md, DECISIONS.md,
   `core/`, the harness, dev server up, first capture of an empty world
   proves the loop works.
1. builders in parallel for the modules with no unmet dependencies,
   visible-impact first. Each in its own worktree; each ends with a
   showcase and a report.
2. integrator merges, applies core-change requests, fixes seams, commits,
   tags `wave-1`. Critic gauntlets each module (parallel). Builders re-run
   on FAIL up to the round cap or ceiling.
3. next dependency layer; the first playable slice (one verb of the
   definition of done end to end) is scheduled in the earliest wave the
   graph allows. Same merge, tag, gauntlet.
4. demo builder assembles the playable slice into the demo level, map,
   track or match. Whole-game critic against the definition of done. Perf
   gate on a real GPU. Judges.
5. Loop: pick the module with the largest expected gain
   (`(threshold - score) × visibility weight`, skipping ceilings), run one
   builder+critic round, update STATUS, repeat until every module is
   `pass` or `ceiling` and the final gate has run.

Example for a city builder: wave 1 terrain, environment, roads,
simulation, ui, audio, effects; wave 2 zoning, buildings, props, traffic,
tools; wave 3 demo map. Example for a third-person action game: wave 1
level, character controller and animation, camera, ui, audio; wave 2
combat, enemies/AI, abilities/effects, loot; wave 3 level generation and
the demo run. The playbook table has more.

## Core-change requests

A builder that needs something from `core/` does not edit it. It writes
`docs/core-requests/<module>-<n>.md` with: what, why, the smallest API that
would do, and how the module degrades without it. The integrator applies,
rejects with a reason, or offers an alternative, between waves.

## Git

- One worktree per builder, branch `mod/<module>`; the integrator merges into
  `main` and tags `wave-N`.
- `main` must always build and load. A merge that breaks the load is reverted
  first, investigated second.
- The best-scoring state is tagged `best`; STATUS records which tag it is.

## Effort

Visible-impact modules first: whatever fills the wide preset, then what
fills the close preset, then motion, then systems the player feels but
does not see, then audio. Visibility weights come from the playbook step.
The critic can propose a lower threshold for a module only by writing the
reason into STATUS; the orchestrator decides.

## Workflow script skeleton

Load the `workflow-authoring` skill before writing the real one. Shape:

```js
export const meta = {
  name: 'game-maker-wave',
  description: 'One builder+critic wave over the modules listed in args',
  phases: [{ title: 'Build' }, { title: 'Integrate' }, { title: 'Gauntlet' }],
}
const status = JSON.parse(await readFile('docs/STATUS.json'))
const modules = args.modules
const reports = await parallel(modules.map(m => () =>
  agent(builderPrompt(m, status), { label: `build:${m}`, phase: 'Build', schema: REPORT })))
const merge = await agent(integratorPrompt(reports), { label: 'integrate', phase: 'Integrate', schema: MERGE })
const reviews = await parallel(modules.map(m => () =>
  agent(criticPrompt(m), { label: `critic:${m}`, phase: 'Gauntlet', schema: REVIEW })))
return { reports, merge, reviews }
```

The orchestrator applies `reviews` to STATUS and decides whether to run the
wave again for the FAIL set.
