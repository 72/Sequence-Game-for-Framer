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