import {settings}				from '/app/settings.js'

import {PreProcessor} 	from '/app/classes/preProcessor.js'
import {Vocab} 					from '/app/classes/vocab.js'
import {PatternVolume} 	from '/app/classes/patternVolume.js'
import {Output} 				from '/app/classes/output.js'
import {Network} 				from '/app/classes/network.js'
import {Generator} 			from '/app/classes/generator.js'


settings.patternFileName

export class Application {
	constructor(props) {
		this.preProcessor = new PreProcessor()
		this.vocab = new Vocab()
		this.patternVol = new PatternVolume({vocab: this.vocab})
		this.output = new Output({vocab: this.vocab})

		this.nn = new Network({
			patternVol: this.patternVol,
			vocab: this.vocab})

		this.generator = new Generator({
			net: this.nn,
			patterns: this.patternVol.getPatterns(),
			vocab: this.vocab})
	}

	init() {
		console.log("")
		console.log("== [1] Prepare Network ==================")
		console.log(" Name:", settings.name)
		console.log(" Pattern Length:", settings.patternLength)

		this.preProcessor.init()
		this.vocab.init({words:this.preProcessor.getWords()})
		this.patternVol.init({lines:this.preProcessor.getLines()})
		this.nn.init()

		console.log(" Patterns Number:", this.patternVol.getSize())
		console.log(" Network and dictionaries are ready.")	
	}


	trainNetwork() {
		console.log("")
		console.log("== [2] Start Training ===================")
		this.nn.train({patterns: this.patternVol.getPatterns()})

		console.log("")
		console.log("== [3] Save Trained Network =============")			
		this.nn.save()
	}


	generateOutput() {
		console.log("")
		console.log("== [2] Load Trained Network =============")
		this.nn.load()

		console.log("")
		console.log("== [3] Start Generation =================")
		for (let i=0; i<settings.outputLines; i++) {
			let line = this.generator.run()
			this.output.addMessage({message: line})
		}
		this.output.save()
	}




}
