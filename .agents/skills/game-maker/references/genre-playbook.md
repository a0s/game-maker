# Genre playbook

How to turn a description plus references into a module list, a wave
order, a definition of done, camera presets and evidence types. The
integrator does this at wave 0 and writes the result into ARCHITECTURE.md.
The table rows are starting points; the reference study overrides them.

## Deriving the decomposition (any genre)

1. **List what the player sees at the widest preset** and what they see up
   close. Each distinct visual system is a module candidate (world,
   characters, vehicles, props, effects, sky/weather, UI).
2. **List the verbs in the definition of done.** Each verb maps to a
   gameplay system (movement, combat, building, economy, dialogue, AI,
   inventory, progression). Each system is a module candidate.
3. **Shared by two or more modules → core.** Renderer, camera, world data
   model, event bus, RNG, material/asset library, input, save/load format,
   audio bus, the harness. One owner: the integrator.
4. **Merge candidates until each module is one builder's week**, not a
   day and not a month. Six to fourteen modules is the usual range.
5. **Order by dependency, then by visible impact.** Wave 0 is always core
   plus harness plus one capture of the empty world. The first playable
   slice (one verb end to end) comes as early as the dependency graph
   allows, never only at the end.
6. **Assign an evidence type** per module (see `verification-loop.md`) and
   a **visibility weight** 0.2-1.0 for the STATUS gain formula.
7. **Name the shared presets** so builders and critic capture the same
   framings across rounds: at least one wide, one close, one at the
   hardest lighting condition, one in motion.

## Starting points by genre

| Genre | Typical modules (besides core) | First playable slice | Shared presets | Genre-specific evidence |
|-------|-------------------------------|----------------------|----------------|-------------------------|
| City builder / colony sim | terrain, environment (sky/weather), roads/paths, zoning, buildings, props, agents/traffic, effects, simulation/economy, build tools, ui, audio, demo map | draw a road, zone, one building grows, one vehicle drives, day passes | overview, street, night skyline, dawn wide, motion | population vs visible agents at overview; growth event log; save/load fixture |
| RTS | terrain, environment, units, buildings, fog of war, pathfinding/formations, combat, economy, AI opponent, selection/command tools, ui, audio, demo map | select units, move, gather, build one structure, fight one skirmish | battlefield wide, unit close-up, night/weather, mass-battle motion | 200+ units at budget; pathing invariants (no stuck units in 600 frames); command latency log |
| Third-person action / roguelike | level/environment, character (rig, locomotion, animation), camera, combat, enemies/AI, abilities/effects, loot/progression, level generation, ui, audio, demo run | move, dodge, hit, kill, pick up, die, restart | over-shoulder, arena wide, boss close-up, combat motion | animation blend log (no pops); hit-reaction timing; a full run recorded as state log |
| First-person shooter | level, weapons (models, animation, feel), enemies/AI, movement, damage/health, effects (muzzle, impacts, decals), lighting/baked vs realtime decision, ui/HUD, audio, demo level | walk, aim, shoot, hit, take damage, reload | corridor, vista, muzzle-flash close-up, firefight motion | input-to-effect latency; decal and shell counts under budget |
| Racing / driving | track/environment, vehicle physics, vehicle visuals, camera, AI drivers, weather/time, effects (tyre, spray), ui/HUD, audio, demo track | drive one lap, collide, finish, see a time | chase cam, cockpit, trackside wide, wet night motion | lap time determinism at fixed seed; physics step log |
| Open world / survival | terrain streaming, environment, foliage, water, character, crafting/inventory, creatures/AI, day/weather cycle, effects, ui, audio, demo region | walk 1 km, gather, craft one item, survive a night | horizon vista, forest close-up, night camp, weather motion | streaming stall log (frame-time spikes); memory over a 5-minute walk |
| Platformer (2D or 2.5D) | levels/tiles, character controller, animation, enemies, hazards, collectibles, parallax background, effects, ui, audio, demo level | run, jump, land, die, respawn, reach the exit | level wide, character close, parallax motion, hazard moment | jump curve log (height/time deterministic); input buffer window measured |
| Puzzle / board / card | board/table scene, pieces/cards visuals, rules engine, animation/transitions, AI opponent, ui, audio, demo match | play a full legal match to a result | table wide, card close, transition motion | rules engine property tests; illegal-move fuzz log |
| Flight / space | terrain or space environment, vehicle model and physics, camera, HUD, weather/atmosphere, AI, effects, audio, demo mission | take off, fly a waypoint, land or dock | cockpit, external chase, high-altitude vista, motion | altitude/attitude determinism; HUD readability at all lighting |

Genres not in the table follow the derivation steps; the table is a shape,
not a menu.

## What "AAA" means per genre

State it in REFERENCE.md so the rubric has anchors. Examples of the kind of
sentence needed: "for a third-person action game the bar is animation
continuity and hit feedback before material fidelity"; "for a city builder
the bar is density, variety and atmosphere at the overview before anything
at street level"; "for a racing game the bar is motion: wheel contact,
suspension, camera lag, blur". The critic weights its tells accordingly.

## Stack

Three.js + Vite is the default for 3D in the browser because the harness
(headless capture, HMR, URL-selectable scenarios) is cheapest there. A 2D
game may use a canvas or Pixi-class renderer; a project that must ship to
a desktop store may need a native engine. The choice is recorded once in
`docs/DECISIONS.md` with the reason; the loop, the roles and the evidence
rules do not change with the stack, only the capture tool's driver does.
