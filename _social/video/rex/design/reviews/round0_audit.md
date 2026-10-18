# Round 0 audit: the current Rex (before the design project)

Reviewer: design expert. Date: 2026-10-18. Rubric: Skill 5.
Code reviewed: `sketch/rex_puppet.js` (A.rex), the palette in `sketch/art.js` (`PAL`), `A.line`, `A.shape`, `A.hatch` and `A.shell`.

## Files opened (full size, faces zoomed)
- `frames/round0/sheet-0.0-color.jpg`: six expressions (content smile, "o" surprise, laugh, sad, wail with tears, sleepy with hat), zoomed 2x on each.
- `frames/round0/sheet-0.0-bw.jpg`: the same row in B&W.
- `frames/round0/ep0-122.0-color.jpg`: in the eggshell, "o" mouth, looking up at a big leaf.
- `frames/round0/ep0-135.0-color.jpg`: out of the shell, worried "o".
- `frames/round0/ep0-160.0-color.jpg`: wide shot, sad, windy grey scene.
- `frames/round0/ep0-172.0-color.jpg`: close-up, sad with tears, wind and leaves.
- `frames/round0/ep1-30.0-color.jpg`: tears with "o" mouth, a glowing drop on the leaf.
- `frames/round0/ep1-55.0-color.jpg`: wide shot, looking up at the sparkles.
- `frames/round0/ep1-76.0-color.jpg`: leaning over a puddle, with a reflection (cropped and zoomed).
- `frames/round0/ep1-145.0-color.jpg`: very wide flood shot, Rex small under the leaf.
- `frames/round0/ep1-186.0-color.jpg`: on the raft, grin (cropped and zoomed 2x).
- `frames/round0/ep1-206.0-color.jpg`: close-up on the raft, smile, beetle on the hat, leaf in mouth.

## Measurements from the code (s = 1, foot point (0,0), y up = negative)
| Item | Now | Comment |
|---|---|---|
| Head top / bottom | -222 / -106 (head 116 tall) | |
| Total height without hat / with hat | 222 (sole at +5) / about 257 | |
| Head % of height | 116 / 222 = **52 %** | Fine, a little over the 40–50 % band. Keep it about 50 %. |
| Head width (back to snout tip) | 62 + 96 = **158** | The snout adds 34; it is too long |
| Near eye | centre (14,-178) world, 40 × 46 | Its centre is **12 units above** the head's vertical middle (-164). The eyes are too high. |
| Near eye width / head width | 40 / 158 = 25 % | At the low end of the 1/4–1/3 band |
| Far eye | 32 × 36, horizontal squash 0.88 | Almost no foreshortening, so the face reads as a flat disc ("mask") |
| Snout: far-eye centre to tip | 54; near eye to tip 100 | The near eye to the tip is 1.7× the eye-to-back distance (58). This is the "gecko" read. |
| Smile length | x 14 → 100 = **86** (61 % of the head width) | A crocodile mouth. It should be about 40 %. |
| Feet | sole bottom at **y = +5**, claw tips at **+8** | The feet sink below the ground line, and the claws stab into the ground |
| Body | centre (0,-78), 112 wide, -136 to -16 | Good chubby pear |
| Tail | base 40 thick, middle 16, tip 12; tip at y -100 (world), close to the shoulder height | Too thin in the middle, and the tip flicks up like a gecko or scorpion |
| Arms | shoulders at (18,-104) and (44,-100), drawn **after the head** | They grow out of the chin |
| Colour: Rex `#8cc77d` | L* 74.8, hue 108° | |
| Colour: jungle `#8fbf7a` | L* 72.6, hue 102° | **The same colour as Rex**, so he melts into the bushes and the big leaf |
| Squash | `scale(1 + 0.6q, 1 - q)` | Volume is lost (area 0.94 at q = 0.1, 0.84 at q = 0.25) |
| Lean | `rotate(lean)` about the foot point | The whole body tips like a statue; the spine doesn't bend |
| Shiver | uses `tearT` | Shivering is tied to the tear timer (a bug) |
| Line | `A.line` splits long closed outlines into 3–4 pieces with a 35 % chance of a gap | Visible holes in Rex's silhouette (tail, back of the head, chin) |

## Scores (1–5)
| Category | Score | Why |
|---|---|---|
| Identity & appeal | **3** | Reads as a cute baby dino, and the eyes, pear body and tiny arms are lovely. But the long snout and long mouth pull toward a gecko or crocodile (ep1-206 close-up), and the arms coming out of the chin look odd. |
| Proportions & on-model | **3** | The head ratio is good. The eyes are too high, the snout too long and the feet below the ground; the spot clusters are random clover blobs, and the hat drifts off the head (ep1-186: hat floats about 40 px above the skull). |
| Turnaround | **1** | Only the ¾ view exists (mirrored). There is no front, side or back view. |
| Expressions | **2** | Six expressions, all readable at a glance (good). But the brows, lids and mouth are not independent controls; there are no lids at all; open mouths are pasted on and stick **outside** the head silhouette (laugh, wail, grin in ep1-186); the "o" mouth is a dark dot on the chin (ep0-122, ep1-30); and the sad mouth line overshoots the snout outline. |
| Poses & silhouette | **2** | One stance for everything. In silhouette the arms merge with the chest and the head; the tail flick is the only gesture. The lean is a rigid rotation (ep1-76). |
| Motion (from code) | **2** | Squash loses volume, there are no follow-through parameters (tail lag, hat spring, arm flop), the step is a plain sine with no contact or passing poses, and the shiver is tied to the tear timer. |
| Nature interaction | **2** | The world has wind lines, rain and floating leaves, but Rex's body doesn't answer them: no squint or lean into the wind, no wet look, no contact shadow; the reflection in ep1-76 starts mid-leg instead of at the waterline. |
| Atmosphere | **2** | Flat layers. Rex's green equals the foliage green; no light direction (hatching always lower-left); no light shafts or dappling; the bushes are generic blobs rather than prehistoric flora (the fern sprigs in ep1-186 are the right idea). |
| Style consistency | **3** | The pencil-storybook look is charming and B&W mostly works (the belly separates). But there are gaps in Rex's outline, the hatching runs across his face and cheeks (the face is darker than the body), and the line weight is the same everywhere. |

**Average: 2.2.** Verdict: `CHANGES NEEDED (9 blockers)`. This is expected for round 0; the Bible fixes all of them.

## Keep (these work)
1. The big, round, shiny eyes with **two highlights** and big pupils (0.6 R): this is the heart of his appeal.
2. The chubby pear body with the cream belly patch, the short thick legs and the tiny arms with white claw nubs.
3. The soft rounded back bumps (5).
4. The eggshell-cap hat: a perfect story landmark (born in Ep 0). Keep its jagged rim and lilac spots.
5. The happy closed eyes (∩), the squeezed eyes (> <) and the tear drops: they read instantly.
6. The pencil line and watercolour wash style; the opaque fills.
7. The `pose` object API (`A.rex(x, y, s, pose)`): extend it, don't replace the idea.

## Blockers (must fix before approval)
| # | What's wrong | Where | Why it matters | Exact change (see REX_BIBLE §2–§6) |
|---|---|---|---|---|
| B1 | Rex's green is the same as the foliage green (ΔL* 2, Δhue 6°) | `PAL.rex` vs `PAL.jungle/leaf/fern`; all ep frames | He disappears into the bushes and leaves; the eye can't find the hero | Rex main `#a3d16e` (L* 79, hue 88°, warm lime). Flora shifts to cool blue-greens with L* ≤ 62 (`#6f9f86` family). Rule: ΔL* ≥ 12 **and** Δhue ≥ 40° between Rex and anything directly behind him. |
| B2 | The snout is too long and the mouth runs 61 % of the head width | head blob `snout*34`; smile x 14→100; ep1-206 | Gecko or crocodile read | Snout tip at head-local x +81 (was +96 from the head centre); smile from x +14 to +66 (52 long, about 37 % of the head width). Use the Bible's 23-point head outline. |
| B3 | Eyes too high (centre 12 above the head middle) and the far eye not foreshortened | `EYES` | Baby schema; "mask" read | Near eye centre HC(-6,+2), rx 22 ry 26; far eye HC(+38,0), rx 15 ry 22, rotated +0.08 rad. |
| B4 | Open mouths are pasted on and break the head silhouette | mouth branch `open/laugh/grin/wail`; sheet #3, #5; ep1-186 | Head volume must stay; the jaw must open *down* | A jaw rig: split the head into the upper head and a jaw; the jaw rotates about the hinge HC(+8,+22) by `open × 0.38 rad`; the mouth interior fills the gap and is clipped inside the combined outline. No mouth pixel may be outside the silhouette. |
| B5 | The face has no lids and the brows aren't independent | `kind` switch | You can't act sleepy, smug, squint, Duchenne or angry | The face kit in Bible §5: brows (lift, tilt, curve, per side), upper lid, lower lid, pupil size, look, highlights, mouth controls, cheek, blush, nostrils, wrinkle. |
| B6 | Only one view | whole puppet | Turnarounds and head turns are impossible | Five views keyed as in Bible §4, with interpolated head turns. |
| B7 | Feet below the ground, claws stabbing down, no contact shadow | foot polygons y +5, claws +8 | "Floating/sinking": weight isn't on the ground | Sole bottom exactly at y = 0, claws are nubs at the toe front with bottom = 0, and a contact shadow ellipse (Bible §3.9). |
| B8 | Holes in the silhouette outline and hatching across the face | `A.line` gaps; `A.shape` band | The silhouette must be closed; the face must be the lightest area | Rex outlines: no gaps (the break chance is 0 for Rex). No hatching inside the face zone; shading only on the side away from the scene key light. |
| B9 | The hat detaches (ep1-186) and the spots are random clusters | `shellHat` + `hatDx/hatDy`; `rs()` spots | Off-model drift | The hat is parented to the head with 8 units of overlap and a spring wobble of max ±0.15 rad and ±3 units; never offset beyond that. Spots at the fixed coordinates in Bible §2.3. |

## Polish (after the blockers)
- P1. Arms: re-parent to the body, shoulders below the chin (Bible §2.6), two segments, ≥ 6 units of negative space from the body in key poses.
- P2. Tail: thicker middle (30), tip curls up only gently, and the tip is never higher than the shoulder line in neutral.
- P3. The belly plate lines should bow downward (they wrap the form) and be 3, not 4.
- P4. Squash must keep volume (`sx = 1/sy`), with the head squashing only 40 % as much.
- P5. Lean = spine bend (the body rotates about the hip, the head counter-rotates 50 %), feet planted.
- P6. Line weight: silhouette 3.0, shadow-side silhouette 3.6, interior 1.6, face 2.4–3.0, clamped to 1.6–6 px on screen.
- P7. Highlights must stay fixed to the scene light when Rex is flipped (they currently mirror).
- P8. The shiver gets its own timer (`shiverT`), not `tearT`.
- P9. Tears start at the lower lid and run down the cheek surface; they never cross the mouth.
- P10. The puddle reflection should mirror at the waterline (contact line), not mid-body.

## What I could not judge
Motion is judged from code only (no clips in round 0). Round 4 (motion strips) will be scored from frame strips.
