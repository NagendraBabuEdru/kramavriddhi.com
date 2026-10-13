// Recording-only "puppet theatre" (NOT part of the real game). Opened with ?story in the URL.
// Every frame it asks JavaScript for a display list (window.storyFrame() -> JSON) and draws it with
// the game's own painters: Rex, his friends, Old Wren, raptors, Gnash, coins, cliffs with vines,
// the four stage backgrounds, and the ink book's Little Rex, Nix, Flick and props.
// On top it can add simple expressions (happy / wide / sleepy / sad eyes, blush, sweat, tears).
import 'dart:convert';
import 'dart:math' as math;
import 'dart:js_interop';
import 'dart:js_interop_unsafe';

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:google_fonts/google_fonts.dart';

import '../classic/adventure_painters.dart' as adv;
import '../classic/baby_rex.dart' as baby;
import '../classic/ink.dart' as ink;
import '../classic/ink_painters.dart' as inkp;
import '../classic/level_painters.dart' as lvl;
import '../classic/more_painters.dart' as more;
import '../classic/nix.dart' as nix;
import '../classic/tasks.dart' as tasks;
import '../game/painters.dart';
import '../game/story.dart';
import '../game/terrain.dart';

class StoryApp extends StatelessWidget {
  const StoryApp({super.key});

  @override
  Widget build(BuildContext context) =>
      const MaterialApp(debugShowCheckedModeBanner: false, home: Scaffold(backgroundColor: Colors.black, body: _Stage()));
}

class _Stage extends StatefulWidget {
  const _Stage();

  @override
  State<_Stage> createState() => _StageState();
}

class _StageState extends State<_Stage> with SingleTickerProviderStateMixin {
  late final Ticker _ticker;
  int _frame = 0;

  @override
  void initState() {
    super.initState();
    displayFont = GoogleFonts.lilitaOne().fontFamily;
    ink.inkFont = GoogleFonts.patrickHand().fontFamily;
    _ticker = createTicker((_) => setState(() => _frame++))..start();
    globalContext.setProperty('storyReady'.toJS, true.toJS);
  }

  @override
  void dispose() {
    _ticker.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => SizedBox.expand(child: CustomPaint(painter: _Puppets(_frame)));
}

class _Puppets extends CustomPainter {
  _Puppets(this.frame);
  final int frame;

  @override
  bool shouldRepaint(_Puppets old) => true;

  @override
  void paint(Canvas c, Size size) {
    final fn = globalContext.getProperty<JSFunction?>('storyFrame'.toJS);
    if (fn == null) return;
    final res = fn.callAsFunction(null, size.width.toJS, size.height.toJS);
    if (res == null) return;
    final Map<String, dynamic> d = jsonDecode((res as JSString).toDart);
    final cam = (d['cam'] as Map?) ?? const {'cx': 480, 'cy': 270, 'z': 1.0};
    c.save();
    c.translate(size.width / 2, size.height / 2);
    c.scale(_n(cam['z'], 1));
    c.translate(-_n(cam['cx'], 480), -_n(cam['cy'], 270));
    final bg = d['bg'] as Map?;
    if (bg != null) _background(c, bg);
    for (final it in (d['items'] as List? ?? const [])) {
      _item(c, it as Map);
    }
    c.restore();
  }

  static double _n(Object? v, [double def = 0]) => v == null ? def : (v as num).toDouble();
  static bool _b(Object? v) => v == true;

  void _background(Canvas c, Map bg) {
    if (bg['type'] == 'paper') {
      c.drawRect(const Rect.fromLTWH(-3000, -3000, 7000, 7000), Paint()..color = ink.Pal.paper);
      for (var i = 0; i < 900; i++) {
        c.drawCircle(Offset(ink.jit(5, i) * 1400 + 480, ink.jit(6, i) * 1400 + 270), 0.9, Paint()..color = ink.Pal.grain);
      }
      final gy = _n(bg['ground'], 462);
      c.drawPath(ink.inkPoly([Offset(-800, gy), Offset(1760, gy + 3)], 9, closed: false), Paint()
        ..color = ink.Pal.pencil
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2);
      return;
    }
    final th = themes[_n(bg['theme']).toInt()];
    // extend the 960x540 stage: sky above, soil below, so a tall (Shorts) camera never sees black
    c.drawRect(const Rect.fromLTWH(-3000, -3000, 7000, 3000), Paint()..color = th.skyTop);
    c.drawRect(const Rect.fromLTWH(-3000, kH - 1, 7000, 3000), Paint()..color = th.ground);
    c.drawRect(const Rect.fromLTWH(-3000, 0, 3000, kH), Paint()..color = th.skyBottom);
    c.drawRect(const Rect.fromLTWH(kW, 0, 3000, kH), Paint()..color = th.skyBottom);
    drawBackground(c, th, _n(bg['s']), _n(bg['t']));
  }

  void _item(Canvas c, Map it) {
    final k = it['k'] as String;
    final x = _n(it['x']), y = _n(it['y']), t = _n(it['t']);
    final alpha = _n(it['alpha'], 1);
    if (alpha <= 0) return;
    c.save();
    c.translate(x, y);
    if (it['rot'] != null) c.rotate(_n(it['rot']));
    c.scale(_n(it['sx'], 1) * (_b(it['flip']) ? -1 : 1), _n(it['sy'], 1));
    if (alpha < 1) c.saveLayer(null, Paint()..color = Color.fromRGBO(0, 0, 0, alpha));
    final s = _n(it['s'], 1);
    switch (k) {
      case 'rex':
        drawRex(c, 0, 0, s, t, air: _b(it['air']), roar: _b(it['roar']), still: _b(it['still']), shield: _b(it['shield']));
        c.scale(s);
        _rexFace(c, it);
      case 'friend':
        final kind = it['kind'] as String;
        drawFriend(c, 0, 0, s, kind, t, still: _b(it['still']));
        c.scale(s);
        _friendFace(c, it, kind);
      case 'raptor':
        drawRaptor(c, 0, 0, s, t, boss: _b(it['boss']), flash: _b(it['flash']), still: _b(it['still']));
        c.scale(-s, s);
        _raptorFace(c, it);
      case 'coin':
        drawCoin(c, 0, 0, t);
      case 'heart':
        drawHeart(c, 0, 0, s, true);
      case 'rock':
        final w = _n(it['w'], 48), h = _n(it['h'], 38);
        c.drawPath(
            Path()
              ..moveTo(0, 0)
              ..lineTo(6, -h + 10)
              ..lineTo(20, -h)
              ..lineTo(38 * w / 48, -h + 6)
              ..lineTo(w, 0)
              ..close(),
            Paint()..color = const Color(0xFF7D7B78));
        c.drawPath(
            Path()
              ..moveTo(10, -h + 12)
              ..lineTo(20, -h + 3)
              ..lineTo(28, -h + 8)
              ..close(),
            Paint()..color = const Color(0xFFA9A6A1));
      case 'cliff':
        final th = themes[_n(it['theme']).toInt()];
        final ter = Terrain('cliff', 0, _n(it['w'], 360), h: _n(it['h'], 195), feature: 'vines');
        drawTerrainBack(c, ter, th, t, -999, false);
      case 'water':
        final th = themes[_n(it['theme'], 1).toInt()];
        final ter = Terrain('water', 0, _n(it['w'], 400), feature: 'water');
        drawTerrainBack(c, ter, th, t, -999, false);
      case 'waterFront':
        drawWaterFront(c, Terrain('water', 0, _n(it['w'], 400), feature: 'water'), t);
      case 'baby':
        baby.drawBabyRex(c, 0, 0, s, t,
            pose: baby.BabyPose.values.byName((it['pose'] as String?) ?? 'idle'),
            poseT: _n(it['poseT']),
            faceLeft: _b(it['faceLeft']),
            mama: _b(it['mama']),
            wave: _b(it['wave']),
            hat: _b(it['hat']),
            blink: _b(it['blink']));
      case 'nix':
        nix.drawNix(c, 0, 0, s, t,
            pose: nix.NixPose.values.byName((it['pose'] as String?) ?? 'stand'),
            poseT: _n(it['poseT']),
            faceLeft: _b(it['faceLeft']),
            carrying: it['carrying'] as String?);
      case 'babyTiko':
        inkp.drawBabyTiko(c, 0, 0, s, t, crying: _b(it['crying']), happy: _b(it['happy']), faceLeft: _b(it['faceLeft']));
      case 'flick':
        inkp.drawFlick(c, 0, 0, t, glow: _b(it['glow']), scale: s);
      case 'starBall':
        inkp.drawStarBall(c, 0, 0, rot: _n(it['spin']), shadow: !_b(it['noShadow']));
      case 'inkWren':
        more.drawInkWren(c, 0, 0, s, t, umbrella: _b(it['umbrella']), glasses: _b(it['glasses']), happy: _b(it['happy']));
      case 'babyStella':
        more.drawBabyStella(c, 0, 0, s, t, crying: _b(it['crying']), happy: _b(it['happy']));
      case 'babyMomo':
        lvl.drawBabyMomo(c, 0, 0, s, t, crying: _b(it['crying']), happy: _b(it['happy']), faceLeft: _b(it['faceLeft']));
      case 'glasses':
        c.scale(s);
        more.drawGlasses(c, 0, 0, heart: !_b(it['plain']));
      case 'partyHat':
        c.scale(s);
        lvl.drawPartyHat(c, 0, 0);
      case 'present':
        c.scale(s);
        lvl.drawPresent(c, 0, 0);
      case 'teacup':
        c.scale(s);
        more.drawTeacup(c, 0, 0);
      case 'cupcake':
        c.scale(s);
        lvl.drawCupcake(c, 0, 0);
        // the book draws the flame in ink; unlit = paper over it, lit = Star Quest's one accent colour (fire)
        c.drawRect(const Rect.fromLTWH(-7, -59, 14, 12.6), Paint()..color = ink.Pal.paper);
        if (_b(it['lit'])) {
          final f = 1 + math.sin(t * 22) * 0.12;
          final flame = Path()
            ..moveTo(0, -46 - 12 * f)
            ..quadraticBezierTo(6, -52, 0, -47)
            ..quadraticBezierTo(-6, -52, 0, -46 - 12 * f);
          c.drawPath(flame, Paint()..color = ink.Pal.glow);
          c.drawPath(flame, Paint()
            ..color = ink.Pal.ink
            ..style = PaintingStyle.stroke
            ..strokeWidth = 1.2);
        }
      case 'breath':
        adv.drawBreath(c, Offset.zero, Offset(_n(it['dx'], 1), _n(it['dy'])), _n(it['prog'], 1), t);
      case 'rain':
        more.drawRain(c, t);
      case 'goblin':
        adv.drawGoblin(c, 0, 0, s, t, faceLeft: _b(it['faceLeft']), sleeping: _b(it['sleeping']));
      case 'thing':
        inkp.drawThing(c, tasks.Thing(id: 'x', kind: it['kind'] as String, x: 0, y: 0, seed: _n(it['seed'], 3).toInt()), t);
      case 'critter':
        inkp.drawCritter(c, it['kind'] as String, 0, 0, t, _n(it['age'], 9));
      case 'nixTail':
        more.drawNixTail(c, 0, 0, t, wiggle: _b(it['wiggle']));
      case 'speechInk':
        ink.drawSpeech(c, 0, 0, it['text'] as String);
    }
    if (alpha < 1) c.restore();
    c.restore();
  }

  /* ---------------- expressions drawn over the game's art ---------------- */

  static Paint _f(Color col) => Paint()..color = col;
  static Paint _st(Color col, double w) => Paint()
    ..color = col
    ..style = PaintingStyle.stroke
    ..strokeWidth = w
    ..strokeCap = StrokeCap.round;

  /// Rex's eye is at (34,-67) r5 with the brow from (29,-74) to (39,-73), in his own units.
  void _rexFace(Canvas c, Map it) {
    const body = Color(0xFF5FB34A), dark = Color(0xFF3C7D2E);
    _eye(c, it['eye'] as String?, const Offset(34, -67), 5, body, dark, const Offset(29, -74), const Offset(39, -73), _n(it['look']));
    if (_b(it['blush'])) c.drawOval(Rect.fromCenter(center: const Offset(33, -58), width: 11, height: 6), _f(const Color(0x99FF7FA0)));
    _drops(c, it, const Offset(46, -80), const Offset(30, -60));
  }

  void _friendFace(Canvas c, Map it, String kind) {
    final fly = kind == 'ptera' || kind == 'wren';
    final main = const {
      'tri': Color(0xFFEC9A3F), 'stego': Color(0xFF4F95DB), 'ptera': Color(0xFFEF77A8),
      'ankylo': Color(0xFFA98457), 'wren': Color(0xFFA99CC8)}[kind]!;
    final eye = fly ? const Offset(17, -29) : const Offset(32, -31);
    _eye(c, it['eye'] as String?, eye, fly ? 3.4 : 4.2, main, const Color(0xFF1B1B1B), eye + const Offset(-4, -6), eye + const Offset(4, -6), _n(it['look']));
    if (_b(it['blush'])) c.drawOval(Rect.fromCenter(center: eye + const Offset(1, 7), width: 8, height: 4), _f(const Color(0x99FF7FA0)));
    _drops(c, it, eye + const Offset(10, -10), eye + const Offset(1, 4));
  }

  void _raptorFace(Canvas c, Map it) {
    final boss = _b(it['boss']);
    final col = boss ? const Color(0xFF5B2A86) : const Color(0xFF8A5AC6);
    _eye(c, it['eye'] as String?, const Offset(29, -56), 3.4, col, const Color(0xFF111111), const Offset(24, -61), const Offset(33, -60), _n(it['look']));
    if (_b(it['blush'])) c.drawOval(Rect.fromCenter(center: const Offset(30, -50), width: 8, height: 4), _f(const Color(0x99FF7FA0)));
    _drops(c, it, const Offset(36, -66), const Offset(29, -52));
  }

  /// Replaces the eye with an expression. [look] shifts the pupil (-1 back, +1 forward).
  void _eye(Canvas c, String? kind, Offset e, double r, Color skin, Color dark, Offset b1, Offset b2, double look) {
    if (kind == null || kind == 'normal') {
      if (look != 0) {
        c.drawCircle(e, r, _f(Colors.white));
        c.drawCircle(e + Offset(look * r * 0.45, 0), r * 0.52, _f(const Color(0xFF1B1B1B)));
      }
      return;
    }
    c.drawCircle(e, r + 1.2, _f(skin));
    switch (kind) {
      case 'happy': // ^ ^
        c.drawPath(Path()
          ..moveTo(e.dx - r, e.dy + 1.5)
          ..quadraticBezierTo(e.dx, e.dy - r * 1.3, e.dx + r, e.dy + 1.5), _st(const Color(0xFF1B1B1B), r * 0.45));
      case 'closed':
        c.drawLine(e + Offset(-r, 0.5), e + Offset(r, 0.5), _st(const Color(0xFF1B1B1B), r * 0.4));
      case 'wide':
        c.drawCircle(e, r * 1.45, _f(Colors.white));
        c.drawCircle(e, r * 1.45, _st(const Color(0x33000000), 0.8));
        c.drawCircle(e + Offset(look * r * 0.5, 0), r * 0.42, _f(const Color(0xFF1B1B1B)));
      case 'sad':
        c.drawCircle(e + const Offset(0, 1), r * 0.9, _f(Colors.white));
        c.drawCircle(e + const Offset(0.5, 2), r * 0.48, _f(const Color(0xFF1B1B1B)));
        c.drawLine(b1 + const Offset(0, 2), b2 + const Offset(0, -2), _st(dark, 2));
      case 'angry':
        c.drawCircle(e, r * 0.9, _f(Colors.white));
        c.drawCircle(e + const Offset(1, 0.5), r * 0.5, _f(const Color(0xFF1B1B1B)));
        c.drawLine(b1 + const Offset(0, -2), b2 + const Offset(0, 3), _st(dark, 2.4));
      case 'dizzy':
        final p = _st(const Color(0xFF1B1B1B), r * 0.35);
        c.drawLine(e + Offset(-r * .8, -r * .8), e + Offset(r * .8, r * .8), p);
        c.drawLine(e + Offset(-r * .8, r * .8), e + Offset(r * .8, -r * .8), p);
      case 'stars':
        c.drawPath(ink.starPath(e.dx, e.dy, r * 1.25, r * 0.55), _f(const Color(0xFFFFCF4D)));
        c.drawPath(ink.starPath(e.dx, e.dy, r * 1.25, r * 0.55), _st(const Color(0xFF8A5A10), 0.8));
    }
  }

  void _drops(Canvas c, Map it, Offset sweatAt, Offset tearAt) {
    void drop(Offset p, double s) {
      c.drawPath(
          Path()
            ..moveTo(p.dx, p.dy - 5 * s)
            ..quadraticBezierTo(p.dx + 3.4 * s, p.dy, p.dx, p.dy + 2 * s)
            ..quadraticBezierTo(p.dx - 3.4 * s, p.dy, p.dx, p.dy - 5 * s),
          _f(const Color(0xFF8CCBFF)));
    }

    if (_b(it['sweat'])) drop(sweatAt, 1.3);
    if (_b(it['tear'])) drop(tearAt + Offset(0, (_n(it['t']) * 18) % 10), 0.9);
  }
}
