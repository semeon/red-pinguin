import {Application} from '/app/app.js'

let param = process.argv[2]

let app = new Application()
app.init()

if (param == "train") {
	app.trainNetwork()

} else if(param == "generate") {
	app.generateOutput()

} else {
	app.trainNetwork()
	app.generateOutput()
}

console.log("")
console.log("")
console.log("")
