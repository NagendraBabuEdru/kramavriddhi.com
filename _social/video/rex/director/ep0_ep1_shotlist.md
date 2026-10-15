# Rex Adventures: Episode 0 and Episode 1
## Director's treatment and shot lists

Format: 1920×1080, 30 fps. Two renders of every shot: **B&W** (graphite on cream paper) and **COL** (coloured pencil, soft watercolour washes over the same lines).
Reference: the owner's "REX ADVENTURES Episode 0" pencil sketch (chubby baby T-Rex, huge round shiny eyes, spotted back, tiny arms, wooden-plank title sign, valley with cliffs, waterfall, palms, round boulders).

---

## 0. Production conventions (read once, applies to every shot)

**Timing.** All times are seconds from the start of the episode. Shots are contiguous. "→" means "animates to". Frame = 1/30 s.

**Easing words used below.**
- `ease-in-out` = sine in-out (default for camera).
- `ease-out` = fast start, soft stop (things landing, heads turning).
- `ease-in` = slow start, fast finish (things starting to fall).
- `settle` = overshoot about 15 % then damped wobble, 2 to 3 swings, decaying over the stated time.
- `slow-mo xN` = playback at 1/N speed for the stated window; ramp in and out over 6 frames, never a hard cut in speed.
- `hold` = no motion except breathing / particles.

**Camera.** Virtual 2D camera over layered parallax planes: L0 sky/clouds (0.1), L1 far mountains + waterfall (0.25), L2 cliffs + palms (0.5), L3 mid ground: rocks, nest slope (1.0), L4 foreground ferns (1.4, soft 2 px blur). Every move lists start framing → end framing. Add a 0.3 px "hand-held paper" drift (Perlin, 0.2 Hz) on every shot so nothing is ever perfectly frozen.

**Line boil.** Pencil lines re-jitter every 3 frames (on threes), 0.8 px amplitude. Turn boil to every 2 frames during excited moments (hatching, flood ride) and every 4 frames during sad moments.

**Rex puppet poses (only these).** sleeping, peeking, wide-eyed, curious tilt, sniff, sad, crying, giggling, laughing, playful hop, startled, floating. Puppet parts: head (jaw separate), 2 eyes with separate pupils + 2 highlight dots, eyelids, body, belly, tiny arms ×2, legs ×2, tail (4 segments, follows with 2-frame lag per segment), shell-hat piece (from Ep0 S17 onward, glued to head with 1-segment lag). Breathing: body scale 1.00 ↔ 1.02, 2.4 s cycle, always on. Blink every 3 to 5 s (random), 5 frames.
Eye highlights are Rex's soul: keep both white highlight dots visible in every close-up, and add a 3rd tiny dot when he is delighted.

**Sound.** No voices, no dialogue. Rex sounds only: squeak, sniff, tiny sneeze, hiccup-sob, giggle, laugh, yawn. Music: small acoustic palette that suits Telugu families: bansuri (bamboo flute), veena or santoor plucks, soft tabla/mridangam taps, kalimba, light strings pad, wind chimes. Volume given as dB relative to full mix (0 dB = loudest moment of the episode).

**On-screen text.** Telugu first (larger, Noto Sans Telugu / Mandali, rendered via headless Edge like `make_kit.py` so conjuncts shape correctly), English below (smaller). Hand-lettered look: dark graphite text on a torn-paper strip or the wooden-plank sign. Fade in 0.6 s, out 0.6 s. Minimum 5 s per two-line card (parents read aloud to children).

**Safety / tone.** No danger faces, no injuries, nothing falls *on* Rex, the egg is never hit hard. Crying is soft and short. The flood is bright, bouncy and fun. Rex's mother is never shown and never implied to be hurt: she is simply "not here" (story room for later).

---

## 1. Colour / light plan

| Moment | B&W pencil | Coloured pencil |
|---|---|---|
| Ep0 opening (dawn) | Paper-white sky, very light hatching; sun = eraser-white circle with soft smudge halo | Pale peach sky, butter-yellow sun, mint and sage greens, warm sand rocks |
| Ep0 domino chain (morning) | Clear mid-greys; strong white rim on the leaf and the rolling egg so the eye follows them | Golden-green, leaf in bright lime so it pops against grey-blue rocks; egg cream with lilac speckles |
| Ep0 hatching | Vignette darkens edges 15 %, egg stays brightest object | Warm honey light on the egg, a faint sunbeam (yellow, 20 % opacity) |
| Ep0 play beats | Full light, lightest hatching of the episode | Warmest point: honey + leaf green; Rex soft olive-green with darker moss spots, cream belly |
| Ep0 searching → cry | Cross-hatch density +40 % over 12 s, sky greys, sun covered | Colour desaturates 60 %, shifts to blue-grey; cool lavender shadows; Rex stays slightly warmer than the background so he never vanishes |
| Ep1 opening | Same grey as Ep0 end | Same blue-grey as Ep0 end |
| Ep1 glowing rain | Drops = eraser-white with a soft white bloom and 4-point twinkle; background stays grey so the glow reads | Drops pale gold with cyan edge; little warm bounce light on Rex's face when a drop is near |
| Ep1 play | Grey lifts 20 %, more white paper showing | Blue-grey warms toward soft teal + green |
| Ep1 big rain | Diagonal rain strokes over everything, darker hatching, but Rex kept in a clear light patch | Slate blue, deep greens; rain strokes white-blue |
| Ep1 flood ride | Water = flowing curved pencil lines + white foam scribbles; leaf raft drawn with the boldest outline in frame | Water warm tan/ochre (muddy but friendly), leaves bright green, foam white; NO dark brown/black water |
| Ep1 waterfall mist (end) | Big white glowing mist, lines fade into paper | Pearl-white mist with a faint rainbow arc (pastel), sun breaking through |

---

## EPISODE 0: "Rex is Born" (180.0 s, 24 shots)

### Treatment
**Mood.** A quiet storybook morning that turns into a little miracle, then a soft lonely moment.
**Story spine.** Breath of wind → a chain of tiny accidents (a game of dominoes nature plays) → an egg finds a safe stop → crack → a baby discovers the world (hat, sneeze, tail, beetle) → he looks for someone who is not there → cold wind → a small cry.
**Emotional beats.** Wonder (0–36) → curiosity and suspense (36–102) → hush and miracle (102–132) → joy and giggles (132–154) → searching (154–168) → gentle sadness and a hook (168–180).
**Light arc.** Peach dawn → golden morning → warm sunbeam on the egg → warmest at play → cools to blue-grey for the cry.
**Music arc.** Solo bansuri on paper (narration) → santoor + light tabla "tick-tock" motif for the domino chain (every link gets a pluck, rising in pitch, so kids can *hear* the chain) → near-silence for the hatch (only heartbeat-soft drum) → playful kalimba + giggle stings → strings pad thins out, bansuri alone, a falling three-note phrase on the cry → wind only.

### Opening narration (storybook text, no voice)
1. **మనుషులు రాకముందే, చాలా చాలా కాలం క్రితం...**
   *Long, long ago, before there were any people...*
2. **ఈ ప్రపంచం అప్పటికే ఎంతో అందంగా ఉండేది.**
   *the world was already very beautiful.*
3. **పచ్చని అడవి, ఎత్తైన కొండలు, పాటలు పాడే జలపాతం.**
   *Green jungle, tall hills, and a singing waterfall.*
4. **ఇక్కడ ఏం జరుగుతుందో చూద్దామా?**
   *Shall we see what happens here?*

### The domino chain at a glance (readability rule: one link per beat, camera always on the active link)
breeze (S06) → leaf lets go (S07) → leaf drifts, lands on the balanced rock (S08) → rock tips (S09, slow-mo) → rock knocks the pebble pile (S10, slow-mo) → pebbles bounce into the nest (S11, slow-mo) → nest slides and tilts down the slope (S12) → one egg rolls, stops at a big leaf (S13) → hush (S14) → crack, crack (S15) → Rex (S16–S17).
Each link gets a santoor pluck, one step higher in pitch: C, D, E, G, A, high C, high D. The egg stopping gets a soft chime instead.

---

### S01 · 0.0–9.0 · Narration line 1
- **Framing:** Full-frame blank cream paper, extreme wide.
- **Camera:** Static 0–2.0, then very slow push-in 100 % → 104 % (ease-in-out) to 9.0.
- **Action:** 0.0–1.0 paper fades up from black (ease-out). 1.0–6.0 a pencil "draws" the far mountain ridge left to right (stroke reveal, 5 s, linear with 2 small pauses like a real hand). 6.0–9.0 two soft clouds sketch in (1.2 s each, overlapping).
- **Rex:** not visible.
- **SFX:** pencil scratch following the stroke (−18 dB), paper rustle at 0.5.
- **Music:** bansuri solo, slow raga-like phrase in a gentle major mode, enters 1.0 at −20 dB → −14 dB by 9.0.
- **Text:** Line 1 (Telugu above English) fades in at 2.0, holds to 8.4, fades out by 9.0. Placed upper third on torn-paper strip.

### S02 · 9.0–17.0 · Narration line 2
- **Framing:** Extreme wide, same drawing now filling in.
- **Camera:** Continue push-in 104 % → 108 % (linear, joins S01 smoothly: no cut, this is a continuation).
- **Action:** 9.0–13.0 cliffs on left and right sketch in (hatching reveals in diagonal sweeps). 13.0–17.0 the sun appears as an eraser-white circle behind the mountains, rises 40 px (ease-out); COL: first peach wash bleeds in from the sun outward (watercolour spread, 3 s).
- **SFX:** pencil scratch, soft "whoosh" of the wash (COL only, −24 dB).
- **Music:** bansuri continues, a soft strings pad joins at 11.0 (−24 dB).
- **Text:** Line 2 in at 9.6, out at 16.4.

### S03 · 17.0–25.0 · Narration line 3
- **Framing:** Extreme wide → wide.
- **Camera:** Push-in 108 % → 125 % (ease-in-out), drifting slightly right toward the waterfall.
- **Action:** waterfall line-reveal 17.0–19.0 then starts flowing (scrolling white streak texture, 1 loop / 1.5 s). Palms and ferns pop in with tiny scale bounces (0 → 105 % → 100 %, 0.4 s each, staggered 0.15 s), 19.0–22.0. A flock of 3 tiny distant birds (simple "v" marks) crosses 22.0–25.0.
- **SFX:** waterfall rumble fades up (−30 → −22 dB), bird chirps far away at 22.5.
- **Music:** add santoor arpeggio under the flute at 19.0.
- **Text:** Line 3 in at 17.6, out at 24.4.

### S04 · 25.0–31.0 · Narration line 4
- **Framing:** Wide valley, fully drawn and (COL) fully coloured.
- **Camera:** Slow drift down 60 px (ease-in-out), as if leaning in.
- **Action:** a gentle first breeze ripples the ferns (sine sway 3°, travelling left→right as a wave over 2 s).
- **SFX:** soft breeze (−24 dB).
- **Music:** flute holds a long note, resolves at 30.5.
- **Text:** Line 4 in at 25.4, out at 30.4. Slightly bigger font, it is a question to the child.

### S05 · 31.0–37.0 · Title card
- **Framing:** Wide valley, title sign in centre.
- **Camera:** Static.
- **Action:** The wooden-plank sign "REX ADVENTURES" drops in from the top at 31.0 (ease-in, 0.5 s), lands with a settle 0.6 s (bounce 15 %). The small plank "EPISODE 0" swings in below on two ropes at 32.0 (pendulum, settle 1.2 s). Subtitle plank: **"రెక్స్ పుట్టాడు! / Rex is Born!"** slides in at 33.0. A little leaf sprig on the sign's corner (like the reference) flutters. 36.2–37.0 all signs lift out upward (ease-in).
- **SFX:** wooden "thock" at 31.5, rope creak 32.0, tiny marimba sparkle 33.0.
- **Music:** short 4-note title sting on santoor + tabla (−8 dB), ends 36.5.
- **Text:** title as above.

### S06 · 37.0–45.0 · The breeze arrives
- **Framing:** Wide → medium, jungle edge with a tall tree on the left.
- **Camera:** Truck right 300 px + push 100 % → 115 % (ease-in-out, 8 s), following the breeze.
- **Action:** Breeze made visible as 3 to 4 curly white wind-lines (B&W: pencil swirl strokes; COL: pale mint strokes), each travelling left→right in 2.5 s with an S-curve. Ferns bend 6° as the wind-line passes, spring back with settle 0.8 s. A few pollen dots drift (particles, 20, slow). By 43.0 the camera arrives on one high branch with a single big heart-shaped leaf.
- **SFX:** breeze swell (−20 → −14 dB), leaves rustle as each line passes.
- **Music:** domino motif begins: soft tabla "tick… tock…" at 1 beat / 0.75 s (−20 dB).
- **Text:** none.

### S07 · 45.0–51.0 · The leaf lets go
- **Framing:** Medium close on the branch and the leaf.
- **Camera:** Static, tiny push 100 % → 104 %.
- **Action:** Leaf flutters 45.0–48.0 (rotation ±8°, 3 Hz, growing). 48.0 one strong wind-line passes: leaf stem stretches (squash-stretch 110 %), 49.0 it snaps free (pop, branch springs up 10 px with settle 0.6 s). Leaf begins to fall at 49.2 (ease-in).
- **Rex:** not visible.
- **SFX:** tiny "tik" snap at 49.0.
- **Music:** link pluck #1 (santoor, C) at 49.0.

### S08 · 51.0–59.0 · The leaf drifts down
- **Framing:** Medium, vertical travel through layers.
- **Camera:** Tilt down 900 px following the leaf (ease-in-out over 7 s), ending on a **medium wide of the balanced rock**: a big round boulder perched on a tiny pebble on a ledge, a pile of small rocks behind it on the slope, and (just visible lower right) the slope down to the nest.
- **Action:** Leaf drifts 51.0–58.2 in an S-curve: 3 swings left-right, each swing 2.4 s, rotation ±25° in phase with the swing (leaf "rocks" like a cradle), slows near the bottom. Lands on top of the balanced rock at 58.2 with a tiny squash (leaf flattens 90 % then 100 %, 0.2 s).
- **SFX:** soft whoosh on each swing (pitched up slightly each time), a feather-light "pat" on landing.
- **Music:** tick-tock continues, flute holds a curious rising note.

### S09 · 59.0–66.0 · The rock tips (slow motion)
- **Framing:** Close-up on the balanced rock and its tiny base pebble. Rock fills 60 % of frame. The pebble pile is soft-focus behind on the right.
- **Camera:** Slow push 100 % → 110 % (ease-in), with a 1° roll matching the rock's tilt at the end.
- **Action:** 59.0–60.5 hold; the leaf settles. 60.5 rock tilts 2° → 12° over 1.2 s (ease-in) with a wobble (back to 8°, forward to 14°). Slow-mo x3 from 62.0 to 65.0: the rock passes its balance point, tips to 35°, the tiny base pebble squirts out the other side (spinning). Leaf slides off the rock in the opposite direction (gag: the leaf "steps off" innocently). At 65.0 the rock is rolling right toward the pile.
- **SFX:** stone creak (low, playful) at 60.5; slowed "grrrnnk" during slow-mo; pebble "plink".
- **Music:** pluck #2 (D) at 60.5. Music drops to −28 dB during slow-mo, a held string harmonic.
- **Text:** none.

### S10 · 66.0–72.0 · The pebble pile slides (slow motion on the hit)
- **Framing:** Medium on the pebble pile at the top of the slope.
- **Camera:** Whip-pan right is NOT used; instead the camera trucks right with the rolling rock (ease-out) and stops on the pile at 67.5.
- **Action:** Rock rolls in (rotation 1 turn / 0.9 s), taps the pile at 68.0. Slow-mo x2 68.0–69.5: pile shivers (each pebble jiggles ±2 px), then the front pebbles let go one by one (stagger 0.08 s), 7 pebbles. The big rock stops, rocks back and forth (settle 1.2 s) and stays put (it does NOT go down to the nest). 70.0–72.0 pebbles bounce down the slope, each with its own bounce arc (3 bounces, height halving).
- **SFX:** "tok" on the hit, rattling pebbles (light, like a rain-stick).
- **Music:** pluck #3 (E) at 68.0, then a cascade of 3 quick plucks as pebbles go.

### S11 · 72.0–79.0 · Pebbles hit the nest (slow motion)
- **Framing:** Medium on the nest: a round twig-and-fern nest on a gentle slope. Inside: 2 broken, empty half-shells and one whole egg (cream, speckled), nestled in. (Broken shells are clean and dry: siblings already gone, not sad, just "empty".)
- **Camera:** Static medium, then gentle push 100 % → 108 % at the moment of impact.
- **Action:** 72.0–74.0 pebbles bounce into frame from upper left. 74.0 slow-mo x3 to 77.0: first pebble taps the nest rim (twigs bend 5°, a twig flips up), second pebble bonks the rim, third lands in a broken shell like a cup (comic "ding"). The nest shifts 6 px downhill. 77.0–79.0 normal speed: nest creaks, pauses, everything still.
- **SFX:** "tik, tok, ding" (third one musical), twig creak.
- **Music:** pluck #4 (G) on the first hit, held breath pause 77.0–79.0 (music almost silent).
- **Text:** none.

### S12 · 79.0–87.0 · The nest slides and tilts
- **Framing:** Wide side view of the whole slope so the path is clear: nest at top left, slope going down to the right, a big broad leaf (taro/elephant-ear) at the bottom right of frame, standing up like a soft wall.
- **Camera:** Pan right with the nest 79.0–85.0 (ease-in-out), ending framed on the bottom of the slope.
- **Action:** 79.5 nest starts sliding (ease-in, like a sled), moves 600 px over 4 s, tilting 0° → 18° (downhill side dips). 83.5 it catches on a root and stops (settle 0.8 s, tilt overshoots to 24° then back to 20°). The whole egg tips over the nest rim at 84.0 and pops out (small hop, 0.3 s arc).
- **SFX:** sliding swish (twigs on dirt), a "bump" on the root.
- **Music:** pluck #5 (A) at 79.5, rising strings tremolo (−20 dB) under the slide.

### S13 · 87.0–95.0 · The egg rolls to the big leaf
- **Framing:** Low angle, medium close: the egg in the foreground rolling toward camera-right.
- **Camera:** Dolly alongside the egg at ground level (parallax: foreground ferns whiz past), 87.0–93.0, ease-out to a stop as the egg stops.
- **Action:** Egg rolls 87.0–93.0, wobbly because it is egg-shaped (rotation not constant: fast-slow-fast each half-turn), bumps over a twig at 89.0 (tiny hop, slow-mo x2 for 0.6 s), decelerates (ease-out). 93.0 it rolls softly into the big leaf: the leaf bends 15° like a cushion and pushes back (settle 1.0 s), egg rocks back 2 times and stops at 94.4. A single dewdrop falls off the leaf and lands next to the egg at 94.8.
- **SFX:** soft rolling "thrrr" on grass, twig "tk", gentle "fwump" into the leaf, dewdrop "plip".
- **Music:** pluck #6 (high C) at 87.0, then a soft wind-chime as the egg stops (the "safe" sound).

### S14 · 95.0–102.0 · Hush
- **Framing:** Medium → close-up on the egg resting against the leaf.
- **Camera:** Slow push 100 % → 140 % (ease-in-out, 7 s).
- **Action:** Wind dies down; ferns stop swaying by 97.0. Sunbeam slides across the ground and lands on the egg at 98.0 (light change: egg brightens 20 %; COL: honey glow). 100.0 the egg gives one tiny wobble (±3°, 0.4 s). Pause. 101.2 another, bigger (±5°).
- **SFX:** silence except birds far away; wobble = tiny "tok" against the leaf.
- **Music:** everything fades to a single soft heartbeat drum (tabla, 1 beat / 0.9 s, −26 dB).

### S15 · 102.0–110.0 · Crack, crack
- **Framing:** Close-up, egg fills 50 % of frame.
- **Camera:** Static with a 2 px shake on each crack (3 frames).
- **Action:** 103.0 crack #1: a zigzag line draws itself across the top third of the shell (0.25 s), a chip pops off. 104.0–106.0 egg holds, rocks. 106.5 crack #2: line extends around (0.3 s), a second chip flies off (slow-mo x2 on the chip). 108.0 a tiny tap from inside makes the top wiggle up and down 3 times (0.15 s each).
- **SFX:** two crisp crack sounds (cute, not harsh, like a biscuit snap), tiny "tik-tik-tik" taps from inside.
- **Music:** heartbeat drum quickens 1 beat / 0.6 s, pluck #7 (high D) on crack #2.

### S16 · 110.0–118.0 · Peeking
- **Framing:** Extreme close-up on the top of the egg.
- **Camera:** Static, then micro push 100 % → 105 %.
- **Action:** 110.5 the top shell piece lifts 20 px (like a lid). Darkness in the gap. 112.0 two huge round eyes appear in the gap (fade-in 0.3 s), blink once at 113.0. 113.5–116.0 eyes look left (ease-out 0.4 s), right (0.4 s), up at camera (0.5 s) and hold. 116.5 the lid lowers again 10 px (shy), then up.
- **Rex:** **peeking** → **wide-eyed** (pupils grow 10 % at 114.0).
- **SFX:** tiny squeak at 114.5 (first sound of Rex).
- **Music:** kalimba single notes, curious, −20 dB.

### S17 · 118.0–126.0 · Pop! Hello world (shell hat)
- **Framing:** Medium close: egg, leaf, ground.
- **Camera:** At 119.0 slight pull-back 100 % → 90 % to fit Rex (ease-out 0.8 s).
- **Action:** 118.6 the shell bursts (6 shell pieces fly out in arcs, gentle, slow-mo x2 for 0.8 s); Rex sits up in the bottom half of the shell, arms out. The top piece flies up, spins 2 times and lands on his head at 121.0 like a little hat (settle 0.6 s, slightly tilted). 121.5–124.0 he blinks twice, looks up at the hat (eyes roll up, can't see it), shakes head once, hat stays. 124.5 shell fragments rock to a stop.
- **Rex:** **startled** (on the burst) → **wide-eyed** → **curious tilt** (head 12°, at 123.0).
- **SFX:** "pok!" pop, light shell tinkles on landing, a squeak.
- **Music:** bright santoor run (−12 dB), tabla joyful roll, then thin out.
- **Text:** none.

### S18 · 126.0–134.0 · First sniff, first sneeze
- **Framing:** Close-up, Rex's head and shoulders, shell hat on.
- **Camera:** Static; a 6-frame camera bump on the sneeze.
- **Action:** 126.0–129.0 Rex sniffs the air: nose twitches, head lifts in 3 small lifts (0.4 s each). A floating pollen speck drifts right in front of his nose at 129.0 (particle, lit). 130.0–131.0 build-up: eyes squeeze, head goes back 15°, nostrils flare (ease-in). 131.2 sneeze: head snaps forward (0.1 s), hat pops up 60 px, spins, and lands back on his head at 132.0 (slightly crooked the other way). 132.5–134.0 he blinks, surprised by himself.
- **Rex:** **sniff** → (sneeze) → **wide-eyed** → **giggling** at 133.5 (short).
- **SFX:** sniff-sniff, tiny "ah… ah… tchoo!" (squeaky, no words), hat "tak".
- **Music:** pizzicato strings pluck for each sniff, a comic rest before the sneeze, kalimba giggle-motif after.

### S19 · 134.0–142.0 · He discovers his tail
- **Framing:** Medium, full body visible, side three-quarter view.
- **Camera:** Static, then follows his spin by rotating nothing (keep it simple: Rex spins on the spot).
- **Action:** 134.0 the tail twitches on its own (tip flicks). Rex notices at 135.0 (head turns back, ease-out 0.5 s). Tail wiggles again; he looks the other way (it is behind him). 137.0–139.5 he turns around in one full circle trying to see it (body rotation via 6 drawn turnaround views, 0.4 s each, wobbly), tail always staying just behind. 139.5 dizzy plop: sits down, the tail lands in front of him across his lap. 140.5 he looks at it, taps it with his tiny arm.
- **Rex:** **curious tilt** → **playful hop** (the spin) → **giggling** (140.5–142.0).
- **SFX:** little footstep pats, a "plop" when he sits, giggle.
- **Music:** kalimba playful loop (−14 dB), a slide-whistle-like flute glide on the spin.

### S20 · 142.0–149.0 · The beetle
- **Framing:** Low angle, close-up: the big leaf edge at eye level, Rex's head entering from the left.
- **Camera:** Static, rack focus (blur swap) from Rex to the beetle at 143.0.
- **Action:** A shiny round beetle (simple oval, 6 stick legs on a 2-frame walk cycle) walks along the leaf edge left→right, 142.5–146.0. Rex's head follows it, eyes tracking (pupils lead, head lags 4 frames). 146.0 Rex leans closer, nose nearly touching; the beetle opens its wing cases and buzzes off upward in a loop-the-loop (147.0–148.5). Rex's head follows the loop around once, a little wobble.
- **Rex:** **curious tilt** → **sniff** → **wide-eyed** → (follows loop) **giggling** at 148.5.
- **SFX:** tiny tick-tick steps, buzzy wings (soft, −18 dB), giggle.
- **Music:** loop continues, add a light woodblock for the beetle steps.

### S21 · 149.0–158.0 · Looking for someone
- **Framing:** Medium on Rex sitting by the leaf, then POV wide of the empty jungle.
- **Camera:** 149.0–152.0 medium on Rex. 152.0–157.0 POV pan left → right across the valley (ease-in-out, 5 s): empty nest up the slope, the big rock, tall trees, the cliff; no one there. 157.0–158.0 cut back to medium close on Rex.
- **Action:** 149.0 the giggle fades; he turns to look at the two empty half-shells in the nest above. 150.5 he looks up the slope, stretches his neck tall (body stretch 108 %). POV pan. 157.0 back on Rex: he turns his head slowly left, then right, small squeak, as if calling. No answer, only birds far away.
- **Rex:** **curious tilt** → **wide-eyed** (searching) → **sad** at 157.5 (eyebrows tilt up, mouth corners down, pupils slightly smaller).
- **SFX:** two small hopeful squeaks (151.0, 157.2), far-off bird, the waterfall.
- **Music:** kalimba stops at 149.5. Lone bansuri, slower, a questioning phrase that does not resolve (−18 dB).
- **Light:** begins cooling at 152.0 (see colour plan).

### S22 · 158.0–167.0 · The cold wind
- **Framing:** Medium wide, Rex small in the left third, tall ferns and grey sky behind.
- **Camera:** Slow pull-back 100 % → 85 % (ease-in-out), making him smaller.
- **Action:** 158.0 a cloud slides over the sun (light drops 30 % over 2.5 s; B&W hatch density up; COL desaturate). 160.0 the breeze returns heavier: wind-lines now longer and greyer, more of them (8), ferns bend 12°, leaves (20 particles) tumble past right→left. 162.0 Rex shivers (body jitter ±2 px, 12 Hz, for 0.8 s, twice), pulls his tiny arms in, then reaches up and tugs the shell hat down over his head a little (163.5–164.5). 165.0 he hugs his tail around himself.
- **Rex:** **sad**, shivering.
- **SFX:** cold wind whoosh (−16 dB, rising), leaf rustle, tiny "brrr" squeak.
- **Music:** strings pad thins to a single low note, flute drops away at 161.0.

### S23 · 167.0–176.0 · The little cry
- **Framing:** Close-up on Rex's face (167.0–171.0), then pulling out to a wide (171.0–176.0).
- **Camera:** 167.0–171.0 static close-up. 171.0–176.0 slow crane up and pull-back 100 % → 45 % (ease-in-out): Rex becomes a tiny figure next to the big leaf in the grey valley, wind-lines crossing the frame.
- **Action:** 167.5 lower lip trembles (jaw ±1°, 8 Hz). 168.5 eyes fill (highlights grow and wobble). 169.5 one tear rolls down (bead particle, ease-in, 1.2 s). 170.0 he tips his head back and gives a soft, small cry (mouth open, eyes shut, 2 s), then sniffles, then a second smaller cry at 173.0. The big leaf beside him curls slightly toward him in the wind, like a hug (wind-driven, 8°).
- **Rex:** **crying** (soft) with **sad** between sobs.
- **SFX:** gentle baby-dinosaur whimper (two short cries, never a scream), sniffle, wind.
- **Music:** bansuri returns: a falling three-note phrase (E–D–C) at 170.0 and again softer at 174.0, then only wind.
- **Text:** none.

### S24 · 176.0–180.0 · End card (hook)
- **Framing:** The same wide, frozen and slowly going back to plain pencil (COL: colour drains back to graphite).
- **Camera:** Static.
- **Action:** 176.0 picture fades to 50 % paper white. A little wind-line curls across. Wooden plank slides in at 176.4.
- **SFX:** last whisper of wind, one pencil scratch.
- **Music:** single kalimba note (a hopeful major note: "something will happen") at 177.0, ring out.
- **Text:** **ఇంకా ఉంది... / To be continued...** (176.6–180.0). Small line under it at 177.5: **తరువాత: మెరిసే వాన చినుకులు / Next: the twinkling rain**.

**Episode 0 runtime check:** 24 shots (4 narration + title + 18 story + end card), last shot ends at 180.0 s.

---

## EPISODE 1: "The Twinkling Rain" (230.0 s, 24 shots)

### Treatment
**Mood.** From lonely to delighted to "whee!" The rain is Rex's first friend: it comforts him, plays with him, and finally carries him off on an adventure.
**Story spine.** Recap → sniffles under the grey sky → one glowing drop → he stops crying → drops tickle him, he laughs and plays (catching drops, tongue, puddle reflection, splash, leaf umbrella) → rain grows big, he snuggles under the big leaf → the stream rises, lifts the leaf with Rex on it → a joyful ride (spins, a little "whee" drop, the beetle floats by) → the rain eases, light returns → he floats toward a glowing waterfall mist → "Where will Rex go?"
**Emotional beats.** Soft sadness (0–30) → wonder (30–50) → giggles and play (50–100) → cosy awe (100–140) → surprise turning to fun (140–192) → calm wonder and hook (192–230).
**Light arc.** Blue-grey → glowing drops add gold/white sparkles → lighter teal during play → slate during big rain (Rex kept in a light patch) → warm tan water, bright greens → pearl mist with a faint rainbow.
**Music arc.** Lone flute (same as Ep0 end) → "drop" theme: kalimba + celesta-like plinks, one per drop → playful tabla + santoor dance loop (6/8, bouncy) → rain-drum build (tabla, low strings, still major key) → full ride theme: santoor, flute, tabla, strings, upbeat "boat song" feel → thins to a wondering flute + distant waterfall roar → end sting.
**Flood rule.** Water is light tan with white foam, rounded waves, no debris that could hurt (only leaves, small twigs, flower petals). The camera never goes underwater. Rex is never splashed in the face hard; he is always on top of the leaf, and his expression shows fun within 2 s of every surprise.

### Recap card (storybook text, no voice)
1. **చిన్ని రెక్స్ పుట్టాడు... కానీ అమ్మ కనిపించలేదు.**
   *Little Rex was born... but he could not find his mother.*
2. **చల్లని గాలిలో, ఒంటరిగా, మెల్లగా ఏడ్చాడు.**
   *Alone in the cold wind, he cried softly.*

---

### S01 · 0.0–8.0 · Recap
- **Framing:** The final wide of Ep0 (tiny Rex by the big leaf), as a pencil drawing on paper with a slightly torn edge, 80 % size, centred.
- **Camera:** Slow push 100 % → 106 % (ease-in-out).
- **Action:** 0.0–0.8 fade up from paper white. Wind-lines drift across slowly. Picture desaturated (COL: blue-grey).
- **SFX:** soft wind, a faint sniffle at 5.0.
- **Music:** bansuri, the Ep0 falling phrase once, very soft (−22 dB).
- **Text:** Recap line 1 at 0.8–4.2, line 2 at 4.4–7.6 (each card 2 lines: Telugu + English).

### S02 · 8.0–14.0 · Title card
- **Framing:** Wide valley, grey sky.
- **Camera:** Static.
- **Action:** Same sign animation as Ep0 S05: "REX ADVENTURES" drops in (8.0), "EPISODE 1" swings in (9.0), subtitle plank **"మెరిసే వాన / The Twinkling Rain"** slides in (10.0). A single glowing drop falls past the sign at 11.5 and twinkles. All lift out 13.2–14.0.
- **SFX:** wooden thock, rope creak, a "plink" for the drop.
- **Music:** title sting in a softer, slower arrangement (−12 dB).
- **Text:** as above.

### S03 · 14.0–22.0 · Still sniffling
- **Framing:** Medium on Rex sitting next to the big leaf, shell hat on, tail wrapped around him.
- **Camera:** Slow push 100 % → 115 % (ease-in-out).
- **Action:** Clouds roll slowly across the sky (L0 scroll 20 px/s). Rex sniffles (14.5, 17.0, 19.5): each sniffle = shoulders up 4 px (0.2 s) and down (0.4 s). He rubs one eye with a tiny arm at 18.0 (arm too short, barely reaches; 1 s).
- **Rex:** **sad** with sniffles (**crying** level very low).
- **SFX:** sniffles, wind softer than Ep0 end, far thunder purr (gentle, −30 dB) at 20.0.
- **Music:** bansuri holds a low note, strings pad enters very softly.

### S04 · 22.0–30.0 · The first drop
- **Framing:** Medium close, Rex left, the big leaf surface right.
- **Camera:** Static until 27.0, then a gentle push toward the leaf surface (100 % → 120 %, ease-in-out 3 s).
- **Action:** 22.0–26.0 Rex sniffles, head down. 26.0 a single drop falls from the top of frame, glowing (white/gold core + soft bloom), falls slowly (glowing drops fall at 40 % of normal rain speed, ease-in), lands on the big leaf at 27.0: tiny splash crown (6 particles) and it sits there as a round bead, twinkling (4-point star sparkle, rotating 15°/s, pulsing every 1.2 s). Rex's head lifts at 27.6 (ease-out 0.6 s).
- **Rex:** **sad** → **wide-eyed** at 28.2 (pupils grow 15 %, a 3rd highlight dot appears).
- **SFX:** glassy "plink" on landing, a sparkle shimmer.
- **Music:** first drop note: celesta/kalimba high note at 27.0, flute stops.

### S05 · 30.0–40.0 · Rex meets the glowing drop
- **Framing:** Extreme close-up: the drop bead on the leaf in the foreground (sharp), Rex's huge eye in the background (soft). At 35.0 rack focus to Rex's eye; the drop is reflected in his eye highlight.
- **Camera:** Static, rack focus 35.0–36.0.
- **Action:** Drop twinkles, wobbles like jelly when a breeze touches the leaf (32.0, scale 100 → 106 → 100 %, settle 0.6 s). Rex's last tear (on his cheek) catches the light at 37.0 and shrinks away; he stops sniffling. 38.0 he leans in slowly (ease-in-out 1.5 s), nose almost touching the drop.
- **Rex:** **wide-eyed** → **curious tilt** (38.0) → **sniff** (39.5).
- **SFX:** soft shimmer loop for the drop, one last tiny sniff (turning into a curious sniff).
- **Music:** kalimba plays a gentle 4-note "drop theme" twice (−18 dB). Strings warm up.
- **Light:** first warm glow on Rex's face (COL: pale gold; B&W: lighter hatching patch).

### S06 · 40.0–50.0 · A drop on the nose
- **Framing:** Close-up, Rex's head and shoulders, looking at the drop.
- **Camera:** Static, small bump (4 frames) at the startle.
- **Action:** 40.0–42.0 Rex sniffs the drop. 42.5 the drop rolls off the leaf (it's tipped by his nose) and falls, he follows it down with his eyes. 44.5 a second glowing drop falls from above, slowly, straight onto the tip of his nose at 45.5: splashes into 5 glitter particles. 45.5 Rex blinks hard (startled). 46.5 his eyes cross looking at his wet nose. 47.5 he gives his first giggle; 48.5 he looks up at the sky.
- **Rex:** **sniff** → **startled** (45.5) → **wide-eyed** → **giggling** (47.5).
- **SFX:** "plink" on the nose (higher pitch), squeak of surprise, first giggle.
- **Music:** drop note on the nose, then a short happy kalimba flourish.

### S07 · 50.0–60.0 · Twinkling rain begins
- **Framing:** Medium wide, Rex in the centre, looking up, sky above.
- **Camera:** Slow tilt up 30 % (ease-in-out, 4 s) to reveal the sky, then back down (4 s).
- **Action:** Clouds thin to a soft grey with a pale light behind. 51.0 a gentle shower of glowing drops begins: 15 → 40 drops over 6 s, each slow (as above), each twinkling, a few drifting sideways. Drops land on ferns (ferns dip 4° and spring back, settle 0.5 s), on rocks (tiny glitter puffs), on Rex's head and shell hat (hat "tink" sounds!). Rex giggles on each one that lands on him (53.0, 55.5, 57.0).
- **Rex:** **wide-eyed** → **giggling** (repeated, small bounces 6 px).
- **SFX:** a gentle chorus of plinks at different pitches (like a wind chime made of water), "tink" on the shell hat.
- **Music:** "drop theme" turns into a soft melody: kalimba + santoor, tabla enters on a light 6/8 at 56.0 (−16 dB).
- **Light:** sky lifts 20 %, COL warms toward soft teal.

### S08 · 60.0–72.0 · Catching drops
- **Framing:** Medium, full body, side view on a little patch of grass.
- **Camera:** Static, tiny trucks left/right following his hops (ease-in-out, 1 s each).
- **Action:** 60.5 Rex spots a glowing drop falling and reaches up with his tiny arms (arm reach is comically short). 61.5 drop lands just past his arms on the ground; he looks at his arms, then at the drop (beat). 63.0 he tries again with a little hop (jump 30 px, 0.5 s arc), misses, the drop lands on his head instead (hat "tink"). 66.0 third try: he opens his mouth, tongue out, sways under the drop (left 0.5 s, right 0.5 s), it lands on his tongue at 68.0 with a sparkle. 68.5 he closes his mouth, cheeks puff with delight, eyes shut happily, then a big laugh at 70.0.
- **Rex:** **playful hop** → **wide-eyed** (looking at short arms) → **playful hop** → **laughing** (70.0).
- **SFX:** hop pats, "tink", a tiny "gulp-plink", first big laugh.
- **Music:** dance loop full (−12 dB); a comic flute "wah" on the miss at 61.5.

### S09 · 72.0–82.0 · The puddle reflection
- **Framing:** Low, close-up over a small round puddle; Rex's face enters from top, reflected upside-down in the puddle.
- **Camera:** Static, then slow push into the puddle reflection (100 % → 120 %, 72.0–80.0).
- **Action:** 72.5 Rex leans over and sees himself (reflection = same puppet, flipped vertically, 70 % opacity, slight horizontal ripple shader). 73.5 he tilts his head; reflection tilts. 75.0 he tilts the other way; reflection follows. 76.5 he pokes his tongue out; reflection too; he giggles. 78.0 a glowing drop lands in the puddle: rings spread out (3 rings, 1.2 s each, ease-out), the reflection wobbles and breaks into wiggles. 79.5 he pokes the water with his nose; more rings; the reflection re-forms with the drop's sparkle on top of his reflected hat like a star.
- **Rex:** **curious tilt** (both ways) → **giggling** → **wide-eyed** (on the ripple) → **giggling**.
- **SFX:** puddle "blup", ripple shimmer, giggles.
- **Music:** loop drops to −18 dB, a little mirrored kalimba phrase (played once forwards, once backwards in feel).

### S10 · 82.0–90.0 · Splash!
- **Framing:** Medium, side view of Rex and the puddle.
- **Camera:** Static, 4-frame bump on the splash.
- **Action:** 82.0 Rex backs up 2 steps (wiggly walk), wiggles his bottom (like a cat about to pounce, 3 wiggles in 0.9 s). 84.0 he hops into the puddle (arc 0.6 s, ease-in landing). 84.6 splash: crown of 25 water particles, plus 5 glowing ones, slow-mo x2 for 1 s. He lands sitting in the puddle; the shell hat bounces up and lands back. 86.5–90.0 he laughs and slaps the water with his tail (2 splashes).
- **Rex:** **playful hop** → **laughing**.
- **SFX:** "sploosh" (round, cartoony), tail splashes, laughing.
- **Music:** loop back to −12 dB with a tabla fill on the jump.

### S11 · 90.0–100.0 · Leaf umbrella and the beetle again
- **Framing:** Medium close, Rex by a mushroom; the beetle from Ep0 is sheltering under the mushroom cap.
- **Camera:** Static, small push toward the pair at 96.0.
- **Action:** 90.0 the rain gets a bit thicker: more drops, now some ordinary (non-glowing) grey streaks mixed in. 91.0 Rex spots the beetle under the mushroom, cosy and dry. 92.5 he looks around, finds a small round leaf, picks up the stem in his mouth (arms too short; he tries arms first at 93.0, gives up) and holds it over his head like an umbrella (94.5). Drops drum on it. 96.0 the beetle looks at Rex; Rex looks at the beetle; both blink at the same time at 97.5 (cute sync). 98.5 a heavier drop bends Rex's leaf umbrella down over his face; he peeks out from under it.
- **Rex:** **curious tilt** → **playful hop** (small) → **giggling** → **peeking** (98.5).
- **SFX:** heavier "pat-pat-pat" on the leaf umbrella, beetle "chirr", giggle muffled by the leaf stem.
- **Music:** loop simplifies; low strings start a slow, steady rise (the weather is changing).

### S12 · 100.0–110.0 · The rain grows
- **Framing:** Wide valley, Rex small lower-left by the big leaf.
- **Camera:** Slow pull-back 100 % → 80 % (ease-in-out).
- **Action:** Light dims 25 % over 6 s; clouds thicken and darken a little. Rain particles go from 40 slow glowing drops to 300 fast diagonal streaks (angle 12°) over 8 s; glowing drops fade to 5 % of the mix but a few still sparkle near Rex. Waterfall in the distance grows brighter and wider (white streak layer scale 100 → 130 %). Palms sway 8°. 107.0 Rex trots (4 little steps) to the big leaf and ducks under it.
- **Rex:** **curious tilt** → (trotting) → under leaf, **wide-eyed**.
- **SFX:** rain hiss rising (−24 → −12 dB), thunder purr, still friendly (no cracks or booms).
- **Music:** dance loop ends at 103.0; tabla pattern on toms + low strings, steady, in major, curious not scary (−14 dB).

### S13 · 110.0–120.0 · Cosy under the big leaf
- **Framing:** Medium close, Rex sitting under the big leaf (the same one that stopped his egg; show the empty egg-shell bottom next to him).
- **Camera:** Static, tiny push 100 % → 106 %.
- **Action:** Rain pours off the leaf edges in a curtain of 3 little waterfalls (scrolling streak texture). Drumming on the leaf top (leaf surface jiggles ±1 px). 112.0 Rex looks up at the drumming, head bobbing a little in rhythm (on the beat, 4 bobs). 115.0 one drop drips through a tiny hole in the leaf onto his hat: "tink"; he looks up at the hole, then scoots 1 step sideways (comic). 117.5 he snuggles into his tail, eyes half closed, cosy.
- **Rex:** **curious tilt** → **wide-eyed** (drip) → content, eyes half-closed (use **sleeping** pose eyelids at 50 %, mouth smiling).
- **SFX:** heavy rain on a big leaf (drum-like), the "tink", a contented hum-squeak.
- **Music:** tabla plays *with* the rain drumming (Rex's head-bob matches it). Warm strings.

### S14 · 120.0–130.0 · Big rain
- **Framing:** Extreme wide of the valley: cliffs, waterfall, slope, Rex's leaf tiny in the lower third.
- **Camera:** Slow crane up 120 px and pan left to the cliffs (ease-in-out).
- **Action:** Rain streaks dense (500). Cliff faces sprout little silver streams (8 thin streak layers that grow downward, 1.5 s each, staggered). The main waterfall is now big and roaring white. A shallow stream appears along the valley floor: water layer rises from 0 to 40 px (ease-in-out, 10 s), with floating leaves already riding it.
- **Rex:** tiny, under the leaf (visible as a small silhouette with bright eyes: B&W white eye dots; COL warm eye glints).
- **SFX:** heavy rain, waterfall roar rising (−18 dB), gurgles.
- **Music:** build: tabla roll + rising strings, a flute line on top (adventurous, not dark).
- **Light:** the darkest point of Ep1 (B&W hatch +30 %, COL slate blue), but Rex's spot stays 15 % brighter.

### S15 · 130.0–140.0 · Little rivers at his feet
- **Framing:** Ground level, close-up: Rex's feet and the water.
- **Camera:** Static, then tilt up to Rex's face at 136.0 (ease-in-out 1.5 s).
- **Action:** Little rivulets run past (flowing streak lines, curved, left→right). 131.0 a tiny leaf floats past like a boat, spinning; Rex's foot lifts to let it go by (132.0). 133.5 water reaches his toes; he lifts one foot, then the other (paddling in place, 4 lifts). 136.0 tilt up: Rex watches a flower petal swirl around his feet, head turning in a full slow circle with it.
- **Rex:** **curious tilt** → **wide-eyed** → **giggling** (at the petal).
- **SFX:** gurgles, tiny splashes on foot lifts, giggle.
- **Music:** strings ostinato (8th notes), building energy, −12 dB.

### S16 · 140.0–150.0 · Here comes the wave
- **Framing:** Wide, looking upstream along the valley floor; Rex's leaf in the right foreground.
- **Camera:** Static, then slow push toward the bend upstream 140.0–146.0, then fast pull back to Rex 146.0–150.0 (ease-in-out).
- **Action:** 141.0 around the bend comes a gentle rolling wave: a rounded hump of tan water carrying a "parade" of leaves, ferns, petals and a few twigs; white foam scribbles on top (animated line boil every 2 frames). It moves at a walking pace (180 px/s), bobbing. The beetle is riding a twig in the parade (tiny, happy). 147.0 back on Rex: he sees it coming, his eyes go big.
- **Rex:** **wide-eyed** → **startled** at 148.5 (body pops up 10 px).
- **SFX:** rising "whoosh-gurgle", rustling leaves, a playful tumbling sound.
- **Music:** a 2-bar lift (strings swell + tabla fill) into the ride, NO stingers or scary hits.

### S17 · 150.0–158.0 · Lift-off
- **Framing:** Medium on Rex sitting on the big leaf (the stem snapped; the leaf is lying flat on the water like a raft).
- **Camera:** Moves up with the leaf (boom up 120 px, ease-out) and then begins to track right.
- **Action:** 150.5 the wave arrives gently, lifts the big leaf with Rex sitting on it (rise 120 px over 1.5 s, ease-out, bob ±8 px, 1.2 s cycle). The leaf's stem pops free from the ground at 151.5 ("pok"). 152.0–154.0 Rex grips the leaf edges with his tiny arms, eyes huge, tail up. 154.5 the leaf turns slowly (30°) and starts to float downstream. 156.0 he looks over the edge at the water, then back at us.
- **Rex:** **startled** → **floating** (from 152.0) → **wide-eyed** → **curious tilt** at 157.0.
- **SFX:** water lift "shloop", stem "pok", bobbing slaps.
- **Music:** ride theme starts at 154.5: santoor melody, tabla groove, bansuri countermelody (−8 dB). Bright, a "boat song".

### S18 · 158.0–170.0 · The ride (first "whee")
- **Framing:** Side tracking shot, medium wide; Rex on the leaf in the centre third, water flowing.
- **Camera:** Tracking right at the leaf's speed (Rex stays centred), strong parallax: foreground ferns (1.4) whiz by, cliffs (0.5) slide, mountains (0.25) slowly.
- **Action:** Leaf bobs (±8 px, 1.0 s) and rocks (±6°, 1.6 s, out of phase). 160.0 the leaf spins slowly 360° over 3 s; Rex's head stays looking at camera as long as possible then snaps around (classic gag) at 162.0. 163.0 he lets go with one arm and waves it (tiny arm). 165.0 a small wave lifts the leaf up and down (20 px); Rex's tummy-drop face then a big laugh at 166.0. Rain lighter now: 150 streaks + 10 glowing drops return.
- **Rex:** **floating** → **wide-eyed** → **laughing** (166.0–170.0).
- **SFX:** water rush (−14 dB), leaf flapping, laughter, a "whee" squeak (no words).
- **Music:** ride theme full.

### S19 · 170.0–180.0 · Floating friends
- **Framing:** Top-down (overhead) wide on the stream; Rex's leaf in the centre.
- **Camera:** Overhead, slow rotate 15° with the swirl (ease-in-out), static position.
- **Action:** The leaf goes round in a gentle whirlpool (2 slow loops, 4.5 s each, around a round rock). Other leaves, petals and the beetle on its twig circle with him. 173.0 the beetle's twig bumps the leaf, the beetle hops onto the leaf next to Rex (arc 0.5 s). 175.0 Rex and the beetle look at each other; Rex giggles; the beetle wiggles its antennae. 178.5 the whirl lets them go downstream.
- **Rex:** **floating** → **curious tilt** → **giggling**.
- **SFX:** swirling water, soft "tok" bump, beetle "chirr", giggle.
- **Music:** ride theme continues, add woodblock for the beetle hop.

### S20 · 180.0–192.0 · The little drop (slow motion "whee!")
- **Framing:** Side view, medium wide: the stream goes over a small rounded step (a smooth rock ledge, about leaf-height).
- **Camera:** Tracking right, then holds still at the step as the leaf goes over (ease-out), then tracks again.
- **Action:** 181.0–184.0 approach: the leaf speeds up a little (ease-in). 184.0 leaf tips over the edge; slow-mo x3 184.0–188.0: the leaf glides down, Rex and the beetle lift 10 px off the leaf (floating in the air, eyes huge, mouths open in delight), shell hat lifts off his head and hangs in the air above him; glowing drops hang in the air around them like stars. 188.0 back to normal speed: leaf lands with a soft "sploosh", Rex and beetle drop back onto it, the hat lands back on Rex's head (perfect). 189.0–192.0 Rex laughs, the beetle does a little hop.
- **Rex:** **floating** (pose) → **wide-eyed** → **laughing**.
- **SFX:** whoosh into near-silence during slow-mo (only a long shimmer), then "sploosh" and laughter.
- **Music:** music pauses on one held high string note during slow-mo, then the ride theme hits back in at 188.0.

### S21 · 192.0–204.0 · The rain eases
- **Framing:** Wide, the stream now broad and calm, Rex's leaf floating toward camera-right.
- **Camera:** Slow tracking right and slow push 100 % → 110 % (ease-in-out).
- **Action:** Rain thins from 150 streaks to 0 over 8 s; the last few drops are glowing ones (5) that twinkle as they fall. Clouds part at 197.0: a sunbeam (light change: +25 %, COL warms to gold-green) lands on the leaf. Water calms (wave amplitude halves). 199.0 Rex stands up carefully on the leaf (wobble), shakes himself dry like a puppy (fast body wiggle 0.6 s, water droplets spray out in a ring of 20 particles), the beetle gets sprayed and shakes too (sync gag). 202.0 he sits, happy.
- **Rex:** **floating** → **playful hop** (standing/shake) → **giggling**.
- **SFX:** rain stops, birdsong returns (two chirps), gentle flowing water, shake "brrrrrt".
- **Music:** ride theme relaxes to flute + santoor, slower.

### S22 · 204.0–214.0 · A sound ahead
- **Framing:** Close-up on Rex's face, beetle on his shell hat now.
- **Camera:** Static, then slow push to an extreme close-up on his eyes (100 % → 140 %, 208.0–214.0).
- **Action:** 204.5 a low distant roar begins (the waterfall ahead). Rex's ear-spot twitches (no ears on a T-Rex: animate the head-side flick). 206.0 he turns to look ahead (ease-out 0.6 s). A soft white glow begins to fill his eyes (reflection of the mist, white highlight grows). 209.0 his mouth opens in wonder. 211.5 the beetle on his hat leans forward the same way (sync gag).
- **Rex:** **curious tilt** → **wide-eyed** (big, 3 highlights).
- **SFX:** waterfall roar rising from −30 to −16 dB, birds.
- **Music:** flute plays a long rising question phrase; strings swell slowly.

### S23 · 214.0–222.0 · Into the mist (hook)
- **Framing:** Extreme wide, from behind Rex: the tiny leaf raft on a wide, smooth river; ahead, a huge white cloud of waterfall mist rising, with the sun behind it (COL: a pastel rainbow arc).
- **Camera:** Crane up and back (100 % → 60 %, rising 300 px, ease-in-out, 8 s), the leaf getting smaller as it floats toward the bright mist.
- **Action:** River flows (streaks), mist billows (3 layered soft cloud sprites, slow drift and scale 100 → 110 %). The leaf floats toward the mist; at 220.0 the mist's edge drifts over it so Rex's silhouette becomes soft (we don't see where the river goes). The edge of the waterfall is suggested only by the mist and a bright line, never a drop.
- **Rex:** **floating** (silhouette).
- **SFX:** waterfall roar at its peak (−10 dB), river.
- **Music:** strings + flute hold a bright, open chord, swelling (−6 dB, loudest moment), cut to silence on the white at 222.0.

### S24 · 222.0–230.0 · End title
- **Framing:** Full-frame white mist turning back into paper.
- **Camera:** Static.
- **Action:** 222.0 white paper (mist dissolves into paper texture over 1 s). 223.0 the wooden plank question sign drops in (settle). 225.5 second plank swings in. 227.0 a tiny glowing drop falls past and twinkles. Fade to paper at 229.4.
- **SFX:** wood thock, rope creak, a final "plink".
- **Music:** 3-note end sting on santoor (same as the Ep0 title motif, rising), ring out to 230.0.
- **Text:**
  - Plank 1 (223.0): **రెక్స్ ఎక్కడికి వెళ్తాడు? / Where will Rex go?**
  - Plank 2 (225.5): **రెక్స్ అడ్వెంచర్స్ – ఎపిసోడ్ 2 త్వరలో! / Rex Adventures – Episode 2 coming soon!**
  - Small footer (226.0): **youtube.com/@kramavriddhi**

**Episode 1 runtime check:** 24 shots (recap + title + 21 story + end title), last shot ends at 230.0 s (inside the 210–240 s target).

---

## 2. Asset list for the animator (build once, reuse)

- **Rex puppet** with the 12 poses above, 6-view turnaround for the tail-spin, shell-hat piece, tear bead, sneeze puff.
- **Beetle** (oval body, 2 wing cases, 6 stick legs, 2 antennae; walk + fly + hop).
- **Egg** (whole; crack overlay 1 and 2; burst into 6 pieces; bottom half "cradle"); **nest** with 2 empty half-shells.
- **Rocks:** big round balanced boulder, tiny base pebble, pebble pile (7 loose pebbles + static back pile), round rock in the whirlpool, smooth ledge step.
- **Leaves:** falling heart-shaped leaf, big taro/elephant-ear leaf (standing version + raft version), small umbrella leaf, mushroom.
- **Backgrounds (5 parallax layers):** valley wide, jungle edge with tall tree, slope with nest, ground-level grass/puddle, river side view, river overhead, mist finale.
- **Particles:** wind-lines, pollen, tumbling leaves, glowing drops (with bloom + 4-point twinkle), ordinary rain streaks, splash crowns, ripple rings, foam scribbles, mist clouds, shake-spray.
- **Cards:** wooden-plank sign set (title, episode plank, subtitle plank, end planks), torn-paper narration strip.
- **Shaders/filters:** paper grain overlay, line boil, vignette, B&W↔COL wash layer (watercolour bleed reveal), puddle reflection ripple, desaturate/cool grade.

## 3. Director's checks before test frames
- Every chain link in Ep0 must be readable as a silhouette in the B&W version: leaf, rock, pebbles, nest, egg each with a white rim against a mid-grey background.
- Rex's eyes: two highlights in every close-up; never cover his eyes with the hat or rain.
- Crying shots total under 10 s per episode (Ep0: about 6 s of crying; Ep1: sniffles only).
- Flood: tan water, rounded waves, Rex smiling or laughing within 2 s of every surprise; no shot ends on a scared face.
- Text cards: at least 5 s on screen, Telugu checked for correct conjunct shaping in the render.
