# ARCHITECTURE.md checklist

The integrator writes this before any feature code. A capable model will
design it well; this list only says what must be *present*, so that thirteen
builders working in parallel do not discover a missing agreement halfway.

## Must be present

- **Module list** with one folder each, and `core/` as the shared, integrator-
  owned folder. State for every module: purpose, public API (functions and
  their signatures or the class surface), events emitted and consumed,
  showcase preset name, evidence type (image / image+log / audio / log).
- **World data model** in `core/`: the entity types the genre playbook
  produced (for a builder: cells, segments, lots, buildings, agents; for an
  action game: level geometry, actors, projectiles, pickups; for a racer:
  track, vehicles, checkpoints), their ids, the clock, and who owns
  writes. One owner per entity type.
- **Event bus** contract: event names, payload shapes, ordering guarantee,
  whether events are synchronous.
- **Units and frames**: the unit (metres by default; pixels or tiles for
  2D), the up axis, world origin, chunk/tile size if any, handedness, how
  heights or collisions are queried.
- **Determinism**: a seeded RNG service in `core/`; modules never call
  `Math.random`. The frame clock is the only nondeterminism; the harness can
  freeze it at a given time of day and simulation tick.
- **Stack and rendering decision** (recorded in `docs/DECISIONS.md`):
  engine or library, renderer, colour management, tone mapping, shadow
  strategy, how modules obtain materials. The **material and asset
  library** lives in `core/`; modules request materials by semantic name
  (worn-concrete, painted-metal, foliage-broadleaf, skin) so the world
  reads as one place.
- **Performance budget**: numbers (fps, draw calls, entity counts, memory),
  the scene they apply to (the demo's largest preset), the hardware they
  are measured on, and per-module allowances that sum to the total.
- **Asset policy**: CC0 only, vendored under a fixed folder, size caps,
  `ATTRIBUTION.md` kept accurate, no runtime network.
- **Failure isolation**: how a module is loaded, how a throw inside it is
  caught, what the game shows when a module is disabled, how the harness logs
  it.
- **Dev server contract**: port, health URL, ready signal name, HMR behaviour.
- **Showcase, scenario and preset registry**: how a URL query selects
  module, preset, scenario, time, seed; the shared presets from the genre
  playbook.
- **Input and controls**: the input map, how the harness drives it
  deterministically, gamepad/keyboard/pointer ownership.
- **Assumptions ledger**: every routine decision the brief did not make.

## Should be present

- Save/load format ownership and versioning.
- Audio bus ownership and the mixer's public API.
- A per-module `README.md` template: API, events, showcase, known gaps.

## Must not be present

- Implementation instructions for modules. The document fixes contracts and
  budgets; it does not fix techniques.
