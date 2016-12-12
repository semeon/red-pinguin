import {settings}				from '/app/settings.js'

const jsonfile = require('jsonfile')
jsonfile.spaces = 2

const outputMsgFileName = settings.outputFileName

export class Output {
	constructor(props) {
		this.vocab = props.vocab
		this.messages = []
	}

	addMessage(props) {
		this.messages.push(props.message)
	}

	save() {
		jsonfile.writeFileSync(outputMsgFileName, this.messages)
	}

}