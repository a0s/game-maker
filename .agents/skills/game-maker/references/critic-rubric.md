# Critic rubric

The critic is an art director who writes no code. It takes its own captures,
scores, and hands the builder a ranked list. It never inflates, never
softens, and never gives feedback it cannot point at in a capture and tie
to a line of `docs/REFERENCE.md`.

## Reference basis

- If `docs/reference/` contains user-supplied images, score against them
  and `docs/REFERENCE.md`; cite the image file and the REFERENCE line for
  each comparison.
- If REFERENCE.md was written from title knowledge or prose only, score
  against its targets and the generic qualities below, and state in the
  report that no image comparison was made. Never describe a comparison
  that did not happen.

## Scale

| Score | Anchor |
|-------|--------|
| 10 | Indistinguishable from the reference basis at the given preset |
| 8.5 | AAA with nits: a professional would ship it after one polish pass |
| 7 | Good indie: coherent, intentional, clearly below the reference |
| 5 | Programmer art: correct, ugly, no intent |
| 3 | Broken: missing assets, wrong scale, black or blown-out frames, popping |

Half points are allowed. The score is the lowest of the capture set, not the
average; a module that looks good at the wide preset and broken at the
hardest lighting condition is broken. The genre's "what AAA means" line in
REFERENCE.md decides which tells weigh most (animation continuity for an
action game, density and atmosphere for a builder, motion for a racer).

## Gates besides the score

- Uncaught exceptions: 0. Unhandled rejections: 0. Rendering context loss:
  none.
- Warnings: counted and listed; not gating.
- API contract: every function and event in `ARCHITECTURE.md` exists and
  the showcase preset loads via the URL query.
- Budget: within the module's draw-call, entity and memory allowance in the
  showcase; the full budget is checked at the demo gate on a real GPU.
- Behaviour modules: the state-based acceptance tests for the module's
  verbs pass in the harness log.

## Procedure

1. Read `docs/REFERENCE.md`, `docs/STATUS.json` and the previous round's
   captures for this module. Re-score two of them without looking at the
   old score, then compare. If the new score differs by more than 0.5,
   write the reason; this keeps the scale stable across rounds.
2. Take fresh captures at the shared presets: at least one wide, one
   close, one at the hardest lighting condition the game has (night, storm,
   interior), one unfrozen if the module has motion. Use the same seeds as
   last round.
3. Open each capture and describe it before scoring.
4. Run the generic tells below and the genre tells from REFERENCE.md on the
   close and the hardest-lighting capture.
5. Score. Write the report.

## Report format

```
module: <name>   round: 3   score: 7.5   gate: FAIL (score)
basis: images (docs/reference/ref-04.png, ref-09.png) | rubric only
captures: r3-wide-1200, r3-close-1200, r3-night-2200, r3-motion-1800
calibration: r2-close-1200 re-scored 7.0 (was 7.0)

issues (ranked by expected score gain):
1. [r3-night-2200, ground plane centre, high, REFERENCE.light L4]
   Surface is one flat albedo with uniform roughness; the light pool is a
   hard-edged disc.
   +1 looks like: wear where things touch it, roughness variation breaking
   the specular, soft falloff on the pool as in ref-09.
2. [r3-close-1200, edge where two surfaces meet, medium, REFERENCE.materials M2]
   Unshaded step; no contact shadow in the crease.
   +1 looks like: AO in the crease, a chamfer catching the key light.
...
what is already at bar: <so the builder does not regress it>
```

Each issue names a capture, a region, a severity, the REFERENCE line, and
what +1 looks like. No adjectives without a capture.

## Generic tells (reference for the critic's eye, not rules for the builder)

Materials: uniform roughness across a whole surface; no albedo variation
across a tiled texture; visible tiling repeat; saturated primaries; no
wear where things are touched, walked, driven or rained on; metal with
nothing to reflect; glass as a flat tinted plane; skin or cloth with the
same response as plastic.

Light: hard-edged shadows at every distance; no contact shadow or AO in
creases; sky colour that does not tint the ground; key light straight
down; no aerial perspective on distant forms; night that is a darkened day
instead of darkness with pools of light; emissives without bloom, or bloom
on everything; interiors lit like exteriors.

Scale and layout: doors, windows, steps, vehicles, weapons off from human
scale; objects on a perfect grid with identical rotation; props placed
uniformly; vegetation all one size; surfaces meeting terrain or floors
with a visible step or gap.

Repetition and life: the same two or three models everywhere with no
variation; identical rotation and spacing; a world that is empty where the
counters say it is populated; objects interpenetrating (a wheel through a
kerb, a character through a wall, a canopy through a roof).

Motion: snapping between waypoints or animation states; identical speeds
for every agent; no anticipation or follow-through; no braking, no
weight, no camera lag; everything switching state on the same frame;
particles that ignore wind and light.

Composition: the preset shows a seam between modules; horizon at frame
centre; nothing in the foreground at the close preset; the subject
unlit or backlit by accident.

UI: panels that read as a web page (rounded cards, drop shadows, system
font) instead of the genre's HUD language; text competing with the world
for attention; no hover, placement or hit feedback; UI that does not
scale with the viewport.

2D and stylised: mixed pixel densities; outlines of inconsistent weight;
non-integer scaling; tile seams; parallax layers moving at one speed;
animation with too few frames for the movement speed; a palette larger or
smaller than the reference without intent.

Genre tells from `docs/REFERENCE.md` are appended to this list for the
project and take precedence when they conflict.

## Ceiling

If a module's score has not risen for two consecutive rounds, the critic
marks it `ceiling`, writes the blocking reason (an engine limit, an asset
gap, a core API gap awaiting the integrator, a reference target that the
stack cannot reach), and the orchestrator moves on. A ceiling is not a
pass; it is an honest plateau that the final report lists.
