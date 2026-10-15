# Episode 0, test frames round 2: director's review

Frames: `_social/videos/rex/adventures/review2/ep0-<t>-bw.jpg` / `-color.jpg`, plus the contact sheets `ep0-r2-color.jpg` and `ep0-r2-bw.jpg`.
Shot numbers refer to `ep0_ep1_shotlist.md`. Round-1 notes: `review_ep0_round1.md`.

**Overall:** a big step up. Rex now looks like *our* Rex: a big round head, huge shiny eyes, a chubby body and the shell hat. The beetle shot is lovely. The domino chain finally reads as a chain: the rock on the ledge, the pebble heap, the pebbles in the nest, the egg, the big leaf. The pencil engine (broken lines, varied hatching, white rims) gives the frames a hand-made feel.

**Score:** 10 approved, 11 need changes. The remaining problems are mostly **position bugs and small drawing fixes**, not design problems.

**Verdict: NOT YET READY TO RENDER.** Four blockers have to be fixed first (see the end).

---

## Per-frame notes

### 5 s · S01 narration 1: APPROVED
The pencil-line reveal of the mountains with the wash behind it works, and the Telugu shapes correctly. The empty paper below the mountains is fine at 5 s because the drawing is still being built.

### 20 s · S03 narration 3: CHANGES NEEDED (small)
- Good: the ground now spans the full width, and the palms are on the cliff.
- **The waterfall is still a capsule:** a blue pill with a rounded bottom and a white bar at its foot. Make it:
  - square-topped at the cliff notch, slightly wider at the bottom;
  - the bottom end hidden behind 3–4 overlapping white foam puffs (circles of different sizes, slowly pulsing), not a bar;
  - 4–6 thin white streaks scrolling down inside it.
  In B&W, darken the cliff hatching right next to the water so the white reads.

### 34 s · S05 title card: CHANGES NEEDED (blocker)
- Good: the planks, wood grain, knot, sprig and blurred background all work. This is the right look.
- **The Telugu is still broken on the subtitle plank.** "రెక్స్" shows the స-vattu detached after క్ (it reads like "రెక్ స"), and the ట్ట in "పుట్టాడు" also looks wrong. Drawing it "plainly" in Canvas2D still goes through a font path that does not shape Telugu.
- **The fix:** pre-render the line "రెక్స్ పుట్టాడు!" as a transparent PNG with headless Edge (the same way `make_kit.py` and the narration strips do; those render correctly) and `drawImage` it onto the plank. Do the same for every Telugu string drawn on a plank in both episodes.
- Before re-sending, check these words visually: రెక్స్, పుట్టాడు, క్రితం, మెరిసే.

### 44 s · S06 breeze: CHANGES NEEDED (small)
- Good: the branch now tapers.
- **The leaf is still detached and falling at 44 s.** It must hang from the branch tip on a short stem and only flutter (±8°) until it snaps at 49.0.
- The wind-lines are hard to see. Make 3–4 curly S-strokes, 2.5 px, mid-grey (COL: mint at 70 %), crossing the frame left → right.

### 57 s · S08 leaf landing: APPROVED
The heart leaf is big and readable, it is seated on the rock, the tiny pivot pebble is visible and the pebble heap waits on the right. Exactly the picture we need.

### 63 s · S09 rock tipping: APPROVED
The close-up works and the tilt on the pivot pebble reads. Make sure that by 64–65 s the leaf visibly slides off the far side (the innocent "steps off" gag).

### 70 s · S10 pile hit: CHANGES NEEDED
- Good: the rock is on the ledge, the leaf lies flat on the left, and the white rim is nice.
- **Timing:** the pebbles are already sitting in the nest at 70 s. They should only just be leaving the heap here (letting go 68.0–69.5, bouncing down the slope 70–72), and reach the nest at 74.0. Delay the pebble release so it follows the rock's contact.
- **The rock has a pointed bottom.** Its outline comes down to a teardrop point, so it balances on a tip. Flatten the bottom 15 % so it has a resting face.
- **Remove the curved line in the middle of the rock.** It reads as a sad face or frown, which would be a confusing extra character. Use crack marks off-centre instead.
- **The ledge → slope join is a hairpin:** a thin tongue sticks out over the slope like a folded paper edge (also at 76, 83 and 153). Replace it with one rounded convex edge: the ledge top curves over and down into the slope.

### 76 s · S11 pebbles hit the nest: CHANGES NEEDED
- Good: the pebbles scattered, one sits in an empty shell, and 2 roll on past.
- **The nest is a flat tilted mat again**, and the egg stands on top of it, bigger than the whole nest is deep. Draw the bowl as you described it: the back rim behind the eggs, the front rim in front, and the bowl about 2× egg width. Sink the egg's lower third behind the front rim.
- The 2 empty half-shells should sit *in* the bowl, not perched on its edge.

### 83 s · S12 nest slides: APPROVED (minor)
The slide reads, and the leaf waits at the foot of the slope. Minor: fix the hairpin ledge edge (see 70 s).

### 91 s · S13 egg rolls: CHANGES NEEDED (blocker)
- **The egg is underground.** It is drawn about 200 px *below* the ground line, and its contact shadow floats above it at ground level. This is a y-offset bug in the low-angle dolly camera. Most likely the egg ignores the camera's vertical shift that the ground layer uses, or uses the wrong parallax factor; the egg must be on the L3 layer, the same as the ground it rolls on. Clamp egg bottom = ground y at its x.
- **The egg is lumpy** (potato outline with bumps). Use a clean ellipse path (`ctx.ellipse`, ry = 1.3 × rx) with the pencil jitter at ±1 px only, not a noisy outline. This applies to 100, 106 and 114 too.
- The white diagonal highlight across the egg reads as a band or tape. Replace it with a small soft white oval highlight on the upper sun side.

### 100 s · S14 hush: CHANGES NEEDED (small)
- Good: the soft sunbeam is now right, and the egg is large in frame.
- **The egg doesn't touch the leaf:** the stem is about 250 px to the right. The egg should rest against the leaf. Either move the egg's stop point right until its side touches the stem or the lower blade, or bend the lower blade down to touch the egg. The blade should show a small dent where they touch.
- Same lumpy outline and highlight band as at 91 s.

### 106 s · S15 crack: CHANGES NEEDED (small)
- **The crack is a single V tick.** It should be a jagged zigzag *across* the top third of the egg: 5–7 sharp segments, about 60 % of the egg width, 3 px dark. Add a chip gap and 2 flying chips on crack #2.
- Egg shape as at 91 s.

### 114 s · S16 peeking: CHANGES NEEDED (blocker)
- **The peek still reads as a mask or goggles.** The dark band around the eyes and the green ellipse look like a bandit mask on a potato. Draw it as a real gap:
  - the top shell lifted as a lid (its zigzag edge is the lid's bottom),
  - then a narrow gap of soft shadow, getting darker toward the inside,
  - with the eyes and the top of Rex's green head inside the gap,
  - and the lower shell's zigzag edge below them.
  Remove the solid dark band below the eyes.
- **The lid is still see-through:** the leaf shows through the shell top. Set the lid fill to opaque.
- **The crack line runs outside the egg** on the left (x≈640–760). Clip it to the egg path.
- **The brows slope down toward the middle, which reads as angry.** For peeking they should be raised and arched, or leave them out (the brows are hidden in the shell anyway).

### 120 s · S17 pop: CHANGES NEEDED (blocker)
- Good: the design is a big improvement. Wide-eyed with a small "o" mouth is exactly right.
- **Rex is floating.** His feet are about 150 px above the ground line, standing in the air in front of the green hill, while his own shell sits on the ground. He must sit *in* the bottom half-shell at this moment (S17: "Rex sits up in the bottom half of the shell"), or at least stand on the ground line next to it.
  - Check the same y-anchor in every Rex shot. It is right at 131–145, so the bug is probably in the pop or jump arc not ending on the ground.
- His tail reaches into the leaf. Shorten the tail pose here or move him 100 px left.

### 131 s · S18 sneeze: APPROVED
The squeezed eyes (> <), the hat, the clean silhouette away from the stem and the pollen are all good. Minor:
- The red "o" mouth (also at 120 and 145) can read as a tongue sticking out. Make it a darker inside (deep red-brown) with a small lighter tongue at the bottom.
- Lift the camera 40 px so the toes are not cut by the frame edge.

### 138 s · S19 tail: APPROVED (minor)
The laughing face is charming. Minor:
- **Teeth:** a row of 5 sharp teeth is a little fierce for 3-year-olds. Use 2 small rounded teeth on top, none on the bottom.
- Make sure the left/right flip chase is happening around this time. This frame is the giggle, which is fine.

### 145 s · S20 beetle: APPROVED
The best shot of the episode: the beetle on the leaf edge, Rex's curious eyes locked on it, the hat and the readable silhouettes. Do not change it (apart from the mouth note at 131).

### 153 s · S21 POV: APPROVED (minor)
The continuity is right now: the rock on the ledge, the scattered pebbles and the nest on the slope. Minor: fix the hairpin ledge edge, and start the cloud moving toward the sun here.

### 163 s · S22 cold wind: CHANGES NEEDED
- Good: the cold grade, the wind-lines, the leaves blowing, the nest and pebbles in continuity, and the hat.
- **Expression:** his mouth still has a smile curve. For sad, turn the mouth corners down (a small "∩" curve) and raise the inner brows (the "/ \" shape). The eyes looking down are good. Add the shiver (jitter) and arms tucked in.
- **The cold cross-hatch covers the whole frame like a fly-screen,** including the sky and paper. Limit it:
  - only on the shadow areas: cliff, under the leaf, the ground at the bottom;
  - 25 % opacity;
  - never on Rex or the sky.
  Keep the sky a flat cool wash.
- **The cliff on the right has lost its waterfall** (it was there in round 1 at this angle). Keep it in for continuity: grey, smaller, with mist.

### 170 s · S23 cry: CHANGES NEEDED (blocker)
- Good: the tears and the glossy eyes, the brows, the cold colour and the blowing leaves are right. It is gentle.
- **The mouth is a smile.** This kills the emotional beat of the whole episode. Use the planned soft wail:
  - mouth open in a rounded shape, wider at the bottom, with a dark inside,
  - head tipped back 5–8°, eyes half-squeezed during the cry (170–172),
  - then back to the sad "∩" between sobs.
- Same fly-screen hatch issue as at 163 (it is visible over his face here).
- Add the planned 8° curl of the leaf toward him (the "hug").

### 178 s · S24 end card: APPROVED
The cards are up, the tiny Rex is visible under them and the Telugu is correct.

---

## Fix list

**Blockers (must fix before render):**
1. **Egg underground at 91 s:** fix its layer/parallax so it sits on the ground it rolls on. Also clean up the egg shape everywhere: a smooth ellipse, a small oval highlight, no band.
2. **Rex floating at 120 s:** he must sit in his bottom shell or stand on the ground line. Check the y-anchor at the end of every jump or pop.
3. **The emotional faces:** a sad "∩" mouth at 163, the soft wail at 170, the peek at 114 drawn as a real lid and gap (no mask, opaque lid, crack clipped, no angry brows).
4. **Telugu on the title plank:** pre-render it as PNG via headless Edge, then check రెక్స్ and పుట్టాడు visually.

**Should fix (same round, all small):**
5. **Chain timing and props:**
   - pebbles leave the heap only after the rock hits it (in the nest at 74, not 70);
   - the nest is a real bowl with the egg inside;
   - the egg rests touching the leaf at 100;
   - the leaf stays on the branch until 49 s;
   - the crack is a real zigzag at 106.
6. **Small drawing fixes:**
   - rock: flat bottom, no "frown" line;
   - the ledge edge rounded (no hairpin);
   - the waterfall without the pill shape;
   - the cold hatch only in shadows;
   - softer teeth and a darker "o" mouth.

## B&W or colour (re-judged)

**Colour is still more attractive, and the gap has narrowed.**
- **Colour:** the green Rex and leaf against the warm paper and tan ground is cheerful and very clear. The blue beetle pops, and the grey-blue drain at 163–178 lands the mood. Children will respond to this version first.
- **B&W** is now much better than round 1. The darker outlines, white rims and cross-hatched rock look like a real pencil storybook, close to the owner's reference. But in the egg shots (100–114) the grey radial gradients look muddy, and the sky and ground are still almost the same light grey. To compete it needs:
  - the egg as the whitest shape in frame (no grey gradient on it),
  - a slightly darker ground tone than the sky,
  - and the same "cold hatch only in shadows" rule.

**Recommendation:** make colour the main YouTube version and keep B&W as a "storybook edition" for the owner to compare. Re-judge after round 3.

## Render readiness

**NOT READY TO RENDER.** Fix blockers 1–4 (and ideally 5–6), then send only the changed frames: 20, 34, 44, 70, 76, 91, 100, 106, 114, 120, 163, 170. Add 2 extra frames, at 68.5 s (rock contact) and 172 s (mid-wail). If those pass, I expect to approve "READY TO RENDER" in round 3 without a full re-review.
