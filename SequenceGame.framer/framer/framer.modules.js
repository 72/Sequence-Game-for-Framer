require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"SequenceBoard":[function(require,module,exports){

/*
Sequence!

1. Put this file in your /modules folder.

2. Import it at the top of your Framer project.
{SequenceBoard} = require "SequenceBoard"

3. Initialize Board.
board = new SequenceBoard

contact:
@72mena
 */
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.SequenceBoard = (function(superClass) {
  extend(SequenceBoard, superClass);

  function SequenceBoard(options) {
    var base, base1, base2, base3, base4, base5, base6, base7, base8, base9;
    this.options = options != null ? options : {};
    this.startGame = bind(this.startGame, this);
    this.resetGame = bind(this.resetGame, this);
    this.endGame = bind(this.endGame, this);
    this.enableClicks = bind(this.enableClicks, this);
    this.disableClicks = bind(this.disableClicks, this);
    this.runRotation = bind(this.runRotation, this);
    this.showHighlightEffectAbove = bind(this.showHighlightEffectAbove, this);
    this.tileDidClick = bind(this.tileDidClick, this);
    this.getRandomNumber = bind(this.getRandomNumber, this);
    this.showChallenge = bind(this.showChallenge, this);
    this.buildSequence = bind(this.buildSequence, this);
    this.setup = bind(this.setup, this);
    if ((base = this.options).boardMatrix == null) {
      base.boardMatrix = 3;
    }
    if ((base1 = this.options).mode == null) {
      base1.mode = 'Normal';
    }
    if ((base2 = this.options).sequenceLength == null) {
      base2.sequenceLength = 2;
    }
    if ((base3 = this.options).gutter == null) {
      base3.gutter = 8;
    }
    if ((base4 = this.options).tileSize == null) {
      base4.tileSize = 100;
    }
    if ((base5 = this.options).tileRadius == null) {
      base5.tileRadius = 6;
    }
    if ((base6 = this.options).tileColor == null) {
      base6.tileColor = 'white';
    }
    if ((base7 = this.options).hintColor == null) {
      base7.hintColor = '#28AFFA';
    }
    if ((base8 = this.options).autoStart == null) {
      base8.autoStart = true;
    }
    if ((base9 = this.options).backgroundColor == null) {
      base9.backgroundColor = null;
    }
    SequenceBoard.__super__.constructor.call(this, this.options);
    this.sequence = [];
    this.tiles = [];
    this.stepInSequence = 0;
    this.itemInSequence = 0;
    this.degrees = 90;
    this.level = 0;
    this.random = 0;
    this.counter = 0;
    this.playerSequence = [];
    this.boardMatrix = this.options.boardMatrix;
    this.mode = this.options.mode;
    this.sequenceLength = this.options.sequenceLength;
    this.rows = this.cols = this.boardMatrix;
    this.gutter = this.options.gutter;
    this.tileWidth = this.options.tileSize;
    this.tileHeight = this.options.tileSize;
    this.tileRadius = this.options.tileRadius;
    this.tileColor = this.options.tileColor;
    this.hintColor = this.options.hintColor;
    this.autoStart = this.options.autoStart;
    this.setup();
    this.disableClicks();
    this.buildSequence();
    if (this.autoStart) {
      Utils.delay(2, (function(_this) {
        return function() {
          return _this.showChallenge();
        };
      })(this));
    }
  }

  SequenceBoard.prototype.setup = function() {

    /*
    		Main wrapper: Container
     */
    var colIndex, j, k, ref, ref1, rowIndex;
    this.container = new Layer({
      name: 'Container',
      width: (this.tileWidth * this.boardMatrix) + (this.gutter * (this.boardMatrix - 1)),
      height: (this.tileWidth * this.boardMatrix) + (this.gutter * (this.boardMatrix - 1)),
      backgroundColor: null,
      clip: false,
      parent: this
    });
    this.width = this.container.maxX;
    this.height = this.container.maxY;

    /*
    		Board. Based on Matrix value
     */
    for (rowIndex = j = 0, ref = this.rows; 0 <= ref ? j < ref : j > ref; rowIndex = 0 <= ref ? ++j : --j) {
      for (colIndex = k = 0, ref1 = this.cols; 0 <= ref1 ? k < ref1 : k > ref1; colIndex = 0 <= ref1 ? ++k : --k) {
        this.tile = new Layer({
          name: "tile" + this.counter,
          width: this.tileWidth,
          height: this.tileHeight,
          x: colIndex * (this.tileWidth + this.gutter),
          y: rowIndex * (this.tileHeight + this.gutter),
          borderRadius: this.tileRadius,
          backgroundColor: this.tileColor,
          parent: this.container
        });
        this.tile.states.add({
          atRotate: {
            scale: 0.75
          },
          dismiss: {
            scale: 0,
            rotation: Math.floor(Math.random() * 180)
          },
          answer: {
            rotation: 360,
            scale: 1.5
          }
        });
        this.tile.states.animationOptions = {
          curve: "spring(800,30,0)"
        };
        this.tile.on(Events.Click, (function(_this) {
          return function(event, layer) {
            return _this.tileDidClick(layer);
          };
        })(this));
        this.counter++;
        this.tiles.push(this.tile);
      }
    }

    /*
    		Hidden tile to be used for the highlight effect
     */
    this.highlight = new Layer({
      name: 'Highlight',
      width: this.tileWidth,
      height: this.tileHeight,
      borderRadius: this.tileRadius,
      backgroundColor: this.hintColor,
      opacity: 0,
      parent: this.container
    });
    this.highlight.states.add({
      highlight: {
        opacity: 1,
        scale: 1.2
      },
      hide: {
        opacity: 0,
        scale: 1
      }
    });
    return this.highlight.states.animationOptions = {
      curve: "spring(300,50,0)"
    };
  };

  SequenceBoard.prototype.buildSequence = function() {
    var j, number, ref, results;
    results = [];
    for (number = j = 0, ref = this.sequenceLength; 0 <= ref ? j < ref : j > ref; number = 0 <= ref ? ++j : --j) {
      results.push(this.sequence.push(this.getRandomNumber()));
    }
    return results;
  };

  SequenceBoard.prototype.showChallenge = function() {
    var i, j, len, number, ref, results;
    this.level++;
    this.itemInSequence = 0;
    ref = this.sequence;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      number = ref[i];
      results.push(setTimeout(((function(_this) {
        return function() {
          var currentHint, currentTile;
          currentHint = _this.sequence[_this.itemInSequence];
          currentTile = _this.tiles[currentHint];
          _this.showHighlightEffectAbove(currentTile);
          _this.itemInSequence++;
          if (_this.itemInSequence === _this.sequence.length) {
            return Utils.delay(0.5, function() {
              return _this.enableClicks();
            });
          }
        };
      })(this)), 600 * i));
    }
    return results;
  };

  SequenceBoard.prototype.getRandomNumber = function() {
    this.random = Math.floor(Math.random() * (this.boardMatrix * this.boardMatrix));
    if (this.sequence[this.sequence.length - 1] === void 0) {
      return this.random;
    } else {
      if (this.mode === 'Normal') {
        if (this.random === this.sequence[this.sequence.length - 1]) {
          if (this.random === this.sequence[this.sequence.length - 2]) {
            return this.getRandomNumber();
          } else {
            return this.random;
          }
        } else {
          return this.random;
        }
      } else if (this.mode === 'Hard') {
        if (this.random === this.sequence[this.sequence.length - 1]) {
          return this.getRandomNumber();
        } else {
          return this.random;
        }
      }
    }
  };

  SequenceBoard.prototype.tileDidClick = function(tile) {
    var checkTile;
    checkTile = this.sequence[this.stepInSequence];
    if (tile.name === this.tiles[checkTile].name) {
      this.showHighlightEffectAbove(tile);
      if (this.stepInSequence === this.sequence.length - 1) {
        this.disableClicks();
        return Utils.delay(0.5, (function(_this) {
          return function() {
            _this.stepInSequence = 0;
            _this.sequence.push(_this.getRandomNumber());
            return _this.runRotation();
          };
        })(this));
      } else {
        return this.stepInSequence++;
      }
    } else {
      this.disableClicks();
      this.highlight.backgroundColor = "#FF0000";
      this.showHighlightEffectAbove(tile);
      return this.endGame(this.tiles[checkTile]);
    }
  };

  SequenceBoard.prototype.showHighlightEffectAbove = function(tile) {
    this.highlight.x = tile.x;
    this.highlight.y = tile.y;
    this.highlight.states["switch"]("highlight");
    return Utils.delay(0.25, (function(_this) {
      return function() {
        return _this.highlight.states["switch"]("hide");
      };
    })(this));
  };

  SequenceBoard.prototype.runRotation = function() {
    var j, len, ref, tile;
    ref = this.tiles;
    for (j = 0, len = ref.length; j < len; j++) {
      tile = ref[j];
      tile.states["switch"]("atRotate");
    }
    Utils.delay(0.7, (function(_this) {
      return function() {
        var k, len1, ref1, results;
        ref1 = _this.tiles;
        results = [];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          tile = ref1[k];
          results.push(tile.states["switch"]("default"));
        }
        return results;
      };
    })(this));
    Utils.delay(0.15, (function(_this) {
      return function() {
        return _this.container.animate({
          properties: {
            rotation: _this.container.rotation + _this.degrees
          },
          curve: "spring(50,8,0)"
        });
      };
    })(this));
    return Utils.delay(1.2, (function(_this) {
      return function() {
        return _this.showChallenge();
      };
    })(this));
  };

  SequenceBoard.prototype.disableClicks = function() {
    var j, len, ref, results, tile;
    ref = this.tiles;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      tile = ref[j];
      results.push(tile.ignoreEvents = true);
    }
    return results;
  };

  SequenceBoard.prototype.enableClicks = function() {
    var j, len, ref, results, tile;
    ref = this.tiles;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      tile = ref[j];
      results.push(tile.ignoreEvents = false);
    }
    return results;
  };

  SequenceBoard.prototype.endGame = function(correctTile) {
    var j, len, ref, tile;
    ref = this.tiles;
    for (j = 0, len = ref.length; j < len; j++) {
      tile = ref[j];
      if (tile.name === correctTile.name) {
        tile.states.animationOptions = {
          curve: "spring(200,70,0)"
        };
        tile.states["switch"]("answer");
      } else {
        tile.states.animationOptions = {
          curve: "spring(200,50,0)"
        };
        tile.states["switch"]("dismiss");
      }
    }
    this.playerSequence = this.sequence.slice(0, this.stepInSequence);
    return this.emit('Events.GameEnded');
  };

  SequenceBoard.prototype.resetGame = function() {
    var j, len, ref, tile;
    this.container.destroy();
    this.highlight.destroy();
    ref = this.tiles;
    for (j = 0, len = ref.length; j < len; j++) {
      tile = ref[j];
      tile.destroy();
    }
    this.sequence = [];
    this.tiles = [];
    this.stepInSequence = 0;
    this.itemInSequence = 0;
    this.degrees = 90;
    this.level = 0;
    this.random = 0;
    this.sequenceLength = this.options.sequenceLength;
    this.counter = 0;
    this.playerSequence = [];
    this.setup();
    this.disableClicks();
    this.buildSequence();
    if (this.autoStart) {
      return Utils.delay(2, (function(_this) {
        return function() {
          return _this.showChallenge();
        };
      })(this));
    }
  };

  SequenceBoard.prototype.startGame = function() {
    return this.showChallenge();
  };

  return SequenceBoard;

})(Layer);


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2V0ZW50YXlkb3MvT25lRHJpdmUvRG9jdW1lbnRzLzcyL1Byb2plY3RzL09uZ29pbmcgLSBTZXF1ZW5jZS9TZXF1ZW5jZUdhbWUvU2VxdWVuY2VHYW1lLmZyYW1lci9tb2R1bGVzL1NlcXVlbmNlQm9hcmQuY29mZmVlIiwiL1VzZXJzL3NldGVudGF5ZG9zL09uZURyaXZlL0RvY3VtZW50cy83Mi9Qcm9qZWN0cy9PbmdvaW5nIC0gU2VxdWVuY2UvU2VxdWVuY2VHYW1lL1NlcXVlbmNlR2FtZS5mcmFtZXIvbW9kdWxlcy9teU1vZHVsZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQTs7OztBQWdCTSxPQUFPLENBQUM7OztFQUVBLHVCQUFDLE9BQUQ7QUFHWixRQUFBO0lBSGEsSUFBQyxDQUFBLDRCQUFELFVBQVM7Ozs7Ozs7Ozs7Ozs7O1VBR2QsQ0FBQyxjQUFlOzs7V0FDaEIsQ0FBQyxPQUFROzs7V0FDVCxDQUFDLGlCQUFrQjs7O1dBQ25CLENBQUMsU0FBVTs7O1dBQ1gsQ0FBQyxXQUFZOzs7V0FDYixDQUFDLGFBQWM7OztXQUNmLENBQUMsWUFBYTs7O1dBQ2QsQ0FBQyxZQUFhOzs7V0FDZCxDQUFDLFlBQWE7OztXQUNkLENBQUMsa0JBQW1COztJQUU1QiwrQ0FBTSxJQUFDLENBQUEsT0FBUDtJQUdBLElBQUMsQ0FBQSxRQUFELEdBQVk7SUFDWixJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFDbEIsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFDbEIsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUNYLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFDVCxJQUFDLENBQUEsTUFBRCxHQUFVO0lBQ1YsSUFBQyxDQUFBLE9BQUQsR0FBVztJ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QWUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNkLEtBQUMsQ0FBQSxhQUFELENBQUE7UUFEYztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZixFQUREOztFQXJCVTs7MEJBMEJYLFNBQUEsR0FBVyxTQUFBO1dBQ1YsSUFBQyxDQUFBLGFBQUQsQ0FBQTtFQURVOzs7O0dBL1J3Qjs7OztBQ1pwQyxPQUFPLENBQUMsS0FBUixHQUFnQjs7QUFFaEIsT0FBTyxDQUFDLFVBQVIsR0FBcUIsU0FBQTtTQUNwQixLQUFBLENBQU0sdUJBQU47QUFEb0I7O0FBR3JCLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMjI1xuU2VxdWVuY2UhXG5cbjEuIFB1dCB0aGlzIGZpbGUgaW4geW91ciAvbW9kdWxlcyBmb2xkZXIuXG5cbjIuIEltcG9ydCBpdCBhdCB0aGUgdG9wIG9mIHlvdXIgRnJhbWVyIHByb2plY3QuXG57U2VxdWVuY2VCb2FyZH0gPSByZXF1aXJlIFwiU2VxdWVuY2VCb2FyZFwiXG5cbjMuIEluaXRpYWxpemUgQm9hcmQuXG5ib2FyZCA9IG5ldyBTZXF1ZW5jZUJvYXJkXG5cbmNvbnRhY3Q6XG5ANzJtZW5hXG5cbiMjI1xuXG5jbGFzcyBleHBvcnRzLlNlcXVlbmNlQm9hcmQgZXh0ZW5kcyBMYXllclxuXG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnM9e30pIC0+XG5cblx0XHQjIFNldCBEZWZhdWx0c1xuXHRcdEBvcHRpb25zLmJvYXJkTWF0cml4ID89IDNcblx0XHRAb3B0aW9ucy5tb2RlID89ICdOb3JtYWwnXG5cdFx0QG9wdGlvbnMuc2VxdWVuY2VMZW5ndGggPz0gMlxuXHRcdEBvcHRpb25zLmd1dHRlciA/PSA4XG5cdFx0QG9wdGlvbnMudGlsZVNpemUgPz0gMTAwXG5cdFx0QG9wdGlvbnMudGlsZVJhZGl1cyA/PSA2XG5cdFx0QG9wdGlvbnMudGlsZUNvbG9yID89ICd3aGl0ZSdcblx0XHRAb3B0aW9ucy5oaW50Q29sb3IgPz0gJyMyOEFGRkEnXG5cdFx0QG9wdGlvbnMuYXV0b1N0YXJ0ID89IHRydWVcblx0XHRAb3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gbnVsbFxuXG5cdFx0c3VwZXIgQG9wdGlvbnNcblxuXHRcdCMgVmFyc1xuXHRcdEBzZXF1ZW5jZSA9IFtdXHRcdFx0XHRcdCMgaG9sZHMgc2VxdWVuY2UgZGF0YVxuXHRcdEB0aWxlcyA9IFtdXHRcdFx0XHRcdFx0IyBob2xkcyAndGlsZScgb2JqZWN0c1xuXHRcdEBzdGVwSW5TZXF1ZW5jZSA9IDBcdFx0XHRcdCMgdHJhY2tzIGN1cnJlbnQgc3RlcCBtYWRlIGJ5IHBsYXllclxuXHRcdEBpdGVtSW5TZXF1ZW5jZSA9IDBcdFx0XHRcdCMgdHJhY2tzIGl0ZW1zIHdpdGhpbiBzZXF1ZW5jZSBkYXRhXG5cdFx0QGRlZ3JlZXMgPSA5MFx0XHRcdFx0XHQjIFJvdGF0aW9uIHZhbHVlLiBUbyBiZSB1c2VkIGluIGZ1dHVyZSBnYW1lIG1vZGVzLlxuXHRcdEBsZXZlbCA9IDBcdFx0XHRcdFx0XHQjIFRyYWNrcyBsZXZlbFxuXHRcdEByYW5kb20gPSAwXHRcdFx0XHRcdFx0IyBSYW5kb20gbnVtYmVyIHRvIGJlIHVzZWQgaW4gdGhlIHNlcXVlbmNlXG5cdFx0QGNvdW50ZXIgPSAwXHRcdFx0XHRcdCMgVXNlZCBmb3IgbmFtaW5nIHRpbGVzXG5cdFx0QHBsYXllclNlcXVlbmNlID0gW11cdFx0XHQjIFRyYWNrIHBsYXllcidzIGlucHV0LlxuXG5cdFx0IyBTZXR0aW5nc1xuXHRcdEBib2FyZE1hdHJpeCA9IEBvcHRpb25zLmJvYXJkTWF0cml4XG5cdFx0QG1vZGUgPSBAb3B0aW9ucy5tb2RlXG5cdFx0QHNlcXVlbmNlTGVuZ3RoID0gQG9wdGlvbnMuc2VxdWVuY2VMZW5ndGhcblx0XHRAcm93cyA9IEBjb2xzID0gQGJvYXJkTWF0cml4XG5cdFx0QGd1dHRlciA9IEBvcHRpb25zLmd1dHRlclxuXHRcdEB0aWxlV2lkdGggID0gQG9wdGlvbnMudGlsZVNpemVcblx0XHRAdGlsZUhlaWdodCA9IEBvcHRpb25zLnRpbGVTaXplXG5cdFx0QHRpbGVSYWRpdXMgPSBAb3B0aW9ucy50aWxlUmFkaXVzXG5cdFx0QHRpbGVDb2xvciA9IEBvcHRpb25zLnRpbGVDb2xvclxuXHRcdEBoaW50Q29sb3IgPSBAb3B0aW9ucy5oaW50Q29sb3Jcblx0XHRAYXV0b1N0YXJ0ID0gQG9wdGlvbnMuYXV0b1N0YXJ0XG5cblx0XHQjIEluaXRcblx0XHRAc2V0dXAoKVxuXHRcdEBkaXNhYmxlQ2xpY2tzKClcblx0XHRAYnVpbGRTZXF1ZW5jZSgpXG5cdFx0aWYgQGF1dG9TdGFydFxuXHRcdFx0VXRpbHMuZGVsYXkgMiwgPT5cblx0XHRcdFx0QHNob3dDaGFsbGVuZ2UoKVxuXG5cblxuXHRzZXR1cDogKCkgPT5cblxuXHRcdCMjI1xuXHRcdE1haW4gd3JhcHBlcjogQ29udGFpbmVyXG5cdFx0IyMjXG5cdFx0QGNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdFx0bmFtZTogJ0NvbnRhaW5lcidcblx0XHRcdHdpZHRoOiAoQHRpbGVXaWR0aCpAYm9hcmRNYXRyaXgpKyhAZ3V0dGVyKihAYm9hcmRNYXRyaXgtMSkpXG5cdFx0XHRoZWlnaHQ6IChAdGlsZVdpZHRoKkBib2FyZE1hdHJpeCkrKEBndXR0ZXIqKEBib2FyZE1hdHJpeC0xKSlcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXHRcdFx0Y2xpcDogZmFsc2Vcblx0XHRcdHBhcmVudDogQFxuXG5cdFx0QHdpZHRoID0gQGNvbnRhaW5lci5tYXhYXG5cdFx0QGhlaWdodCA9IEBjb250YWluZXIubWF4WVxuXG5cdFx0IyMjXG5cdFx0Qm9hcmQuIEJhc2VkIG9uIE1hdHJpeCB2YWx1ZVxuXHRcdCMjI1xuXHRcdGZvciByb3dJbmRleCBpbiBbMC4uLkByb3dzXVxuXHRcdFx0Zm9yIGNvbEluZGV4IGluIFswLi4uQGNvbHNdXG5cdFx0XHRcdEB0aWxlID0gbmV3IExheWVyXG5cdFx0XHRcdFx0bmFtZTogXCJ0aWxlXCIrQGNvdW50ZXJcblx0XHRcdFx0XHR3aWR0aDogIEB0aWxlV2lkdGhcblx0XHRcdFx0XHRoZWlnaHQ6IEB0aWxlSGVpZ2h0XG5cdFx0XHRcdFx0eDogY29sSW5kZXggKiAoQHRpbGVXaWR0aCArIEBndXR0ZXIpXG5cdFx0XHRcdFx0eTogcm93SW5kZXggKiAoQHRpbGVIZWlnaHQgKyBAZ3V0dGVyKVxuXHRcdFx0XHRcdGJvcmRlclJhZGl1czogQHRpbGVSYWRpdXNcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IEB0aWxlQ29sb3Jcblx0XHRcdFx0XHRwYXJlbnQ6IEBjb250YWluZXJcblx0XHRcdFx0QHRpbGUuc3RhdGVzLmFkZFxuXHRcdFx0XHRcdGF0Um90YXRlOlxuXHRcdFx0XHRcdFx0c2NhbGU6IDAuNzVcblx0XHRcdFx0XHRkaXNtaXNzOlxuXHRcdFx0XHRcdFx0c2NhbGU6IDBcblx0XHRcdFx0XHRcdHJvdGF0aW9uOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTgwKVxuXHRcdFx0XHRcdGFuc3dlcjpcblx0XHRcdFx0XHRcdHJvdGF0aW9uOiAzNjBcblx0XHRcdFx0XHRcdHNjYWxlOiAxLjVcblx0XHRcdFx0QHRpbGUuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdFx0XHRcdGN1cnZlOiBcInNwcmluZyg4MDAsMzAsMClcIlxuXHRcdFx0XHRAdGlsZS5vbiBFdmVudHMuQ2xpY2ssIChldmVudCwgbGF5ZXIpID0+XG5cdFx0XHRcdFx0QHRpbGVEaWRDbGljayhsYXllcilcblx0XHRcdFx0QGNvdW50ZXIrK1xuXHRcdFx0XHRAdGlsZXMucHVzaChAdGlsZSlcblxuXHRcdCMjI1xuXHRcdEhpZGRlbiB0aWxlIHRvIGJlIHVzZWQgZm9yIHRoZSBoaWdobGlnaHQgZWZmZWN0XG5cdFx0IyMjXG5cdFx0QGhpZ2hsaWdodCA9IG5ldyBMYXllclxuXHRcdFx0bmFtZTogJ0hpZ2hsaWdodCdcblx0XHRcdHdpZHRoOiAgQHRpbGVXaWR0aFxuXHRcdFx0aGVpZ2h0OiBAdGlsZUhlaWdodFxuXHRcdFx0Ym9yZGVyUmFkaXVzOiBAdGlsZVJhZGl1c1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBAaGludENvbG9yXG5cdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRwYXJlbnQ6IEBjb250YWluZXJcblx0XHRAaGlnaGxpZ2h0LnN0YXRlcy5hZGRcblx0XHRcdGhpZ2hsaWdodDpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRzY2FsZTogMS4yXG5cdFx0XHRoaWRlOlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0QGhpZ2hsaWdodC5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9XG5cdFx0XHRjdXJ2ZTogXCJzcHJpbmcoMzAwLDUwLDApXCJcblxuXG5cblx0YnVpbGRTZXF1ZW5jZTogKCkgPT5cblx0XHRmb3IgbnVtYmVyIGluIFswLi4uQHNlcXVlbmNlTGVuZ3RoXVxuXHRcdFx0QHNlcXVlbmNlLnB1c2ggQGdldFJhbmRvbU51bWJlcigpXG5cblxuXG5cdHNob3dDaGFsbGVuZ2U6ICgpID0+XG5cdFx0QGxldmVsKytcblx0XHRAaXRlbUluU2VxdWVuY2UgPSAwXG5cdFx0Zm9yIG51bWJlciwgaSBpbiBAc2VxdWVuY2Vcblx0XHRcdHNldFRpbWVvdXQgKCA9PlxuXHRcdFx0XHRjdXJyZW50SGludCA9IEBzZXF1ZW5jZVtAaXRlbUluU2VxdWVuY2VdXG5cdFx0XHRcdGN1cnJlbnRUaWxlID0gQHRpbGVzW2N1cnJlbnRIaW50XVxuXHRcdFx0XHRAc2hvd0hpZ2hsaWdodEVmZmVjdEFib3ZlKGN1cnJlbnRUaWxlKVxuXHRcdFx0XHRAaXRlbUluU2VxdWVuY2UrK1xuXHRcdFx0XHQjRG8gc29tZXRoaW5nIGFmdGVyIHNlcXVlbmNlIGVuZHNcblx0XHRcdFx0aWYgQGl0ZW1JblNlcXVlbmNlID09IChAc2VxdWVuY2UubGVuZ3RoKVxuXHRcdFx0XHRcdFV0aWxzLmRlbGF5IDAuNSwgPT5cblx0XHRcdFx0XHRcdEBlbmFibGVDbGlja3MoKVxuXHRcdFx0KSwgNjAwKmlcblxuXG5cblx0IyBJIGNhbWUgdXAgd2l0aCB0aGlzIHJlY3Vyc2l2ZSBmdW5jdGlvbiB0aGF0IGxldHMgeW91IGhhdmUgdHdvIGRpZmZlcmVudCBvdXRjb21lcyB3aXRoIHRoZSByYW5kb20gbnVtYmVyLCBkZXBlbmRpbmcgd2hldGhlciB0aGUgZ2FtZSBtb2RlIGlzIE5vcm1hbCBvciBIYXJkLlxuXHQjIFBsZWFzZSByZWFjaCBvdXQgaWYgeW91IGhhdmUgYSBiZXR0ZXIgc29sdXRpb24hXG5cdGdldFJhbmRvbU51bWJlcjogKCkgPT5cblxuXHRcdCMgT3VyIGhlcm8gcmFuZG9tIG51bWJlciBmb3IgdGhpcyBpdGVyYXRpb24uXG5cdFx0QHJhbmRvbSA9IChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKEBib2FyZE1hdHJpeCpAYm9hcmRNYXRyaXgpKSlcblxuXHRcdCMgRmlyc3QgdGltZSBydW4gYXMgbm9ybWFsLlxuXHRcdGlmIEBzZXF1ZW5jZVtAc2VxdWVuY2UubGVuZ3RoLTFdIGlzIHVuZGVmaW5lZFxuXHRcdFx0cmV0dXJuIEByYW5kb21cblxuXHRcdCMgU3Vic2VxdWVudCB0aW1lcywgY2hlY2sgZm9yIHJlcGV0aXRpdmUgbnVtYmVyc1xuXHRcdGVsc2VcblxuXHRcdFx0IyBJbiBOb3JtYWwgbW9kZSwgbGV0IHRoZXJlIGJlIHRoZSBzYW1lIHJhbmRvbSBudW1iZXIgdHdpY2UgaW4gYSByb3cuXG5cdFx0XHRpZiBAbW9kZSBpcyAnTm9ybWFsJ1xuXHRcdFx0XHRpZiBAcmFuZG9tID09IEBzZXF1ZW5jZVtAc2VxdWVuY2UubGVuZ3RoLTFdXG5cdFx0XHRcdFx0aWYgQHJhbmRvbSA9PSBAc2VxdWVuY2VbQHNlcXVlbmNlLmxlbmd0aC0yXVxuXHRcdFx0XHRcdFx0I3ByaW50ICdVc2luZyByZWN1cnNpb24gZm9yIG51bWJlcjonLCBAcmFuZG9tLCAnYXQgcG9zOicsIEBzZXF1ZW5jZS5sZW5ndGhcblx0XHRcdFx0XHRcdEBnZXRSYW5kb21OdW1iZXIoKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiBAcmFuZG9tXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm4gQHJhbmRvbVxuXG5cdFx0XHQjIEluIEhhcmQgbW9kZSwgcHJldmVudCBhbnkgZHVwbGljYXRlcy5cblx0XHRcdGVsc2UgaWYgQG1vZGUgaXMgJ0hhcmQnXG5cdFx0XHRcdGlmIEByYW5kb20gPT0gQHNlcXVlbmNlW0BzZXF1ZW5jZS5sZW5ndGgtMV1cblx0XHRcdFx0XHQjcHJpbnQgJ1VzaW5nIHJlY3Vyc2lvbiBmb3IgbnVtYmVyOicsIEByYW5kb20sICdhdCBwb3M6JywgQHNlcXVlbmNlLmxlbmd0aFxuXHRcdFx0XHRcdEBnZXRSYW5kb21OdW1iZXIoKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIEByYW5kb21cblxuXG5cblx0dGlsZURpZENsaWNrOiAodGlsZSkgPT5cblxuXHRcdCNMb2dpYyBmb3IgY2xpY2suIENvbnRpbnVlIHNlcXVlbmNlIG9yIEVuZCBnYW1lLlxuXHRcdGNoZWNrVGlsZSA9IEBzZXF1ZW5jZVtAc3RlcEluU2VxdWVuY2VdXG5cblx0XHQjIElmIFNlcXVlbmNlIGlzIE9LIVxuXHRcdGlmIHRpbGUubmFtZSA9PSBAdGlsZXNbY2hlY2tUaWxlXS5uYW1lXG5cdFx0XHRAc2hvd0hpZ2hsaWdodEVmZmVjdEFib3ZlKHRpbGUpXG5cblx0XHRcdCMgSWYgbGFzdCBpdGVtIGluIFNlcXVlbmNlLCB0aGVuIG1vdmUgdG8gbmV4dCBMZXZlbC5cblx0XHRcdGlmIEBzdGVwSW5TZXF1ZW5jZSA9PSBAc2VxdWVuY2UubGVuZ3RoLTFcblx0XHRcdFx0QGRpc2FibGVDbGlja3MoKVxuXHRcdFx0XHRVdGlscy5kZWxheSAwLjUsID0+XG5cdFx0XHRcdFx0QHN0ZXBJblNlcXVlbmNlID0gMFxuXHRcdFx0XHRcdEBzZXF1ZW5jZS5wdXNoIEBnZXRSYW5kb21OdW1iZXIoKVxuXHRcdFx0XHRcdEBydW5Sb3RhdGlvbigpXG5cblx0XHRcdCMgRWxzZSwganVzdCB3YWl0IGZvciB0aGUgbmV4dCBpbnB1dC5cblx0XHRcdGVsc2Vcblx0XHRcdFx0QHN0ZXBJblNlcXVlbmNlKytcblxuXHRcdCMgSWYgU2VxdWVuY2UgaXMgd3JvbmcsIGVuZCBnYW1lLlxuXHRcdGVsc2Vcblx0XHRcdEBkaXNhYmxlQ2xpY2tzKClcblx0XHRcdEBoaWdobGlnaHQuYmFja2dyb3VuZENvbG9yID0gXCIjRkYwMDAwXCJcblx0XHRcdEBzaG93SGlnaGxpZ2h0RWZmZWN0QWJvdmUodGlsZSlcblx0XHRcdEBlbmRHYW1lKEB0aWxlc1tjaGVja1RpbGVdKVxuXG5cblxuXHRzaG93SGlnaGxpZ2h0RWZmZWN0QWJvdmU6ICh0aWxlKSA9PlxuXHRcdEBoaWdobGlnaHQueCA9IHRpbGUueFxuXHRcdEBoaWdobGlnaHQueSA9IHRpbGUueVxuXHRcdEBoaWdobGlnaHQuc3RhdGVzLnN3aXRjaCBcImhpZ2hsaWdodFwiXG5cdFx0VXRpbHMuZGVsYXkgMC4yNSwgPT5cblx0XHRcdEBoaWdobGlnaHQuc3RhdGVzLnN3aXRjaCBcImhpZGVcIlxuXG5cblxuXHRydW5Sb3RhdGlvbjogKCkgPT5cblx0XHRmb3IgdGlsZSBpbiBAdGlsZXNcblx0XHRcdHRpbGUuc3RhdGVzLnN3aXRjaCBcImF0Um90YXRlXCJcblx0XHRVdGlscy5kZWxheSAwLjcsID0+XG5cdFx0XHRmb3IgdGlsZSBpbiBAdGlsZXNcblx0XHRcdFx0dGlsZS5zdGF0ZXMuc3dpdGNoIFwiZGVmYXVsdFwiXG5cdFx0VXRpbHMuZGVsYXkgMC4xNSwgPT5cblx0XHRcdEBjb250YWluZXIuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHJvdGF0aW9uOiAoQGNvbnRhaW5lci5yb3RhdGlvbikrQGRlZ3JlZXNcblx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDUwLDgsMClcIlxuXHRcdCMgQWZ0ZXIgcm90YXRpb24gYW5pbWF0aW9uLCBzaG93IG5leHQgbGV2ZWxcblx0XHRVdGlscy5kZWxheSAxLjIsID0+XG5cdFx0XHRAc2hvd0NoYWxsZW5nZSgpXG5cblxuXHRkaXNhYmxlQ2xpY2tzOiAoKSA9PlxuXHRcdGZvciB0aWxlIGluIEB0aWxlc1xuXHRcdFx0dGlsZS5pZ25vcmVFdmVudHMgPSB0cnVlXG5cblxuXHRlbmFibGVDbGlja3M6ICgpID0+XG5cdFx0Zm9yIHRpbGUgaW4gQHRpbGVzXG5cdFx0XHR0aWxlLmlnbm9yZUV2ZW50cyA9IGZhbHNlXG5cblxuXHRlbmRHYW1lOiAoY29ycmVjdFRpbGUpID0+XG5cdFx0Zm9yIHRpbGUgaW4gQHRpbGVzXG5cdFx0XHQjIEhpZ2hsaWdodCB3aGF0IHRoZSBjb3JyZWN0IHRpbGUgd2FzLlxuXHRcdFx0aWYgdGlsZS5uYW1lID09IGNvcnJlY3RUaWxlLm5hbWVcblx0XHRcdFx0dGlsZS5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9XG5cdFx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDIwMCw3MCwwKVwiXG5cdFx0XHRcdHRpbGUuc3RhdGVzLnN3aXRjaCBcImFuc3dlclwiXG5cdFx0XHQjIEhpZGUgYWxsIG90aGVycy5cblx0XHRcdGVsc2Vcblx0XHRcdFx0dGlsZS5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9XG5cdFx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDIwMCw1MCwwKVwiXG5cdFx0XHRcdHRpbGUuc3RhdGVzLnN3aXRjaCBcImRpc21pc3NcIlxuXG5cdFx0QHBsYXllclNlcXVlbmNlID0gQHNlcXVlbmNlLnNsaWNlKDAsQHN0ZXBJblNlcXVlbmNlKVxuXHRcdEBlbWl0ICdFdmVudHMuR2FtZUVuZGVkJ1xuXG5cblx0cmVzZXRHYW1lOiAoKSA9PlxuXHRcdCMgRGVzdHJveSBvbGQgVUlcblx0XHRAY29udGFpbmVyLmRlc3Ryb3koKVxuXHRcdEBoaWdobGlnaHQuZGVzdHJveSgpXG5cdFx0Zm9yIHRpbGUgaW4gQHRpbGVzXG5cdFx0XHR0aWxlLmRlc3Ryb3koKVxuXHRcdCMgUmVzZXQgVmFyc1xuXHRcdEBzZXF1ZW5jZSA9IFtdXG5cdFx0QHRpbGVzID0gW11cblx0XHRAc3RlcEluU2VxdWVuY2UgPSAwXG5cdFx0QGl0ZW1JblNlcXVlbmNlID0gMFxuXHRcdEBkZWdyZWVzID0gOTBcblx0XHRAbGV2ZWwgPSAwXG5cdFx0QHJhbmRvbSA9IDBcblx0XHRAc2VxdWVuY2VMZW5ndGggPSBAb3B0aW9ucy5zZXF1ZW5jZUxlbmd0aFxuXHRcdEBjb3VudGVyID0gMFxuXHRcdEBwbGF5ZXJTZXF1ZW5jZSA9IFtdXG5cdFx0IyBJbml0XG5cdFx0QHNldHVwKClcblx0XHRAZGlzYWJsZUNsaWNrcygpXG5cdFx0QGJ1aWxkU2VxdWVuY2UoKVxuXHRcdGlmIEBhdXRvU3RhcnRcblx0XHRcdFV0aWxzLmRlbGF5IDIsID0+XG5cdFx0XHRcdEBzaG93Q2hhbGxlbmdlKClcblxuXG5cdHN0YXJ0R2FtZTogKCkgPT5cblx0XHRAc2hvd0NoYWxsZW5nZSgpXG5cbiIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iXX0=
