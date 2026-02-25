(function (global) {
  'use strict';

  function isNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  function validateShadow(shadow) {
    if (!shadow || !isNumber(shadow.x) || !isNumber(shadow.y) || !isNumber(shadow.w) || !isNumber(shadow.h)) {
      throw new Error('Each level needs one valid shadow block with x, y, w, h.');
    }
    if (shadow.w !== 20 || shadow.h !== 20) {
      throw new Error('Shadow block must be exactly 20x20 (same as player).');
    }
  }

  function validateBlock(block, i) {
    if (!isNumber(block.x) || !isNumber(block.y) || !isNumber(block.w) || !isNumber(block.h)) {
      throw new Error('Invalid block at index ' + i + '.');
    }
  }

  function clearCurrentLevel() {
    if (Array.isArray(global.blocks)) {
      global.blocks.length = 0;
    }
    if (Array.isArray(global.blocksInShadow)) {
      global.blocksInShadow.length = 0;
    }
  }

  function applyPlayerStart(level) {
    if (!global.player || !level.playerStart) return;
    if (isNumber(level.playerStart.x)) global.player.x = level.playerStart.x;
    if (isNumber(level.playerStart.y)) global.player.y = level.playerStart.y;
    global.player.moveX = 0;
    global.player.moveY = 0;
  }

  function spawnLevel(level, options) {
    var opts = options || {};
    clearCurrentLevel();

    var blockColor = opts.blockColor || 'rgb(0,0,0)';
    var shadowColor = opts.shadowColor || 'yellow';

    if (!Array.isArray(level.blocks)) {
      throw new Error('Level blocks must be an array.');
    }

    for (var i = 0; i < level.blocks.length; i += 1) {
      var block = level.blocks[i];
      validateBlock(block, i);
      global.addBlock(
        block.name || ('block' + (i + 1)),
        block.x,
        block.y,
        block.w,
        block.h,
        block.color || blockColor,
        isNumber(block.speed) ? block.speed : 0
      );
    }

    validateShadow(level.shadow);
    global.addBlockS(
      level.shadow.name || 'blockS',
      level.shadow.x,
      level.shadow.y,
      level.shadow.w,
      level.shadow.h,
      level.shadow.color || shadowColor,
      isNumber(level.shadow.speed) ? level.shadow.speed : 0,
      function () {
        if (typeof opts.onShadowTouch === 'function') {
          opts.onShadowTouch(level);
          return;
        }
        console.log('Level ' + (level.id || '?') + ' complete');
      }
    );

    applyPlayerStart(level);
    return level;
  }

  async function loadLevels(jsonPath) {
    var res = await fetch(jsonPath);
    if (!res.ok) {
      throw new Error('Failed to load JSON from ' + jsonPath + ' (status ' + res.status + ')');
    }
    var data = await res.json();
    if (!data || !Array.isArray(data.levels)) {
      throw new Error('JSON must contain a levels array.');
    }
    return data;
  }

  async function loadLevelFromJson(jsonPath, levelIndex, options) {
    var data = await loadLevels(jsonPath);
    var idx = isNumber(levelIndex) ? Math.floor(levelIndex) : 0;
    if (idx < 0) idx = 0;
    if (idx >= data.levels.length) idx = data.levels.length - 1;
    var level = data.levels[idx];
    return spawnLevel(level, options);
  }

  async function loadLevelById(jsonPath, levelId, options) {
    var data = await loadLevels(jsonPath);
    var level = null;

    for (var i = 0; i < data.levels.length; i += 1) {
      if (data.levels[i].id === levelId) {
        level = data.levels[i];
        break;
      }
    }

    if (!level) {
      throw new Error('Level id not found: ' + levelId);
    }

    return spawnLevel(level, options);
  }

  global.LevelLoader = {
    loadLevels: loadLevels,
    loadLevelFromJson: loadLevelFromJson,
    loadLevelById: loadLevelById,
    spawnLevel: spawnLevel,
    clearCurrentLevel: clearCurrentLevel
  };
})(window);
