const _ = require('lodash')
const fs = require('fs')
const ejs = require('ejs')
const express = require('express')
const cors = require('cors')
const path = require('path')
const cache = require('memory-cache')
const app = express();
const axios = require('axios');

const low = require('lowdb')

const FileSync = require('lowdb/adapters/FileAsync')

// helpers
_.clone = function(data) {
	return JSON.parse(JSON.stringify(data))
}

var server = {
	path: './',
	routes: [],
	http: axios,
	utilities: _,
	wait(delay) {
		return this.sleep(delay)
	},
	exec(cmd) {

		const exec = require('child_process').exec;
		
		return new Promise((resolve, reject) => {
			exec(cmd, (error, stdout, stderr) => {
			    if (error) {
				console.log(error);
			    }
			    resolve(stdout ? stdout : stderr);
			})
		});
		
	},
	sleep(delay) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve()
			}, delay)
		})
	},
	time(int, string) {
		var ms
		if (string === 'seconds' || string === 'second') {
			ms = int * 1000
		}
		if (string === 'minutes' || string === 'minute') {
			ms = int * 60000
		}
		if (string === 'hours' || string === 'hour') {
			ms = int * 3600000
		}
		return ms
	},
	timestamp(format, timezone) {

		var moment = require('moment')

		var timestamp = moment()

		if (timezone) {
			
			require('moment-timezone')

			if (timezone === 'us-east') timezone = 'America/New_York'
			if (timezone === 'us-west') timezone = 'America/Los_Angeles'

			timestamp = timestamp.tz(timezone)
		}

		if (format) {
			timestamp = timestamp.format(format || 'LLL')
		} else {
			timestamp = timestamp.unix()
		}

		return timestamp

	},
	cron(action, interval) {

		var phrase = interval.split(' ')

		var repeat = phrase[0]
		var int = phrase[1]
		var rate = phrase[2]

		interval = this.time(int, rate)

		setInterval(() => {
			action()
		}, interval)

	},
	database: {
		create(key, value, database) {
			return new Promise((resolve) => {
				const path = server.path ? server.path + '/' : './'
				const adapter = new FileSync(`${path}${database ? database + '.json' : 'db.json'}`)
				low(adapter).then((db) => {	
					var defaults = {}
					if (!db.get(key).value()) {
						defaults[key] = []
					}
					db.defaults(defaults).write()
					if (typeof value === "object" && !value.id) {
						value.id = server.uuid()
					}
					db.get(key).push(value).write().then((item) => {
						resolve(value)
					})
				})
			})
		},
		set(key, value, database) {
			return new Promise((resolve) => {
				const path = server.path ? server.path + '/' : './'
				const adapter = new FileSync(`${path}${database ? database + '.json' : 'db.json'}`)
				low(adapter).then((db) => {	
					var defaults = {}
					if (!db.get(key).value()) {
						defaults[key] = []
					}
					db.defaults(defaults).write()
					if (typeof value === "object" && !value.id) {
						value.id = server.uuid()
					}
					db.set(key, value).write().then((item) => {
						resolve(value)
					})
				})
			})
		},
		update(key, id, update, database) {
			return new Promise((resolve) => {
				const path = server.path ? server.path + '/' : './'
				const adapter = new FileSync(`${path}${database ? database + '.json' : 'db.json'}`)
				low(adapter).then((db) => {	
					db.get(key).find({ id: id }).assign(update).write().then((item) => {
						resolve(update)
					})
				})
			})
		},
		remove(key, id, database) {
			return new Promise((resolve) => {
				const path = server.path ? server.path + '/' : './'
				const adapter = new FileSync(`${path}${database ? database + '.json' : 'db.json'}`)
				low(adapter).then((db) => {	
					db.get(key).remove({ id: id }).write().then(() => {
						resolve()
					})
				})
			})
		},
		find(key, query, database) {
			return new Promise((resolve) => {
				const path = server.path ? server.path + '/' : './'
				const adapter = new FileSync(`${path}${database ? database + '.json' : 'db.json'}`)
				low(adapter).then((db) => {	
					var results = db.get(key).value()
					if (!query || !Array.isArray(results)) {
						resolve(results)
						return
					}
					if (!results) {
						resolve([])
						return
					}
					results = results.filter(function(item) {
					  for (var key in query) {
					    if (item[key] === undefined || item[key] != query[key])
					      return false;
					  }
					  return true;
					})
					resolve(results)
				})
			})
		}
	},
	uuid() {
		return 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		})
	},

	generate(template, data, distpath) {

		var views = this.path ? this.path + '/views' : 'views'

		var public = this.path ? this.path + '/public' : 'public'
		
		var string = fs.readFileSync(`${views}/${template}.ejs`, 'utf-8');

		if (distpath) {
			
			var destination = require('parse-filepath')(distpath)

			if (!fs.existsSync(destination.dir)) {
			    fs.mkdirSync(destination.dir, { recursive: true });
			}

		}

		fs.writeFileSync(distpath || `${public}/${template}.html`, ejs.render(string, data));

	},

	start(port, path) {

		var config = this.cache('server_config') || {}

		if (path) this.path = path

		var views = this.path ? this.path + '/views' : 'views'
		var public = this.path ? this.path + '/public' : 'public'
		var uploads = this.path ? this.path + '/uploads' : 'uploads'

		app.use(cors())

		app.use(express.json({
			limit: config.jsonLimit || '999mb'
		}))

		app.set('view engine', config.viewEngine || 'ejs');

		app.set('views', config.viewFolder || views);

		app.use(express.static(config.publicFolder || public))

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
		
		console.log("http://localhost:" + port)
		
		app.listen(port)

	},
	use(path, plugin) {
		if (path && plugin) {
			app.use(path, plugin)
			return
		}
		app.use(path)
	},
	log(message) {
		if (!message) {
			return server.cache('server_logs') 
		}
		if (server.cache('server_logs')) {
			var logs = server.cache('server_logs')
				logs.push(message)
			server.cache('server_logs', logs, 86400000) // 24 hour retention
			return
		}
		var logs = []
			logs.push(message)
			server.cache('server_logs', logs, 86400000) // 24 hour retention
	},
	cache(key, value, exp) {
		if (key && value) {
			cache.put(key, JSON.stringify(value), exp, function(key, value) {}) // Time in ms
			return
		}
		if (key && !value) {
			return JSON.parse(cache.get(key))
		}
	},
	config(value) {

		if (value) {
			cache.put('server_config', JSON.stringify(value), null, function(key, value) {}) // Time in ms
			return
		}

		if (!value) {
			return JSON.parse(cache.get('server_config'))
		}
		
	},
}

var methods = ['get', 'post', 'put', 'patch', 'delete']

methods.map((method) => {
	server[method] = function(path, action) {
		this.routes.push({
			method: method,
			path: path,
			action: action
		})
	}
})

module.exports = server
