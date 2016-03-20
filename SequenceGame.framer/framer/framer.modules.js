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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2V0ZW50YXlkb3MvR2l0SHViL1NlcXVlbmNlLUdhbWUtZm9yLUZyYW1lci9TZXF1ZW5jZUdhbWUuZnJhbWVyL21vZHVsZXMvU2VxdWVuY2VCb2FyZC5jb2ZmZWUiLCIvVXNlcnMvc2V0ZW50YXlkb3MvR2l0SHViL1NlcXVlbmNlLUdhbWUtZm9yLUZyYW1lci9TZXF1ZW5jZUdhbWUuZnJhbWVyL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBOzs7Ozs7Ozs7Ozs7OztBQUFBLElBQUE7Ozs7QUFnQk0sT0FBTyxDQUFDOzs7RUFFQSx1QkFBQyxPQUFEO0FBR1osUUFBQTtJQUhhLElBQUMsQ0FBQSw0QkFBRCxVQUFTOzs7Ozs7Ozs7Ozs7OztVQUdkLENBQUMsY0FBZTs7O1dBQ2hCLENBQUMsT0FBUTs7O1dBQ1QsQ0FBQyxpQkFBa0I7OztXQUNuQixDQUFDLFNBQVU7OztXQUNYLENBQUMsV0FBWTs7O1dBQ2IsQ0FBQyxhQUFjOzs7V0FDZixDQUFDLFlBQWE7OztXQUNkLENBQUMsWUFBYTs7O1dBQ2QsQ0FBQyxZQUFhOzs7V0FDZCxDQUFDLGtCQUFtQjs7SUFFNUIsK0NBQU0sSUFBQyxDQUFBLE9BQVA7SUFHQSxJQUFDLENBQUEsUUFBRCxHQUFZO0lBQ1osSUFBQyxDQUFBLEtBQUQsR0FBUztJQUNULElBQUMsQ0FBQSxjQUFELEdBQWtCO0lBQ2xCLElBQUMsQ0FBQSxjQUFELEdBQWtCO0lBQ2xCLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUNWLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsY0FBRCxHQUFrQjtJQUdsQixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxP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QSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWYsRUFERDs7RUFyQlU7OzBCQTBCWCxTQUFBLEdBQVcsU0FBQTtXQUNWLElBQUMsQ0FBQSxhQUFELENBQUE7RUFEVTs7OztHQS9Sd0I7Ozs7QUNacEMsT0FBTyxDQUFDLEtBQVIsR0FBZ0I7O0FBRWhCLE9BQU8sQ0FBQyxVQUFSLEdBQXFCLFNBQUE7U0FDcEIsS0FBQSxDQUFNLHVCQUFOO0FBRG9COztBQUdyQixPQUFPLENBQUMsT0FBUixHQUFrQixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIyNcblNlcXVlbmNlIVxuXG4xLiBQdXQgdGhpcyBmaWxlIGluIHlvdXIgL21vZHVsZXMgZm9sZGVyLlxuXG4yLiBJbXBvcnQgaXQgYXQgdGhlIHRvcCBvZiB5b3VyIEZyYW1lciBwcm9qZWN0Llxue1NlcXVlbmNlQm9hcmR9ID0gcmVxdWlyZSBcIlNlcXVlbmNlQm9hcmRcIlxuXG4zLiBJbml0aWFsaXplIEJvYXJkLlxuYm9hcmQgPSBuZXcgU2VxdWVuY2VCb2FyZFxuXG5jb250YWN0OlxuQDcybWVuYVxuXG4jIyNcblxuY2xhc3MgZXhwb3J0cy5TZXF1ZW5jZUJvYXJkIGV4dGVuZHMgTGF5ZXJcblxuXHRjb25zdHJ1Y3RvcjogKEBvcHRpb25zPXt9KSAtPlxuXG5cdFx0IyBTZXQgRGVmYXVsdHNcblx0XHRAb3B0aW9ucy5ib2FyZE1hdHJpeCA/PSAzXG5cdFx0QG9wdGlvbnMubW9kZSA/PSAnTm9ybWFsJ1xuXHRcdEBvcHRpb25zLnNlcXVlbmNlTGVuZ3RoID89IDJcblx0XHRAb3B0aW9ucy5ndXR0ZXIgPz0gOFxuXHRcdEBvcHRpb25zLnRpbGVTaXplID89IDEwMFxuXHRcdEBvcHRpb25zLnRpbGVSYWRpdXMgPz0gNlxuXHRcdEBvcHRpb25zLnRpbGVDb2xvciA/PSAnd2hpdGUnXG5cdFx0QG9wdGlvbnMuaGludENvbG9yID89ICcjMjhBRkZBJ1xuXHRcdEBvcHRpb25zLmF1dG9TdGFydCA/PSB0cnVlXG5cdFx0QG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IG51bGxcblxuXHRcdHN1cGVyIEBvcHRpb25zXG5cblx0XHQjIFZhcnNcblx0XHRAc2VxdWVuY2UgPSBbXVx0XHRcdFx0XHQjIGhvbGRzIHNlcXVlbmNlIGRhdGFcblx0XHRAdGlsZXMgPSBbXVx0XHRcdFx0XHRcdCMgaG9sZHMgJ3RpbGUnIG9iamVjdHNcblx0XHRAc3RlcEluU2VxdWVuY2UgPSAwXHRcdFx0XHQjIHRyYWNrcyBjdXJyZW50IHN0ZXAgbWFkZSBieSBwbGF5ZXJcblx0XHRAaXRlbUluU2VxdWVuY2UgPSAwXHRcdFx0XHQjIHRyYWNrcyBpdGVtcyB3aXRoaW4gc2VxdWVuY2UgZGF0YVxuXHRcdEBkZWdyZWVzID0gOTBcdFx0XHRcdFx0IyBSb3RhdGlvbiB2YWx1ZS4gVG8gYmUgdXNlZCBpbiBmdXR1cmUgZ2FtZSBtb2Rlcy5cblx0XHRAbGV2ZWwgPSAwXHRcdFx0XHRcdFx0IyBUcmFja3MgbGV2ZWxcblx0XHRAcmFuZG9tID0gMFx0XHRcdFx0XHRcdCMgUmFuZG9tIG51bWJlciB0byBiZSB1c2VkIGluIHRoZSBzZXF1ZW5jZVxuXHRcdEBjb3VudGVyID0gMFx0XHRcdFx0XHQjIFVzZWQgZm9yIG5hbWluZyB0aWxlc1xuXHRcdEBwbGF5ZXJTZXF1ZW5jZSA9IFtdXHRcdFx0IyBUcmFjayBwbGF5ZXIncyBpbnB1dC5cblxuXHRcdCMgU2V0dGluZ3Ncblx0XHRAYm9hcmRNYXRyaXggPSBAb3B0aW9ucy5ib2FyZE1hdHJpeFxuXHRcdEBtb2RlID0gQG9wdGlvbnMubW9kZVxuXHRcdEBzZXF1ZW5jZUxlbmd0aCA9IEBvcHRpb25zLnNlcXVlbmNlTGVuZ3RoXG5cdFx0QHJvd3MgPSBAY29scyA9IEBib2FyZE1hdHJpeFxuXHRcdEBndXR0ZXIgPSBAb3B0aW9ucy5ndXR0ZXJcblx0XHRAdGlsZVdpZHRoICA9IEBvcHRpb25zLnRpbGVTaXplXG5cdFx0QHRpbGVIZWlnaHQgPSBAb3B0aW9ucy50aWxlU2l6ZVxuXHRcdEB0aWxlUmFkaXVzID0gQG9wdGlvbnMudGlsZVJhZGl1c1xuXHRcdEB0aWxlQ29sb3IgPSBAb3B0aW9ucy50aWxlQ29sb3Jcblx0XHRAaGludENvbG9yID0gQG9wdGlvbnMuaGludENvbG9yXG5cdFx0QGF1dG9TdGFydCA9IEBvcHRpb25zLmF1dG9TdGFydFxuXG5cdFx0IyBJbml0XG5cdFx0QHNldHVwKClcblx0XHRAZGlzYWJsZUNsaWNrcygpXG5cdFx0QGJ1aWxkU2VxdWVuY2UoKVxuXHRcdGlmIEBhdXRvU3RhcnRcblx0XHRcdFV0aWxzLmRlbGF5IDIsID0+XG5cdFx0XHRcdEBzaG93Q2hhbGxlbmdlKClcblxuXG5cblx0c2V0dXA6ICgpID0+XG5cblx0XHQjIyNcblx0XHRNYWluIHdyYXBwZXI6IENvbnRhaW5lclxuXHRcdCMjI1xuXHRcdEBjb250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHRcdG5hbWU6ICdDb250YWluZXInXG5cdFx0XHR3aWR0aDogKEB0aWxlV2lkdGgqQGJvYXJkTWF0cml4KSsoQGd1dHRlciooQGJvYXJkTWF0cml4LTEpKVxuXHRcdFx0aGVpZ2h0OiAoQHRpbGVXaWR0aCpAYm9hcmRNYXRyaXgpKyhAZ3V0dGVyKihAYm9hcmRNYXRyaXgtMSkpXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblx0XHRcdGNsaXA6IGZhbHNlXG5cdFx0XHRwYXJlbnQ6IEBcblxuXHRcdEB3aWR0aCA9IEBjb250YWluZXIubWF4WFxuXHRcdEBoZWlnaHQgPSBAY29udGFpbmVyLm1heFlcblxuXHRcdCMjI1xuXHRcdEJvYXJkLiBCYXNlZCBvbiBNYXRyaXggdmFsdWVcblx0XHQjIyNcblx0XHRmb3Igcm93SW5kZXggaW4gWzAuLi5Acm93c11cblx0XHRcdGZvciBjb2xJbmRleCBpbiBbMC4uLkBjb2xzXVxuXHRcdFx0XHRAdGlsZSA9IG5ldyBMYXllclxuXHRcdFx0XHRcdG5hbWU6IFwidGlsZVwiK0Bjb3VudGVyXG5cdFx0XHRcdFx0d2lkdGg6ICBAdGlsZVdpZHRoXG5cdFx0XHRcdFx0aGVpZ2h0OiBAdGlsZUhlaWdodFxuXHRcdFx0XHRcdHg6IGNvbEluZGV4ICogKEB0aWxlV2lkdGggKyBAZ3V0dGVyKVxuXHRcdFx0XHRcdHk6IHJvd0luZGV4ICogKEB0aWxlSGVpZ2h0ICsgQGd1dHRlcilcblx0XHRcdFx0XHRib3JkZXJSYWRpdXM6IEB0aWxlUmFkaXVzXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBAdGlsZUNvbG9yXG5cdFx0XHRcdFx0cGFyZW50OiBAY29udGFpbmVyXG5cdFx0XHRcdEB0aWxlLnN0YXRlcy5hZGRcblx0XHRcdFx0XHRhdFJvdGF0ZTpcblx0XHRcdFx0XHRcdHNjYWxlOiAwLjc1XG5cdFx0XHRcdFx0ZGlzbWlzczpcblx0XHRcdFx0XHRcdHNjYWxlOiAwXG5cdFx0XHRcdFx0XHRyb3RhdGlvbjogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjE4MClcblx0XHRcdFx0XHRhbnN3ZXI6XG5cdFx0XHRcdFx0XHRyb3RhdGlvbjogMzYwXG5cdFx0XHRcdFx0XHRzY2FsZTogMS41XG5cdFx0XHRcdEB0aWxlLnN0YXRlcy5hbmltYXRpb25PcHRpb25zID1cblx0XHRcdFx0XHRjdXJ2ZTogXCJzcHJpbmcoODAwLDMwLDApXCJcblx0XHRcdFx0QHRpbGUub24gRXZlbnRzLkNsaWNrLCAoZXZlbnQsIGxheWVyKSA9PlxuXHRcdFx0XHRcdEB0aWxlRGlkQ2xpY2sobGF5ZXIpXG5cdFx0XHRcdEBjb3VudGVyKytcblx0XHRcdFx0QHRpbGVzLnB1c2goQHRpbGUpXG5cblx0XHQjIyNcblx0XHRIaWRkZW4gdGlsZSB0byBiZSB1c2VkIGZvciB0aGUgaGlnaGxpZ2h0IGVmZmVjdFxuXHRcdCMjI1xuXHRcdEBoaWdobGlnaHQgPSBuZXcgTGF5ZXJcblx0XHRcdG5hbWU6ICdIaWdobGlnaHQnXG5cdFx0XHR3aWR0aDogIEB0aWxlV2lkdGhcblx0XHRcdGhlaWdodDogQHRpbGVIZWlnaHRcblx0XHRcdGJvcmRlclJhZGl1czogQHRpbGVSYWRpdXNcblx0XHRcdGJhY2tncm91bmRDb2xvcjogQGhpbnRDb2xvclxuXHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0cGFyZW50OiBAY29udGFpbmVyXG5cdFx0QGhpZ2hsaWdodC5zdGF0ZXMuYWRkXG5cdFx0XHRoaWdobGlnaHQ6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0c2NhbGU6IDEuMlxuXHRcdFx0aGlkZTpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdEBoaWdobGlnaHQuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdFx0Y3VydmU6IFwic3ByaW5nKDMwMCw1MCwwKVwiXG5cblxuXG5cdGJ1aWxkU2VxdWVuY2U6ICgpID0+XG5cdFx0Zm9yIG51bWJlciBpbiBbMC4uLkBzZXF1ZW5jZUxlbmd0aF1cblx0XHRcdEBzZXF1ZW5jZS5wdXNoIEBnZXRSYW5kb21OdW1iZXIoKVxuXG5cblxuXHRzaG93Q2hhbGxlbmdlOiAoKSA9PlxuXHRcdEBsZXZlbCsrXG5cdFx0QGl0ZW1JblNlcXVlbmNlID0gMFxuXHRcdGZvciBudW1iZXIsIGkgaW4gQHNlcXVlbmNlXG5cdFx0XHRzZXRUaW1lb3V0ICggPT5cblx0XHRcdFx0Y3VycmVudEhpbnQgPSBAc2VxdWVuY2VbQGl0ZW1JblNlcXVlbmNlXVxuXHRcdFx0XHRjdXJyZW50VGlsZSA9IEB0aWxlc1tjdXJyZW50SGludF1cblx0XHRcdFx0QHNob3dIaWdobGlnaHRFZmZlY3RBYm92ZShjdXJyZW50VGlsZSlcblx0XHRcdFx0QGl0ZW1JblNlcXVlbmNlKytcblx0XHRcdFx0I0RvIHNvbWV0aGluZyBhZnRlciBzZXF1ZW5jZSBlbmRzXG5cdFx0XHRcdGlmIEBpdGVtSW5TZXF1ZW5jZSA9PSAoQHNlcXVlbmNlLmxlbmd0aClcblx0XHRcdFx0XHRVdGlscy5kZWxheSAwLjUsID0+XG5cdFx0XHRcdFx0XHRAZW5hYmxlQ2xpY2tzKClcblx0XHRcdCksIDYwMCppXG5cblxuXG5cdCMgSSBjYW1lIHVwIHdpdGggdGhpcyByZWN1cnNpdmUgZnVuY3Rpb24gdGhhdCBsZXRzIHlvdSBoYXZlIHR3byBkaWZmZXJlbnQgb3V0Y29tZXMgd2l0aCB0aGUgcmFuZG9tIG51bWJlciwgZGVwZW5kaW5nIHdoZXRoZXIgdGhlIGdhbWUgbW9kZSBpcyBOb3JtYWwgb3IgSGFyZC5cblx0IyBQbGVhc2UgcmVhY2ggb3V0IGlmIHlvdSBoYXZlIGEgYmV0dGVyIHNvbHV0aW9uIVxuXHRnZXRSYW5kb21OdW1iZXI6ICgpID0+XG5cblx0XHQjIE91ciBoZXJvIHJhbmRvbSBudW1iZXIgZm9yIHRoaXMgaXRlcmF0aW9uLlxuXHRcdEByYW5kb20gPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKihAYm9hcmRNYXRyaXgqQGJvYXJkTWF0cml4KSkpXG5cblx0XHQjIEZpcnN0IHRpbWUgcnVuIGFzIG5vcm1hbC5cblx0XHRpZiBAc2VxdWVuY2VbQHNlcXVlbmNlLmxlbmd0aC0xXSBpcyB1bmRlZmluZWRcblx0XHRcdHJldHVybiBAcmFuZG9tXG5cblx0XHQjIFN1YnNlcXVlbnQgdGltZXMsIGNoZWNrIGZvciByZXBldGl0aXZlIG51bWJlcnNcblx0XHRlbHNlXG5cblx0XHRcdCMgSW4gTm9ybWFsIG1vZGUsIGxldCB0aGVyZSBiZSB0aGUgc2FtZSByYW5kb20gbnVtYmVyIHR3aWNlIGluIGEgcm93LlxuXHRcdFx0aWYgQG1vZGUgaXMgJ05vcm1hbCdcblx0XHRcdFx0aWYgQHJhbmRvbSA9PSBAc2VxdWVuY2VbQHNlcXVlbmNlLmxlbmd0aC0xXVxuXHRcdFx0XHRcdGlmIEByYW5kb20gPT0gQHNlcXVlbmNlW0BzZXF1ZW5jZS5sZW5ndGgtMl1cblx0XHRcdFx0XHRcdCNwcmludCAnVXNpbmcgcmVjdXJzaW9uIGZvciBudW1iZXI6JywgQHJhbmRvbSwgJ2F0IHBvczonLCBAc2VxdWVuY2UubGVuZ3RoXG5cdFx0XHRcdFx0XHRAZ2V0UmFuZG9tTnVtYmVyKClcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gQHJhbmRvbVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIEByYW5kb21cblxuXHRcdFx0IyBJbiBIYXJkIG1vZGUsIHByZXZlbnQgYW55IGR1cGxpY2F0ZXMuXG5cdFx0XHRlbHNlIGlmIEBtb2RlIGlzICdIYXJkJ1xuXHRcdFx0XHRpZiBAcmFuZG9tID09IEBzZXF1ZW5jZVtAc2VxdWVuY2UubGVuZ3RoLTFdXG5cdFx0XHRcdFx0I3ByaW50ICdVc2luZyByZWN1cnNpb24gZm9yIG51bWJlcjonLCBAcmFuZG9tLCAnYXQgcG9zOicsIEBzZXF1ZW5jZS5sZW5ndGhcblx0XHRcdFx0XHRAZ2V0UmFuZG9tTnVtYmVyKClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJldHVybiBAcmFuZG9tXG5cblxuXG5cdHRpbGVEaWRDbGljazogKHRpbGUpID0+XG5cblx0XHQjTG9naWMgZm9yIGNsaWNrLiBDb250aW51ZSBzZXF1ZW5jZSBvciBFbmQgZ2FtZS5cblx0XHRjaGVja1RpbGUgPSBAc2VxdWVuY2VbQHN0ZXBJblNlcXVlbmNlXVxuXG5cdFx0IyBJZiBTZXF1ZW5jZSBpcyBPSyFcblx0XHRpZiB0aWxlLm5hbWUgPT0gQHRpbGVzW2NoZWNrVGlsZV0ubmFtZVxuXHRcdFx0QHNob3dIaWdobGlnaHRFZmZlY3RBYm92ZSh0aWxlKVxuXG5cdFx0XHQjIElmIGxhc3QgaXRlbSBpbiBTZXF1ZW5jZSwgdGhlbiBtb3ZlIHRvIG5leHQgTGV2ZWwuXG5cdFx0XHRpZiBAc3RlcEluU2VxdWVuY2UgPT0gQHNlcXVlbmNlLmxlbmd0aC0xXG5cdFx0XHRcdEBkaXNhYmxlQ2xpY2tzKClcblx0XHRcdFx0VXRpbHMuZGVsYXkgMC41LCA9PlxuXHRcdFx0XHRcdEBzdGVwSW5TZXF1ZW5jZSA9IDBcblx0XHRcdFx0XHRAc2VxdWVuY2UucHVzaCBAZ2V0UmFuZG9tTnVtYmVyKClcblx0XHRcdFx0XHRAcnVuUm90YXRpb24oKVxuXG5cdFx0XHQjIEVsc2UsIGp1c3Qgd2FpdCBmb3IgdGhlIG5leHQgaW5wdXQuXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBzdGVwSW5TZXF1ZW5jZSsrXG5cblx0XHQjIElmIFNlcXVlbmNlIGlzIHdyb25nLCBlbmQgZ2FtZS5cblx0XHRlbHNlXG5cdFx0XHRAZGlzYWJsZUNsaWNrcygpXG5cdFx0XHRAaGlnaGxpZ2h0LmJhY2tncm91bmRDb2xvciA9IFwiI0ZGMDAwMFwiXG5cdFx0XHRAc2hvd0hpZ2hsaWdodEVmZmVjdEFib3ZlKHRpbGUpXG5cdFx0XHRAZW5kR2FtZShAdGlsZXNbY2hlY2tUaWxlXSlcblxuXG5cblx0c2hvd0hpZ2hsaWdodEVmZmVjdEFib3ZlOiAodGlsZSkgPT5cblx0XHRAaGlnaGxpZ2h0LnggPSB0aWxlLnhcblx0XHRAaGlnaGxpZ2h0LnkgPSB0aWxlLnlcblx0XHRAaGlnaGxpZ2h0LnN0YXRlcy5zd2l0Y2ggXCJoaWdobGlnaHRcIlxuXHRcdFV0aWxzLmRlbGF5IDAuMjUsID0+XG5cdFx0XHRAaGlnaGxpZ2h0LnN0YXRlcy5zd2l0Y2ggXCJoaWRlXCJcblxuXG5cblx0cnVuUm90YXRpb246ICgpID0+XG5cdFx0Zm9yIHRpbGUgaW4gQHRpbGVzXG5cdFx0XHR0aWxlLnN0YXRlcy5zd2l0Y2ggXCJhdFJvdGF0ZVwiXG5cdFx0VXRpbHMuZGVsYXkgMC43LCA9PlxuXHRcdFx0Zm9yIHRpbGUgaW4gQHRpbGVzXG5cdFx0XHRcdHRpbGUuc3RhdGVzLnN3aXRjaCBcImRlZmF1bHRcIlxuXHRcdFV0aWxzLmRlbGF5IDAuMTUsID0+XG5cdFx0XHRAY29udGFpbmVyLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRyb3RhdGlvbjogKEBjb250YWluZXIucm90YXRpb24pK0BkZWdyZWVzXG5cdFx0XHRcdGN1cnZlOiBcInNwcmluZyg1MCw4LDApXCJcblx0XHQjIEFmdGVyIHJvdGF0aW9uIGFuaW1hdGlvbiwgc2hvdyBuZXh0IGxldmVsXG5cdFx0VXRpbHMuZGVsYXkgMS4yLCA9PlxuXHRcdFx0QHNob3dDaGFsbGVuZ2UoKVxuXG5cblx0ZGlzYWJsZUNsaWNrczogKCkgPT5cblx0XHRmb3IgdGlsZSBpbiBAdGlsZXNcblx0XHRcdHRpbGUuaWdub3JlRXZlbnRzID0gdHJ1ZVxuXG5cblx0ZW5hYmxlQ2xpY2tzOiAoKSA9PlxuXHRcdGZvciB0aWxlIGluIEB0aWxlc1xuXHRcdFx0dGlsZS5pZ25vcmVFdmVudHMgPSBmYWxzZVxuXG5cblx0ZW5kR2FtZTogKGNvcnJlY3RUaWxlKSA9PlxuXHRcdGZvciB0aWxlIGluIEB0aWxlc1xuXHRcdFx0IyBIaWdobGlnaHQgd2hhdCB0aGUgY29ycmVjdCB0aWxlIHdhcy5cblx0XHRcdGlmIHRpbGUubmFtZSA9PSBjb3JyZWN0VGlsZS5uYW1lXG5cdFx0XHRcdHRpbGUuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdFx0XHRcdGN1cnZlOiBcInNwcmluZygyMDAsNzAsMClcIlxuXHRcdFx0XHR0aWxlLnN0YXRlcy5zd2l0Y2ggXCJhbnN3ZXJcIlxuXHRcdFx0IyBIaWRlIGFsbCBvdGhlcnMuXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRpbGUuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdFx0XHRcdGN1cnZlOiBcInNwcmluZygyMDAsNTAsMClcIlxuXHRcdFx0XHR0aWxlLnN0YXRlcy5zd2l0Y2ggXCJkaXNtaXNzXCJcblxuXHRcdEBwbGF5ZXJTZXF1ZW5jZSA9IEBzZXF1ZW5jZS5zbGljZSgwLEBzdGVwSW5TZXF1ZW5jZSlcblx0XHRAZW1pdCAnRXZlbnRzLkdhbWVFbmRlZCdcblxuXG5cdHJlc2V0R2FtZTogKCkgPT5cblx0XHQjIERlc3Ryb3kgb2xkIFVJXG5cdFx0QGNvbnRhaW5lci5kZXN0cm95KClcblx0XHRAaGlnaGxpZ2h0LmRlc3Ryb3koKVxuXHRcdGZvciB0aWxlIGluIEB0aWxlc1xuXHRcdFx0dGlsZS5kZXN0cm95KClcblx0XHQjIFJlc2V0IFZhcnNcblx0XHRAc2VxdWVuY2UgPSBbXVxuXHRcdEB0aWxlcyA9IFtdXG5cdFx0QHN0ZXBJblNlcXVlbmNlID0gMFxuXHRcdEBpdGVtSW5TZXF1ZW5jZSA9IDBcblx0XHRAZGVncmVlcyA9IDkwXG5cdFx0QGxldmVsID0gMFxuXHRcdEByYW5kb20gPSAwXG5cdFx0QHNlcXVlbmNlTGVuZ3RoID0gQG9wdGlvbnMuc2VxdWVuY2VMZW5ndGhcblx0XHRAY291bnRlciA9IDBcblx0XHRAcGxheWVyU2VxdWVuY2UgPSBbXVxuXHRcdCMgSW5pdFxuXHRcdEBzZXR1cCgpXG5cdFx0QGRpc2FibGVDbGlja3MoKVxuXHRcdEBidWlsZFNlcXVlbmNlKClcblx0XHRpZiBAYXV0b1N0YXJ0XG5cdFx0XHRVdGlscy5kZWxheSAyLCA9PlxuXHRcdFx0XHRAc2hvd0NoYWxsZW5nZSgpXG5cblxuXHRzdGFydEdhbWU6ICgpID0+XG5cdFx0QHNob3dDaGFsbGVuZ2UoKVxuXG4iLCIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyBteU1vZHVsZSA9IHJlcXVpcmUgXCJteU1vZHVsZVwiXG4jIFJlZmVyZW5jZSB0aGUgY29udGVudHMgYnkgbmFtZSwgbGlrZSBteU1vZHVsZS5teUZ1bmN0aW9uKCkgb3IgbXlNb2R1bGUubXlWYXJcblxuZXhwb3J0cy5teVZhciA9IFwibXlWYXJpYWJsZVwiXG5cbmV4cG9ydHMubXlGdW5jdGlvbiA9IC0+XG5cdHByaW50IFwibXlGdW5jdGlvbiBpcyBydW5uaW5nXCJcblxuZXhwb3J0cy5teUFycmF5ID0gWzEsIDIsIDNdIl19
