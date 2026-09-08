# Field notes from the original run

Facts reported by the author of the seed brief in the public thread where it
was posted, and what this skill does with each. They are observations, not
guarantees; budgets vary with model, plan and scene.

## What the run looked like

| Fact | Consequence for this skill |
|------|----------------------------|
| One prompt, no CLAUDE.md, clean VM with only Blender and the CLI installed. The model wrote the architecture, then spawned ~14 agents (one per subsystem plus critics). | The skill assumes an empty folder is enough. Nothing here needs a pre-existing project. |
| Wave 1 took about 1.5 h wall-clock, ~$200 of API-equivalent usage, 18 % of a weekly 20x-plan limit. Tokens: ~0.3 M input, ~1.9 M output, ~118 M cache read, ~6 M cache write. All agents at the highest effort. | Budget is real. The orchestrator writes the expected spend per wave into STATUS and stops at a usage limit cleanly: STATUS is written before every spawn so "continue" resumes without loss. |
| Three runs (waves) in total; the first produced terrain, sky, roads, economy, HUD and sound and *no city*. Public reaction to wave 1 was "where is the city". | Visible-impact ordering and an early vertical slice: the demo city gets a first rough pass as soon as roads and one building type exist, not only at the end. |
| The critics scored against about a dozen public store-page screenshots the author placed in the project. | The reference rule: images in `docs/reference/` if the user supplies them, otherwise the written rubric, and the report says which. |
| Assets: the model wrote a small downloader for Poly Haven and ambientCG, built most materials procedurally, experimented in Blender for materials. Almost all audio was synthesized with the Web Audio API; one bird call was fetched from the web and layered/randomised. | Asset policy stays CC0 + vendored + size caps. Blender is optional tooling: use it if installed, never require it. Fetched audio clips fall under the same licence and attribution rule as textures. |
| Later screenshots drew the criticisms: two building models copy-pasted everywhere, 11 k citizens but empty streets, clipping, UI that looks like a website. | Added to the critic's tells: repetition, empty streets at overview zoom, interpenetration, web-page UI. Added to the definition of done: visible agents proportional to population at the overview preset. |
| Claimed >100 k citizens simulated. | The perf budget states the simulation scale (citizens, vehicles) alongside fps and draw calls. |
| The author's answer for verifying non-visual gameplay: a debug object exposing real state plus a wait-N-frames function, a driver script (Puppeteer/Playwright), scenarios selectable by URL, and given/when/then acceptance tests written first and watched to fail. | Adopted verbatim in `verification-loop.md` under "State-based acceptance". |
| A reader asked how to avoid the model stopping with "say the word and I'll launch it". | The skill states it plainly: the loop is the default; a turn never ends with an offer while STATUS has a `nextAction`. |
| Advice from the thread: keep the repository free of the reference title's name to avoid a takedown. | Project name is neutral (`city-builder`); the reference title appears only in `docs/reference/` and the brief. |

## What the thread got wrong, and what it got right

Right: "tell it how to organise the work and how to check its own output,
not just what to build"; separate builder and critic because a model
grading its own work is too kind to itself; a written rubric with anchors;
grounded verification before "done"; contract-first ownership; persisted
state for resume.

Incomplete: the brief has no exit besides success, no owner for core, no
reference-image rule, no scene scale for the perf budget, no gameplay
definition of done, no git story. `prompt-analysis.md` covers each.
