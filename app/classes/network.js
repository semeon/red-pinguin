import {settings}				from '/app/settings.js'

const convnetjs = require("convnetjs")  // http://cs.stanford.edu/people/karpathy/convnetjs/docs.html
const sortObj = require('sort-object');
const jsonfile = require('jsonfile')
jsonfile.spaces = 2

const networkJsonFileName = settings.nnFileName

export class Network {
	constructor(props) {
		this.vocab = props.vocab
		this.patternVol = props.patternVol
		this.net
		this.trainer
		this.trainingIterations = settings.tranIterations
	}

	init(props) {
		let layer_defs = []
		layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:this.patternVol.getLength()-1})
		layer_defs.push({type:'fc', num_neurons:200, activation:'relu'})
		layer_defs.push({type:'fc', num_neurons:200, activation:'relu'})
		layer_defs.push({type:'fc', num_neurons:200, activation:'relu'})
		layer_defs.push({type:'softmax', num_classes:this.vocab.getSize()})
		
		this.net = new convnetjs.Net()
		this.net.makeLayers(layer_defs)
		this.trainer = new convnetjs.Trainer(this.net, 
			{method: 'adadelta', l2_decay: 0.001, batch_size: 100})
	}
	
	train(props) {
		let patterns = this.patternVol.getPatterns()

		let trainingData = []
		for (let i=0; i<patterns.length; i++) {
			let td = {}
			td.dataPoint = new convnetjs.Vol(patterns[i].preSequenceNorm)
			td.class = patterns[i].expectationClass
			trainingData.push(td)
		}

		let itCounter = 0

		// training iterations
		for (let i=0; i<this.trainingIterations; i++) {
			for (let j=0; j<trainingData.length; j++) {
				let stats = this.trainer.train(trainingData[j].dataPoint, trainingData[j].class)
				// if (i%100 == 0) {
				// 	console.log(" training iteration:", i, ", data point:", j, ", stats:")
				// 	console.dir(stats)
				// }
			}
			
			let step = 1
			if (this.trainingIterations > 50) step = 10
			
			if (i%step == 0) {
				console.log("  iteration:", i+1, "of", this.trainingIterations)
			}
			
			itCounter++
		}
		console.log(" Training completed (" + itCounter+ " iterations).")
	}
	
	save() {
		let nnJson = this.net.toJSON()
		try {
			jsonfile.writeFileSync(networkJsonFileName, nnJson)		
		}
		catch(err) {
			throw new Error("Fatal Error: Could not write network to file: " + networkJsonFileName)
		}		
		console.log(" Saved successfully.")			
	}

	load() {
		let nnJson
		try {
			nnJson = jsonfile.readFileSync(networkJsonFileName)		
		}
		catch(err) {
			throw new Error("Fatal Error: Could not read network from file: " + networkJsonFileName)
		}		
		this.net.fromJSON(nnJson)
		console.log(" Loaded successfully.")			
	}

	
	run(props) {
		let vol = new convnetjs.Vol(props.normSeq)
		let prediction = this.net.forward(vol).w
		let bestOption = {}
		bestOption.prob = 0
		bestOption.class = ""

		for (let i=0; i<prediction.length; i++) {
			let prob = prediction[i]
			if (bestOption.prob < prob) {
				bestOption.prob = prob
				bestOption.class = i
			}
		}
		
		let result = this.vocab.getItem({class: bestOption.class}).value

		return result
	}
}