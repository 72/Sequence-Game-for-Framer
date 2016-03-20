# Sequence Game for Framer
A module to create and manage a Sequence board game.


## Examples
A version of this game connected with Parse (rip parse).
- [Sequence + Parse](http://setentaydos.com/frs/)


## Installation

1. Create a new Framer project.
2. Put this module in the `modules` folder.
3. Add this line at the top of your document.
```coffeescript
{SequenceBoard} = require "SequenceBoard"
```


## How to use

Create a new board.
```coffeescript
board = new SequenceBoard
```
That's it! This creates a board using internal default values and shows the sequence you need to follow.


### Customization

There are a lot of different attributes you can play around with.
```coffeescript
board = new SequenceBoard
	boardMatrix: 3
	sequenceLength: 2
	tileSize: 100
	tileRadius: 6
	tileColor: "#FFF"
	hintColor: "#28AFFA"
	gutter: 10
	mode: 'Normal'
	autoStart: true
```

Here's a decription of each attribute:
- `boardMatrix` *Number* : Sets the matrix that creates the board (3x3, 4x4, 5x5, etc). Defaults to 3.
- `sequenceLength` *Number* : Sets the length of the initial sequence to show. Defaults to 2.
- `tileSize` *Number* : Sets the size of the tiles. Defaults to 100.
- `tileRadius` *Number* : Sets the border radius of the tiles. Defaults to 6. TIP: Pass the half value of your tileSize to create circles!
- `tileColor` *String* : Sets the color of the tiles. Defaults to "#FFF.
- `hintColor` *String* : Sets the color of the hint effect that shows the sequence. Defaults to "#28AFFA".
- `gutter` *Number* : Sets the spacing between the tiles. Defaults to 10.
- `mode` *String* : Sets the difficulty of the game. Pass either 'Normal' or 'Hard'. Normal mode lets the game create repetitive numbers at most twice in a row. Hard mode sets a rule that prevents any repetitive numbers. Defaults to 'Normal'.
- `autoStart` *Boolean* : Whether to let the game to start by itself. Defaults to true.


### Events & Functions

Listen for a custom 'GameEnded' event.
```coffeescript
board.on 'Events.GameEnded', ->
	print 'You got to level: ' + @level
	print 'Your final sequence was: ' + @playerSequence
	print 'Correct sequence was: ' + @sequence
	#doSomethingElse
```
Within the 'GameEnded' event you have access to these values:
- `@level` : Level the game ended at. Returns a number
- `@playerSequence` : The last sequence created by the player. Returns an array.
- `@sequence` : The correct sequence created by the game. Returns an array.


Reset the game.
```coffeescript
board.resetGame()
```
Note: If your board has `autoStart` set to true, the game will start by itself after this function runs. You don't need to do any extra work.


However, if you set `autoStart` to false, then use this method to start the game.
```coffeescript
board.startGame()
```
Note: Don't use this method if your board has `autoStart` set to true. You don't need it twice.



## Example 1: Basic setup

Set 'Device' to No Device, then paste this.
```coffeescript
{SequenceBoard} = require "SequenceBoard"

bg = new BackgroundLayer
	backgroundColor: "#e3e3e3"

board = new SequenceBoard

board.center()

board.on 'Events.GameEnded', ->
	print 'You got to level: ' + @level
	print 'Your final sequence was: ' + @playerSequence
	print 'Correct sequence was: ' + @sequence
	Utils.delay 2, ->
		board.resetGame()
```


## Example 2: Customized

Set 'Device' to No Device, then paste this.
```coffeescript
{SequenceBoard} = require "SequenceBoard"

bg = new BackgroundLayer
	backgroundColor: "#e3e3e3"

board = new SequenceBoard
	boardMatrix: 4
	sequenceLength: 3
	tileSize: 80
	tileRadius: 40
	gutter: 20
	mode: 'Hard'

board.center()

board.on 'Events.GameEnded', ->
	print 'You got to level: ' + @level
	print 'Your final sequence was: ' + @playerSequence
	print 'Correct sequence was: ' + @sequence
	Utils.delay 2, ->
		board.resetGame()
```




##Contact
Twitter: [@72mena](http://twitter.com/72mena)
