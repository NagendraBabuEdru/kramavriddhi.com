// Recording-only hook (NOT part of the real game): lets a script read the runner's state and
// press the same buttons a player would (jump, roar, continue), so promo footage can be captured.
import 'dart:convert';
import 'dart:js_interop';
import 'dart:js_interop_unsafe';

import 'game/rex_game.dart';
import 'game/story.dart';

RexGame? _g;

void registerDemoHook(RexGame g) {
  _g = g;
  globalContext.setProperty('rexState'.toJS, (() => _state().toJS).toJS);
  globalContext.setProperty('rexCmd'.toJS, ((JSString c) => _cmd(c.toDart)).toJS);
}

String _state() {
  final g = _g;
  if (g == null) return 'null';
  final r = g.rex;
  return jsonEncode({
    'mode': g.mode.name,
    'level': g.level,
    'inDialog': g.inDialog,
    'dialogText': g.dialogText,
    'dialogFull': g.inDialog ? g.dialogLineFull : '',
    'speaker': g.inDialog ? g.dialogSpeaker : '',
    'coins': g.coins,
    'goal': g.lv.coins,
    'raptors': g.raptors,
    'hearts': g.hearts,
    'herd': g.herd,
    'dist': g.dist,
    'finished': g.finished,
    'clearing': g.clearing,
    'roarUnlocked': g.roarUnlocked,
    'growT': g.grow?.t,
    'rex': {
      'x': r.x, 'y': r.y, 'vy': r.vy, 'k': r.k, 'onGround': r.onGround, 'swim': r.swim,
      'climb': r.climb != null, 'carried': r.carried, 'jumps': r.jumps, 'roarCd': r.roarCd, 'inv': r.inv,
    },
    'ents': [
      for (final e in g.ents)
        {'type': e.type, 'x': e.x, 'y': e.y, 'cy': e.cy, 'l': e.box.left, 'r': e.box.right, 't': e.box.top, 'b': e.box.bottom}
    ],
    'terrain': [
      for (final s in g.terrain)
        {
          'type': s.type, 'x': s.x, 'w': s.w, 'top': s.top,
          'holes': [for (var i = 0; i < s.planks.length; i++) if (!s.planks[i].solid) i],
        }
    ],
    'boss': g.boss == null
        ? null
        : {'x': g.boss!.x, 'state': g.boss!.state, 'hp': g.boss!.hp, 'dead': g.boss!.dead, 'l': g.boss!.box.left},
    'levels': levels.length,
  });
}

void _cmd(String c) {
  final g = _g;
  if (g == null) return;
  switch (c) {
    case 'jump':
      g.jump();
    case 'release':
      g.jumpRelease();
    case 'roar':
      g.roar();
    case 'next':
      g.advanceDialog();
    case 'continue':
      g.nextLevel();
    default:
      if (c.startsWith('level:')) g.startLevel(int.parse(c.substring(6)));
  }
}
