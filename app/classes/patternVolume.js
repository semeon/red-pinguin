import {settings}	from '/app/settings.js'
import {Pattern} 	from '/app/classes/pattern.js'

const split = require('split-string-words')
const jsonfile = require('jsonfile')
jsonfile.spaces = 2

const volumeFileName = settings.patternFileName

export class PatternVolume {
	constructor(props) {
		this.vocab = props.vocab
		this.name = props.name
		this.length = settings.patternLength
		this.volume = {}
		this.volume.count = 0
		this.volume.patterns = []
	}

	init(props) {
		for (let i=0; i<props.lines.length; i++) {
			this.parseText({line:props.lines[i]})
		}
		jsonfile.writeFileSync(volumeFileName, this.volume)
	}
	
	parseText(props) {
		let words = split(props.line)

		// console.log(">>>> ")
		// console.log(">>>> props.line: " + props.line)
		// console.log(">>>> words: " + words)

		for (let i=0; i<words.length; i++) {
			if ( i + this.length - 1 < words.length) {
				// var fruits = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
				// var citrus = fruits.slice(1, 3);
				// citrus: ["Orange", "Lemon"]
				let sequence = words.slice(i, i+this.length)
				
				// console.log(">>>> sequence: " + sequence)			
				
				this.addPattern({seq: sequence})
			}
		}
	}

	// addSequence(props) {
	// 	this.volume.sequences.push(props.seq)
	// }

	addPattern(props) {
		let pattern = new Pattern({seq:props.seq, vocab: this.vocab})
		this.volume.patterns.push(pattern)
		this.volume.count++
	}

	getPatterns() {
		return this.volume.patterns
	}

	getSize() {
		return this.volume.count
	}	
	
	getLength() {
		return this.length
	}	
}