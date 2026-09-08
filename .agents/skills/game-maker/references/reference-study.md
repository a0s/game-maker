# Reference study

Done once by the integrator at wave 0, before ARCHITECTURE.md, and read by
every builder and the critic. The output is `docs/REFERENCE.md`: what the
game must look, move and feel like, stated as observable targets that a
capture can be checked against. Without it "AAA" is a mood; with it, it is
a list.

## Inputs, in order of value

1. **Images** the user placed in `docs/reference/` (screenshots, concept
   art, photos). Open every one with the image tool.
2. **Video** (a file or a link). Watch or sample frames; note motion.
3. **Named titles** ("like Hades", "Cities: Skylines II-class"). Use what
   you know about the title's look and say in REFERENCE.md that the
   targets come from knowledge, not from images in the project.
4. **A prose description** only. Derive the closest well-known title or
   two, state the assumption, and proceed.

Never fabricate an image comparison. If the project holds no images, every
later critic report says "basis: rubric, no reference images".

## What to extract from each image

Write one line per item; group by image id.

- **Camera**: angle to ground, distance, field of view, what is in the
  foreground, how much sky. Whether the game is fixed-camera, orbit, first
  or third person, side-on, top-down.
- **Scale cues**: a human, a door, a car, a tree; how many pixels they
  occupy at the reference zoom. This becomes the unit scale check.
- **Value range and palette**: darkest and brightest regions, dominant
  hues, saturation level, how colour shifts with distance.
- **Materials**: the families present (asphalt, worn concrete, painted
  metal, foliage, skin, cloth, water) and what makes each read as real:
  wear, roughness variation, edge damage, decals.
- **Light**: time of day, sun elevation, shadow softness and length,
  bounce and ambient colour, emissives at night, fog or haze, bloom, lens
  effects.
- **Density and variety**: how many distinct building/character/prop
  models are visible, how they are rotated and spaced, how full the
  streets, the sky, the ground are.
- **UI**: HUD placement, typography, panel style, how much of the frame it
  takes, whether it is diegetic.
- **Motion** (video only): speed of the camera, character animation
  cadence, vehicle behaviour, weather and particle motion, transition
  timings.
- **Signature**: the one or two things that make this look this game and
  not another (the god rays, the isometric shear, the outline pass, the
  wet asphalt).

## What to write into docs/REFERENCE.md

```
# Reference: <working title>
basis: images (12 in docs/reference/) | video | title knowledge | prose only
genre: <one line>
closest titles: <names>

## Look targets (checkable)
camera:    <e.g. 35-55° down, orbit, FOV 45, foreground element at street level>
scale:     <e.g. a door is 2.1 m and ~40 px at the "street" preset>
value:     <e.g. noon: deep shadows at 10% grey, no clipped whites except sun glints>
materials: <families + what makes them read>
light:     <sun model, shadow softness, night = dark city with pools of light>
density:   <≥ 8 distinct building models visible at overview; props never on a grid>
ui:        <HUD bottom-left, 2 fonts, translucent dark panels, no drop shadows>
motion:    <...>
signature: <...>

## Per-preset targets
overview:  <what a passing capture shows>
close-up:  <...>
night:     <...>
motion:    <...>

## Genre tells (things that scream "not this game")
- <derived from the images; the critic adds these to the generic tells>
```

The **per-preset targets** become the rubric anchors for 8.5 and 10. The
**genre tells** are appended to the critic's checklist. Both are quoted in
critic reports by line, so feedback traces back to a reference.

## For 2D and stylised games

The same study applies; the items change name. Pixel density and integer
scaling, outline weight, palette size, animation frame counts, parallax
layer count, tile seam visibility, and whether mixed resolutions ("mixels")
are acceptable. If a dedicated pixel-art or 2D-art skill is available in
the environment, delegate sprite production to it and keep this skill for
the loop, the harness and the critic.
