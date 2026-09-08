# game-skill

A harness for building any game from a description and references (city
builder, RTS, action, shooter, racing, open world, platformer, puzzle, 3D or
2D) to a stated visual and gameplay bar with a fleet of agents: a reference
study that turns screenshots into checkable targets, builders per subsystem,
one integrator for the shared core, an art-director critic that writes no
code, blind A/B judges, and a state file that lets the loop resume from the
weakest module instead of from scratch. The seed example was a Cities:
Skylines II-class city builder in Three.js; the method does not depend on
it.

Everything is one skill plus four agent definitions. It works identically in
Claude Code, Codex CLI, and anything else that reads the Agent Skills standard.

## Layout

```
.agents/skills/          the skills (Agent Skills REPO scope)
  game-maker/            the method: SKILL.md, references/, scripts/
.agents/agents/          subagent definitions used by the orchestration
  game-builder.md        owns one module folder, ships a showcase, screenshots
  game-integrator.md     the only agent allowed to touch core/
  game-critic.md         scores modules against the rubric, writes no code
  game-judge.md          blind A/B judging at the final gate
.claude/skills           symlink -> ../.agents/skills
.claude/agents           symlink -> ../.agents/agents
AGENTS.md                this file
CLAUDE.md                symlink -> AGENTS.md
workspace/               game projects, one folder per game (created on demand)
```

Nothing is duplicated between agents. `.claude/` holds symlinks only, so a change
to a skill or an agent definition is a change everywhere at once.

## Working here

When a request is to build, extend, or judge a game of any genre, to make a
scene look "AAA" or "like <title>", or to run the builder/critic loop,
**use the `game-maker` skill** and follow it. The reference study, the
genre-derived decomposition, the verification contract, and the critic
gauntlet are what make the result look like the game that was asked for
rather than a tech demo.

The short version of the contract:

1. Study the references into `docs/REFERENCE.md`, derive modules and waves
   from the genre, write the brief and ARCHITECTURE.md before any feature
   code. Big choices (stack, renderer, world model, event bus) are recorded
   as decisions with a reason so later iterations do not relitigate them.
2. Build the verification loop before the game: the screenshot tool, the ready
   signal, the showcase mode. Nothing is claimed that was not screenshotted and
   looked at.
3. Fan out by dependency waves. One builder per module folder; the integrator is
   the only writer of `core/`; the critic writes no code.
4. Gates are measurable: score threshold, zero uncaught errors, the perf budget
   on a real GPU at the demo's largest scale. Scores are never inflated.
5. Every module ends the loop in one of two states: **pass** or **ceiling**
   (documented plateau). The loop terminates when all modules are in one of the
   two and the final gate has run.
6. State lives in `docs/STATUS.json` in the game project. Each iteration reads
   it first and resumes from the module with the largest expected gain.

## House rules

- Everything in this repository is written in English, including comments and
  documentation, regardless of the language of the conversation.
- Assets are permissively licensed (CC0 by default: Poly Haven, ambientCG,
  Kenney, or procedural) and are vendored into the project; the running game
  never fetches from the network.
- Constrain the evidence, not the method. Builders are free in how they reach
  the bar; they are not free in what counts as proof.
