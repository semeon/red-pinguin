import {settings}	from '/app/settings.js'

const read = require('read-file')
const S = require('string')
const split = require('split-string-words')
const arrayTools = require("array-tools")
const SortedArray = require("sorted-array")
const jsonfile = require('jsonfile')
jsonfile.spaces = 2

const textFileName = settings.sourceFileName
const linesJsonFileName = settings.sourceLinesFileName

export class PreProcessor {
	constructor(props) {
		this.text
		this.lines
		this.words
	}

	init() {
		this.loadText()
		this.buildLists()
	}

	getLines() {
		return this.lines
	}

	getWords() {
		return this.words
	}

	loadText() {
		this.text = read.sync(textFileName, 'utf8')
		// this.text = S(this.text).stripPunctuation().s
		// this.text = S(this.text).strip('--', '''').s
	}

	buildLists() {
		// Lines
		this.lines = S(this.text).lines()
		jsonfile.writeFileSync(linesJsonFileName, this.lines)
		
		// Words
		let words = []
		for (var i=0; i<this.lines.length; i++) {
			let w = split(this.lines[i])
			words = words.concat(w)
		}
		words = arrayTools.unique(words)
		this.words = new SortedArray(words).array
	}
}