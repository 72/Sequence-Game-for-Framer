###
Sequence!

1. Put this file in your /modules folder.

2. Import it at the top of your Framer project.
{SequenceBoard} = require "SequenceBoard"

3. Initialize Board.
board = new SequenceBoard

contact:
@72mena

###

class exports.SequenceBoard extends Layer

	constructor: (@options={}) ->

		# Set Defaults
		@options.boardMatrix ?= 3
		@options.mode ?= 'Normal'
		@options.sequenceLength ?= 2
		@options.gutter ?= 8
		@options.tileSize ?= 100
		@options.tileRadius ?= 6
		@options.tileColor ?= 'white'
		@options.hintColor ?= '#28AFFA'
		@options.autoStart ?= true
		@options.backgroundColor ?= null

		super @options

		# Vars
		@sequence = []					# holds sequence data
		@tiles = []						# holds 'tile' objects
		@stepInSequence = 0				# tracks current step made by player
		@itemInSequence = 0				# tracks items within sequence data
		@degrees = 90					# Rotation value. To be used in future game modes.
		@level = 0						# Tracks level
		@random = 0						# Random number to be used in the sequence
		@counter = 0					# Used for naming tiles
		@playerSequence = []			# Track player's input.

		# Settings
		@boardMatrix = @options.boardMatrix
		@mode = @options.mode
		@sequenceLength = @options.sequenceLength
		@rows = @cols = @boardMatrix
		@gutter = @options.gutter
		@tileWidth  = @options.tileSize
		@tileHeight = @options.tileSize
		@tileRadius = @options.tileRadius
		@tileColor = @options.tileColor
		@hintColor = @options.hintColor
		@autoStart = @options.autoStart

		# Init
		@setup()
		@disableClicks()
		@buildSequence()
		if @autoStart
			Utils.delay 2, =>
				@showChallenge()



	setup: () =>

		###
		Main wrapper: Container
		###
		@container = new Layer
			name: 'Container'
			width: (@tileWidth*@boardMatrix)+(@gutter*(@boardMatrix-1))
			height: (@tileWidth*@boardMatrix)+(@gutter*(@boardMatrix-1))
			backgroundColor: null
			clip: false
			parent: @

		@width = @container.maxX
		@height = @container.maxY

		###
		Board. Based on Matrix value
		###
		for rowIndex in [0...@rows]
			for colIndex in [0...@cols]
				@tile = new Layer
					name: "tile"+@counter
					width:  @tileWidth
					height: @tileHeight
					x: colIndex * (@tileWidth + @gutter)
					y: rowIndex * (@tileHeight + @gutter)
					borderRadius: @tileRadius
					backgroundColor: @tileColor
					parent: @container
				@tile.states.add
					atRotate:
						scale: 0.75
					dismiss:
						scale: 0
						rotation: Math.floor(Math.random()*180)
					answer:
						rotation: 360
						scale: 1.5
				@tile.states.animationOptions =
					curve: "spring(800,30,0)"
				@tile.on Events.Click, (event, layer) =>
					@tileDidClick(layer)
				@counter++
				@tiles.push(@tile)

		###
		Hidden tile to be used for the highlight effect
		###
		@highlight = new Layer
			name: 'Highlight'
			width:  @tileWidth
			height: @tileHeight
			borderRadius: @tileRadius
			backgroundColor: @hintColor
			opacity: 0
			parent: @container
		@highlight.states.add
			highlight:
				opacity: 1
				scale: 1.2
			hide:
				opacity: 0
				scale: 1
		@highlight.states.animationOptions =
			curve: "spring(300,50,0)"



	buildSequence: () =>
		for number in [0...@sequenceLength]
			@sequence.push @getRandomNumber()



	showChallenge: () =>
		@level++
		@itemInSequence = 0
		for number, i in @sequence
			setTimeout ( =>
				currentHint = @sequence[@itemInSequence]
				currentTile = @tiles[currentHint]
				@showHighlightEffectAbove(currentTile)
				@itemInSequence++
				#Do something after sequence ends
				if @itemInSequence == (@sequence.length)
					Utils.delay 0.5, =>
						@enableClicks()
			), 600*i



	# I came up with this recursive function that lets you have two different outcomes with the random number, depending whether the game mode is Normal or Hard.
	# Please reach out if you have a better solution!
	getRandomNumber: () =>

		# Our hero random number for this iteration.
		@random = (Math.floor(Math.random()*(@boardMatrix*@boardMatrix)))

		# First time run as normal.
		if @sequence[@sequence.length-1] is undefined
			return @random

		# Subsequent times, check for repetitive numbers
		else

			# In Normal mode, let there be the same random number twice in a row.
			if @mode is 'Normal'
				if @random == @sequence[@sequence.length-1]
					if @random == @sequence[@sequence.length-2]
						#print 'Using recursion for number:', @random, 'at pos:', @sequence.length
						@getRandomNumber()
					else
						return @random
				else
					return @random

			# In Hard mode, prevent any duplicates.
			else if @mode is 'Hard'
				if @random == @sequence[@sequence.length-1]
					#print 'Using recursion for number:', @random, 'at pos:', @sequence.length
					@getRandomNumber()
				else
					return @random



	tileDidClick: (tile) =>

		#Logic for click. Continue sequence or End game.
		checkTile = @sequence[@stepInSequence]

		# If Sequence is OK!
		if tile.name == @tiles[checkTile].name
			@showHighlightEffectAbove(tile)

			# If last item in Sequence, then move to next Level.
			if @stepInSequence == @sequence.length-1
				@disableClicks()
				Utils.delay 0.5, =>
					@stepInSequence = 0
					@sequence.push @getRandomNumber()
					@runRotation()

			# Else, just wait for the next input.
			else
				@stepInSequence++

		# If Sequence is wrong, end game.
		else
			@disableClicks()
			@highlight.backgroundColor = "#FF0000"
			@showHighlightEffectAbove(tile)
			@endGame(@tiles[checkTile])



	showHighlightEffectAbove: (tile) =>
		@highlight.x = tile.x
		@highlight.y = tile.y
		@highlight.states.switch "highlight"
		Utils.delay 0.25, =>
			@highlight.states.switch "hide"



	runRotation: () =>
		for tile in @tiles
			tile.states.switch "atRotate"
		Utils.delay 0.7, =>
			for tile in @tiles
				tile.states.switch "default"
		Utils.delay 0.15, =>
			@container.animate
				properties:
					rotation: (@container.rotation)+@degrees
				curve: "spring(50,8,0)"
		# After rotation animation, show next level
		Utils.delay 1.2, =>
			@showChallenge()


	disableClicks: () =>
		for tile in @tiles
			tile.ignoreEvents = true


	enableClicks: () =>
		for tile in @tiles
			tile.ignoreEvents = false


	endGame: (correctTile) =>
		for tile in @tiles
			# Highlight what the correct tile was.
			if tile.name == correctTile.name
				tile.states.animationOptions =
					curve: "spring(200,70,0)"
				tile.states.switch "answer"
			# Hide all others.
			else
				tile.states.animationOptions =
					curve: "spring(200,50,0)"
				tile.states.switch "dismiss"

		@playerSequence = @sequence.slice(0,@stepInSequence)
		@emit 'Events.GameEnded'


	resetGame: () =>
		# Destroy old UI
		@container.destroy()
		@highlight.destroy()
		for tile in @tiles
			tile.destroy()
		# Reset Vars
		@sequence = []
		@tiles = []
		@stepInSequence = 0
		@itemInSequence = 0
		@degrees = 90
		@level = 0
		@random = 0
		@sequenceLength = @options.sequenceLength
		@counter = 0
		@playerSequence = []
		# Init
		@setup()
		@disableClicks()
		@buildSequence()
		if @autoStart
			Utils.delay 2, =>
				@showChallenge()


	startGame: () =>
		@showChallenge()

