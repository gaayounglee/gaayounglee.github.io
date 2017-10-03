var leftPad = require('left-pad')
var chalk = require('chalk')

var log = {
	info: function info(type, message) {
	  console.log(`${chalk.green.bold(leftPad(type, 15))}  ${message}`)
	},
	error: function error(message) {
	  console.error(chalk.red(message))
	},
	success: function success(message) {
	  console.error(chalk.green(message))
	},
	log: console.log
}
module.exports = log
