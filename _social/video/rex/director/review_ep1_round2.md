# Episode 1 "The Twinkling Rain", test frames round 2: director's review

Frames: `_social/videos/rex/adventures/review_ep1b/`, plus the contact sheet `ep1-r2-color.jpg`. I checked full-size colour frames at 76, 145, 152, 163, 186, 188 and 218.

## Verdict: **NOT READY TO RENDER**

The first half is now ready: the glowing drops finally glow, the rain is visible, and Rex stays in frame. The end card is fixed too.

But several of the flood-half fixes from your list **do not appear in the frames**, and two frames have **lost Rex completely**. Before anything else, please check that the review frames were rendered from the latest code:

- **145 and 152 are identical to round 1.** There is no new water, and the wave is still a hill of earth.
- **The sun is fully out at 163, 186 and 188**, although your note says it stays hidden until 197.

---

## Per-frame

| t | Verdict | Notes |
|---|---|---|
| 28 | APPROVED | The glowing drop now glows. |
| 55 | APPROVED | Rex in frame, twinkling shower visible. |
| 76 | CHANGES NEEDED (small) | The face is there now, but the reflection is the **whole body lying sideways** across the puddle, so it reads as a second Rex lying in the water. Reflect **only his head and neck**, flipped vertically (not rotated), directly below his real head, at 60 % opacity with a gentle horizontal ripple, and clip it to the puddle shape. |
| 106 | APPROVED | Rain visible, light drops. |
| 125 | APPROVED | Darker, heavier rain, streams on the cliff. |
| 135 | APPROVED (minor) | Make sure the water at his feet uses the new river look (flow lines, foam), not the plain brown band. |
| 145 | CHANGES NEEDED | **Unchanged from round 1:** the tan hump still reads as earth. Give it the river treatment: a lighter ochre gradient, a white foam crest, flow lines and movement. Rex should look **wide-eyed** at the wave, not smile. |
| 150 / 152 | CHANGES NEEDED (blocker) | **Unchanged:** the raft lies on the green grass, and the brown flood has no water cues. The faint big shape inside the water (the slope and shell showing through) is still visible. Make the flood layer opaque below its foam line. The water must lift the raft off the grass at 150.5–152. |
| 158 | CHANGES NEEDED (blocker) | **Rex is missing.** The frame shows only the bank and palms. S18 starts here: Rex on the raft, centred, tracking. |
| 163 | CHANGES NEEDED | The water now reads as water. Good. But: <br>(1) The raft sits *on* the foam line at the bank edge, with its top above the water and Rex at grass level. Put the raft fully in the river, its centre about 120 px below the foam line, with the front water lip drawn over its lower 15 %. <br>(2) The sun is out (it should be at 197). <br>(3) The foreground bushes stand in the river (also at 186, 188 and 218). Move them onto a near-bank strip at the bottom, or remove them from the river-world shots. |
| 175 | CHANGES NEEDED | Raft placement as at 163. The raft should circle the rock *in* the water. |
| 184 / 186 | CHANGES NEEDED (blocker) | Rex and the beetle are standing on the **grass bank**, and the raft is on the bank too, far from the step. The hat-float gag works, but in the wrong place. The step must be *in front of the raft's path*: the raft (with Rex and the beetle 10 px above it) glides over the ledge between 184 and 188. The sun is out again. |
| 188 | CHANGES NEEDED (blocker) | **Rex, the beetle and the raft are all missing.** At 188 the raft lands below the step with a "sploosh" and they drop back onto it. |
| 200 | APPROVED | Rex and the beetle on the raft, in the water, with the sun out. Correct here. |
| 218 | CHANGES NEEDED (small) | The mist wall and rainbow are lovely and the brightness is right. But: <br>(1) The raft is on the bank line, half in the mist, and very small. Put it in the river and make it 2× bigger. <br>(2) Remove the 3 bushes standing in the water. |
| 226 | APPROVED | Knots are off the letters and the footer is there. |

---

## What to fix (in priority order)

1. **Re-render the review frames from the current build.** 145, 152 and the sun look like the round-1 code.
2. **One rule for the raft, applied in every river shot (150–218):**
   - `raft.y = waterSurfaceY(raft.x) + 0.12 * raftHeight + bob`
   - Draw order: water back → raft → Rex/beetle → water front lip (a band 15 % of the raft height, translucent).
   - Rex's feet and the beetle are attached to the raft's top surface.
   - The raft is never above the foam line.
3. **Never lose the hero.** Rex, the raft and the beetle must be in frame at 158 and 188. Check the camera/track keyframes for S18 and S20; the camera probably tracks a target that isn't set yet.
4. **S20 step:** place the ledge *on the raft's path*. The raft approaches at 181–184, glides down at 184–188 in slow motion with Rex, the beetle and the hat floating above it, and lands at 188 below the step.
5. **Weather:** clouds over the sun until 197 in every river shot.
6. **Small fixes:**
   - remove the bushes from the river;
   - the head-only reflection at 76;
   - the wave (145) and the flood (152) in the new water style.

## B&W or colour
**Unchanged: colour.** I didn't re-judge B&W in detail this round, because the river isn't working in either version yet.

## Next round
Send frames at 76, 145, 150, 152, 158, 163, 175, 184, 186, 188 and 218. If the raft rule and the missing-Rex bugs are fixed, I expect **READY TO RENDER** next round.
