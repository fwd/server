const fs = require("fs")
const cors = require('cors')
const axios = require('axios')
const moment = require('moment-timezone')
const cron = require('@fwd/cron')
const cache = require('@fwd/cache')
const database = require('@fwd/database')

const crypto = require('crypto');

const chrono = require('chrono-node');

const express = require('express')
const app = express();

var server = {

	path: './',
	routes: [],
	http: axios,
	moment: moment,
	config: {},

	exec(cmd) {
		const exec = require('child_process').exec;
		return new Promise((resolve, reject) => {
			exec(cmd, (error, stdout, stderr) => {
			    if (error) {
					console.log(error);
			    }
			    resolve(stdout ? stdout : stderr);
			})
		})
	},
	
	read(filepath, config) {
		return new Promise((resolve, reject) => {
			// fs.readOrFail would be nice
			if(fs.existsSync(filepath)) {
			  resolve(fs.readFileSync(filepath, 'utf-8'))
			} else {
			  resolve(false)
			}
		})
	},

	write(filepath, body) {
		return new Promise((resolve, reject) => {
			fs.writeFile(filepath, body, function(err) {
			    if (err) return reject(err)
			    resolve(body)
			}); 
		})
	},

	prepend(filepath, body) {
		return new Promise((resolve, reject) => {
			// fs.prependFile would be nice
			if(fs.existsSync(filepath)) {
				const data = fs.readFileSync(filepath)
				const fd = fs.openSync(filepath, 'w+')
				const insert = Buffer.from(`${body} \n`)
				fs.writeSync(fd, insert, 0, insert.length, 0)
				fs.writeSync(fd, data, 0, data.length, insert.length)
				fs.close(fd, (err) => {
				  if (err) return reject(err)
				  resolve(body)
				});
			} else {
				return false
			}
		})
	},

	append(filepath, body) {
		return new Promise((resolve, reject) => {
			if(fs.existsSync(filepath)) {
				fs.appendFile(filepath, body, function (err) {
					if (err) return reject(err)
					resolve(body)
				});
			} else {
				resolve(false)
			}
		})
	},

	// For user safety, naming it 'unlink' instead of 'delete' 
	unlink(filepath) {
		return new Promise((resolve, reject) => {
			if(fs.existsSync(filepath)) {
				fs.unlinkSync(filepath)
				resolve()
			} else {
				return resolve(false)
			}
		})
	},
	
	wait(delay) {
		return this.sleep(delay)
	},

	sleep(delay) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve()
			}, delay)
		})
	},
	
	time(int, string) {
		return require('@fwd/time')(int, string)
	},

	date(string, format, timezone) {
		timezone = timezone || this.config.timezone || 'America/New_York'
		return moment(chrono.parseDate(string)).tz(timezone).format(format || 'LLL');
	},
	
	timestamp(format, timezone) {

		var timestamp = moment()
		
		timezone = timezone || this.config.timezone

		if (timezone) {
			
			require('moment-timezone')

			if (timezone === 'us-east') timezone = 'America/New_York'
			if (timezone === 'us-west') timezone = 'America/Los_Angeles'

			timestamp = timestamp.tz(timezone)

		}

		if (format) {

			format = format.toLowerCase()

			timestamp = timestamp.format(format || 'LLL')

		} else {

			timestamp = timestamp.unix()

		}

		return timestamp

	},

	cron(action, interval, runImmediately) {

		if (typeof interval === 'string') {
	
			var phrase = interval.split(' ')

			var repeat = phrase[0]
			var int = phrase[1]
			var rate = phrase[2]

			interval = this.time(int, rate)

		}

		if (runImmediately) {
			action()
		}
		
		var cron = setInterval(() => {
			action()
		}, interval)
		
		return cron

	},
	
	database: (plugin, config) => {
		return database(plugin, config)
	},

	uuid(length, prepend, no_dashes) {

		var uuid = crypto.randomUUID()
		
		if (length) {
			uuid = uuid.slice(0, typeof length === 'number' ? length : 8)
		}

		if (no_dashes) {
			uuid = uuid.split('-').join('')
		}

		if (prepend) {
			uuid = `${prepend}${uuid}`
		}

		return uuid

	},

	start(port, path, config) {
		
		var self = this
		
		config = config || {}

		if (path) this.path = path

		var views = this.path ? this.path + '/views' : 'views'
		var public = this.path ? this.path + '/public' : 'public'
		var uploads = this.path ? this.path + '/uploads' : 'uploads'

		app.use(cors())

		app.use(express.json({
			limit: config.jsonLimit || '999mb'
		}))
		
		if (config.extended) {
			app.use(express.urlencoded({extended: true}))
		}

		app.set('view engine', config.viewEngine || 'ejs');

		if (fs.existsSync(views)) {
		   app.set('views', config.viewsFolder || views);
		}
		
		var maxAge = config.maxAge ? config.maxAge : 'no-store'

		app.use(express.static(config.publicFolder || public, { maxAge }))
		
		if (config.uploadFolder) {
			app.use(express.static(config.uploadFolder, { maxAge }))
		}

		port = port || 80

		this.routes.map(route => {
			if (route.middleware) {
				app[route.method](route.path, route.middleware, function(req, res) {
					route.action(req, res)
				})
				return
			}
			app[route.method](route.path, function(req, res) {
				route.action(req, res)
			})
		})
		
		console.log( config.browserUrl || "http://localhost:" + port )
		
		app.listen(port)

	},
	use(path, plugin) {
		if (path && plugin) {
			app.use(path, plugin)
			return
		}
		app.use(path)
	},
	cache(key, value, exp) {
		return cache(key, value, exp)
	}
}

var methods = ['get', 'post', 'put', 'patch', 'delete']

methods.map((method) => {
	server[method] = (path, action) => {
		this.routes.push({ method, path, action })
	}
})

module.exports = server
