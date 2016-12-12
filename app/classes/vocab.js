import {settings}	from '/app/settings.js'

const jsonfile = require('jsonfile')
jsonfile.spaces = 2

const vocabFileName = settings.vocabFileName

export class Vocab {
	constructor(props) {
		this.vocab = {}
		this.vocab.stats = {}
		this.vocab.array = []
	}

	getItem(props) {
		let result = null
		for (let i=0; i<this.vocab.array.length; i++) {
			let item = this.vocab.array[i]
			if (props.code == item.code || 
					props.value == item.value || 
					props.normCode == item.normCode || 
					props.class == item.class) {
				result = item
			}
		}
		return result
	}

	getSize() {
		return this.vocab.array.length
	}

	init(props) {
		this.vocab.array = []
		this.generate(props)
	}

	generate(props) {
		let words = props.words
		let N = words.length
		for (let i=0; i<N; i++) {
			let item = {}

			item.code = i
			item.value = words[i]

			item.normCode = i/N
			item.normCode = Math.round(item.normCode * 100000) / 10000

			item.class = i
			this.vocab.array.push(item)
		}
		this.vocab.stats.totalItems = this.vocab.array.length
		jsonfile.writeFileSync(vocabFileName, this.vocab)		
	}
}