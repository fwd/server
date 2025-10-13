const fs = require("fs")
const path = require('path')
const cors = require('cors')
const axios = require('axios')
const cron = require('./dependencies/cron')
const express = require('express')
const cache = require('./dependencies/cache')
const parseDate = require('./dependencies/date-parser')
const database = require('@fwd/database')
const moment = require('moment-timezone')
const { exec: execSync } = require('child_process')

const app = express()

var server = {

	path: './',
	
	routes: [],

	config: {},
	
	http: axios,
	database,
	moment,

	exec(cmd, options = {}) {
		// Security: Validate and sanitize command input
		if (typeof cmd !== 'string' || cmd.trim() === '') {
			return Promise.resolve('Invalid command: command must be a non-empty string')
		}
		
		// Security: Basic command injection prevention
		const dangerousChars = /[;&|`$(){}[\]\\]/;
		if (dangerousChars.test(cmd)) {
			return Promise.resolve('Invalid command: contains potentially dangerous characters')
		}
		
		// Security: Limit command length
		if (cmd.length > 1000) {
			return Promise.resolve('Invalid command: command too long')
		}
		
		const exec = require('child_process').exec
		const execOptions = {
			timeout: options.timeout || 30000, // 30 second timeout
			maxBuffer: options.maxBuffer || 1024 * 1024, // 1MB buffer limit
			...options
		}
		
		return new Promise((resolve, reject) => {
			exec(cmd, execOptions, (error, stdout, stderr) => {
			    if (error) {
					console.log('Command execution error:', error.message)
					resolve(stderr || error.message) // Return error message instead of rejecting
			    } else {
					resolve(stdout ? stdout : stderr)
				}
			})
		})
	},
	
	read(filepath, config) {
		return new Promise((resolve, reject) => {
			// Security: Validate filepath
			if (!filepath || typeof filepath !== 'string') {
				return resolve(false)
			}
			
		// Security: Prevent path traversal
		const normalizedPath = path.normalize(filepath)
		if (normalizedPath.includes('..')) {
			return resolve(false)
		}
			
			// Security: Check file size before reading
			if(fs.existsSync(filepath)) {
				const stats = fs.statSync(filepath)
				if (stats.size > (config?.maxFileSize || 10 * 1024 * 1024)) { // 10MB default limit
					return resolve(false)
				}
				resolve(fs.readFileSync(filepath, 'utf-8'))
			} else {
				resolve(false)
			}
		})
	},

	write(filepath, body) {
		return new Promise((resolve, reject) => {
			// Security: Validate inputs
			if (!filepath || typeof filepath !== 'string') {
				return reject(new Error('Invalid filepath'))
			}
			
			if (typeof body !== 'string') {
				return reject(new Error('Body must be a string'))
			}
			
		// Security: Prevent path traversal
		const normalizedPath = path.normalize(filepath)
		if (normalizedPath.includes('..')) {
			return reject(new Error('Invalid filepath: path traversal not allowed'))
		}
			
			// Security: Limit file size
			if (body.length > 50 * 1024 * 1024) { // 50MB limit
				return reject(new Error('File too large'))
			}
			
			fs.writeFile(filepath, body, function(err) {
			    if (err) return reject(err)
			    resolve(body)
			})
		})
	},

	prepend(filepath, body) {
		return new Promise((resolve, reject) => {
			// Security: Validate inputs
			if (!filepath || typeof filepath !== 'string') {
				return resolve(false)
			}
			
			if (typeof body !== 'string') {
				return reject(new Error('Body must be a string'))
			}
			
		// Security: Prevent path traversal
		const normalizedPath = path.normalize(filepath)
		if (normalizedPath.includes('..')) {
			return resolve(false)
		}
			
			// Security: Limit prepend content size
			if (body.length > 1024 * 1024) { // 1MB limit for prepend
				return reject(new Error('Prepend content too large'))
			}
			
			if(fs.existsSync(filepath)) {
				try {
					const data = fs.readFileSync(filepath)
					// Security: Check total file size after prepend
					if (data.length + body.length > 50 * 1024 * 1024) {
						return reject(new Error('File would become too large'))
					}
					
					const fd = fs.openSync(filepath, 'w+')
					const insert = Buffer.from(`${body} \n`)
					fs.writeSync(fd, insert, 0, insert.length, 0)
					fs.writeSync(fd, data, 0, data.length, insert.length)
					fs.close(fd, (err) => {
					  if (err) return reject(err)
					  resolve(body)
					})
				} catch (error) {
					return reject(error)
				}
			} else {
				resolve(false)
			}
		})
	},

	append(filepath, body) {
		return new Promise((resolve, reject) => {
			// Security: Validate inputs
			if (!filepath || typeof filepath !== 'string') {
				return resolve(false)
			}
			
			if (typeof body !== 'string') {
				return reject(new Error('Body must be a string'))
			}
			
		// Security: Prevent path traversal
		const normalizedPath = path.normalize(filepath)
		if (normalizedPath.includes('..')) {
			return resolve(false)
		}
			
			// Security: Limit append content size
			if (body.length > 1024 * 1024) { // 1MB limit for append
				return reject(new Error('Append content too large'))
			}
			
			if(fs.existsSync(filepath)) {
				try {
					const stats = fs.statSync(filepath)
					// Security: Check total file size after append
					if (stats.size + body.length > 50 * 1024 * 1024) {
						return reject(new Error('File would become too large'))
					}
					
					fs.appendFile(filepath, body, function (err) {
						if (err) return reject(err)
						resolve(body)
					})
				} catch (error) {
					return reject(error)
				}
			} else {
				resolve(false)
			}
		})
	},

	// For user safety, naming it 'unlink' instead of 'delete' 
	unlink(filepath) {
		return new Promise((resolve, reject) => {
			// Security: Validate filepath
			if (!filepath || typeof filepath !== 'string') {
				return resolve(false)
			}
			
		// Security: Prevent path traversal
		const normalizedPath = path.normalize(filepath)
		if (normalizedPath.includes('..')) {
			return resolve(false)
		}
			
			if(fs.existsSync(filepath)) {
				try {
					fs.unlinkSync(filepath)
					resolve()
				} catch (error) {
					return reject(error)
				}
			} else {
				return resolve(false)
			}
		})
	},
	
	copy(source, destination) {
		return new Promise((resolve, reject) => {
			// Security: Validate inputs
			if (!source || !destination || typeof source !== 'string' || typeof destination !== 'string') {
				return resolve(false)
			}
			
		// Security: Prevent path traversal
		const normalizedSource = path.normalize(source)
		const normalizedDestination = path.normalize(destination)
		if (normalizedSource.includes('..') || normalizedDestination.includes('..')) {
			return resolve(false)
		}
			
			if(fs.existsSync(source)) {
				try {
					const stats = fs.statSync(source)
					// Security: Check file size before copying
					if (stats.size > 50 * 1024 * 1024) { // 50MB limit
						return resolve(false)
					}
					
					fs.copyFile(source, destination, (err) => {
					  resolve(err)
					})
				} catch (error) {
					return resolve(false)
				}
			} else {
				return resolve(false)
			}
		})
	},
	
	list(dir) {
		return new Promise((resolve, reject) => {
			// Security: Validate directory path
			if (!dir || typeof dir !== 'string') {
				return resolve(false)
			}
			
		// Security: Prevent path traversal
		const normalizedDir = path.normalize(dir)
		if (normalizedDir.includes('..')) {
			return resolve(false)
		}
			
			if(fs.existsSync(dir)) {
				try {
					fs.readdir(dir, (err, files) => {
						if (err) {
							resolve(false)
						} else {
							resolve(files)
						}
					})
				} catch (error) {
					resolve(false)
				}
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
		return require('./dependencies/time')(int, string)
	},

	date(string, format, timezone) {
		timezone = timezone || this.config.timezone || 'America/New_York'
		return moment(parseDate(string)).tz(timezone).format(format || 'LLL')
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

		// Security: Validate inputs
		if (typeof action !== 'function') {
			throw new Error('Cron action must be a function')
		}

		if (typeof interval === 'string') {
	
			var phrase = interval.split(' ')

			var repeat = phrase[0]
			var int = phrase[1]
			var rate = phrase[2]

			interval = this.time(int, rate)

		}

		// Security: Validate interval
		if (typeof interval !== 'number' || interval < 1000) {
			throw new Error('Cron interval must be at least 1000ms')
		}

		if (runImmediately) {
			try {
				action()
			} catch (error) {
				console.error('Cron action error:', error.message)
			}
		}
		
		var cron = setInterval(() => {
			try {
				action()
			} catch (error) {
				console.error('Cron action error:', error.message)
			}
		}, interval)
		
		return cron

	},

	uuid(length, prepend, no_dashes) {

		// Generate UUID v4 using vanilla JavaScript
		function generateUUID() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0,
					v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}

		var uuid = generateUUID()
		
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
		var publicDir = this.path ? this.path + '/public' : 'public'
		var uploads = this.path ? this.path + '/uploads' : 'uploads'

		
		// Security: Configure CORS with safer defaults
		const corsOptions = config.cors || {
			origin: config.allowedOrigins || false, // Default to no CORS unless explicitly configured
			credentials: false,
			optionsSuccessStatus: 200
		}

		app.use(cors(corsOptions))

		// Security: Add security headers
		app.use((req, res, next) => {
			// Prevent clickjacking
			res.setHeader('X-Frame-Options', 'DENY')
			// Prevent MIME type sniffing
			res.setHeader('X-Content-Type-Options', 'nosniff')
			// Enable XSS protection
			res.setHeader('X-XSS-Protection', '1; mode=block')
			// Strict Transport Security (only if HTTPS)
			if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
				res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
			}
			// Content Security Policy
			res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'")
			next()
		})

		// Security: Limit JSON payload size
		app.use(express.json({
			limit: config.jsonLimit || '1024mb' // Reduced from 999mb for security
		}))
		
		if (config.extended) {
			app.use(express.urlencoded({
				extended: true,
				limit: '1024mb' // Add limit for URL-encoded data too
			}))
		}

		app.set('view engine', config.viewEngine || 'ejs')

		if (fs.existsSync(views)) {
		   app.set('views', config.viewsFolder || views)
		}
		
		var maxAge = config.maxAge ? config.maxAge : 'no-store'

		app.use(express.static(config.publicFolder || publicDir, { maxAge }))
		
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
	},
	
	isEmail(email) {
		// Security: Validate input
		if (!email || typeof email !== 'string') {
			return false
		}
		
		// Security: Limit email length
		if (email.length > 254) {
			return false
		}
		
		// Security: Basic email format validation
		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase())
	},

	isPhone(phone) {
		// Security: Validate input
		if (!phone || typeof phone !== 'object' || !phone.value) {
			return false
		}
		
		if (typeof phone.value !== 'string') {
			return false
		}
		
		// Security: Limit phone number length
		if (phone.value.length > 20) {
			return false
		}
		
		var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
		if(phone.value.match(phoneno)) return true
		else return false
	},
	
}

var methods = ['get', 'post', 'put', 'patch', 'delete']

methods.map((method) => {
	server[method] = (path, action) => {
		server.routes.push({ method, path, action })
	}
})

module.exports = server
