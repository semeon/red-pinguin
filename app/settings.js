export let settings = {}

// general
settings.name = 'trump'

// trainer
settings.patternLength = 4
settings.tranIterations = 2000

// generator
settings.outputLines = 40
settings.outputLineLength = 200

// pre-processing
settings.sourceFileName 			= 'data/1-raw/' + settings.name + '.txt'
settings.sourceLinesFileName 	= 'data/2-preprocessed/' + settings.name + '-lines.json'

// dictionaries
settings.vocabFileName		= 'data/3-dict/vocabs/' + settings.name + '-vocab.json'
settings.patternFileName	= 'data/3-dict/patterns/' + settings.name + '-' + settings.patternLength + 'w-patterns.json'

// network
settings.nnFileName				= 'data/4-nn/' + settings.name + '-' + settings.patternLength + 'w-' + settings.tranIterations + 'i-network.json'

// output
settings.outputFileName		= 'data/9-output/' + settings.name + '-' + settings.patternLength + 'w-' + settings.tranIterations + 'i-output.json'
