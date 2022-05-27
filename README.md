![Cover](https://raw.githubusercontent.com/fwd/server/master/.github/banner.png)

# @fwd/server

> NodeJS Web Toolkit

## Features

- [Full Web Server (ExpressJS)](#advanced-example)
- [HTTP Library (Axios)](#built-in-http-client-axios)
- [In-Memory Manager](#in-memory-caching)
- [SQL-Like JSON Database](#built-in-database-json-file)
- [Crypto UUID Generator](#generate-crypto-uuid)
- [Natural Language Date Parsing](#natural-language-date-parsing)
- [Natural Language Timestamps](#natural-language-timestamps)
- [Natural Language Cron](#natural-language-cron)
- [Filesystem Read/Write](#built-in-file-readwrite)
- [Filesystem Prepend/Append](#built-in-uuid-generator)
- [Execute Shell from NodeJS](#execute-shell-from-nodejs)

## Install

```bash
npm install fwd/server
```

## Import

```bash
const server = require('@fwd/server')
```

## Basic Example

```js
server.get('/', (req, res) => {
	res.send("Hello, World!")
}) 

server.start(8080)
```

> Static files will be served from **/public** by default.

## Advanced Example

```js
server.get('/', async (req, res) => {
	var settings = await server.database.get('settings')
	res.render('index', { config: settings, query: req.query }) // /views/index.ejs
})

server.post('/register', async (req, res) => {

	var user = await server.database.create('users', {
		id: server.uuid(),
		name: req.body.name,
		created_at: server.timestamp()
	})
	
	// fetching it again just to show off API
	user = await server.database.findOne('users', { name: req.body.name })
	
	res.send(user)
	
})

server.get('/joke', async (req, res) => {
	
	var joke = (await server.http.get('https://api.chucknorris.io/jokes/random')).data
	
	res.send( { joke } )

})

server.get('/user/:id', async (req, res) => {

	var user = await server.database.findOne('users', { id: req.params.id })

	if (!user) return res.send({ error: 401 })
	
	res.send({ user })

})

server.start(8080, {
   timezone: 'America/New_York' // optional, just showing it off
}) 
```

## HTTP Middleware

```js
server.get('/', (req, res) => {
	res.send("Hello, World!")
})

server.use((req, res, next) => {
	// do stuff
	console.log( req.ip, req.originalUrl )
	next()
})

server.start(8080)
```

> Includes **CORS** and **EJS** rendering for your convenience.

## Built-in HTTP Client (Axios)

```js
;(async () => {
	var joke = await server.http.get('https://api.chucknorris.io/jokes/random')
	console.log( joke.data )
})()
```

## Built-in Database (JSON File) 

```js
const database = server.database
;(async () => {
	await database.get('users') // list all users
	await database.create('users', { name: john }) // creates user, id & create_at will be generated if not provided
	await database.find('users', { name: 'Joe' }) // Filter users by query
	await database.findOne('users', { id: 1 }) // find user with id of 1
	await database.update('users', 1, { name: "John" }) // update user with id of 1 
	await database.remove('users', 1)  // remove user with id of 1
})()

```

Dedicated Github: [@fwd/database](https://github.com/fwd/database)

## In-Memory Caching

```js
server.cache('unique_key', { fname: 'Joe' })

console.log( server.cache('unique_key') ) // { fname: 'Joe' }
```

## Natural Language Date Parsing

> Added September 7th, 2021

```js
console.log( server.date('next friday') )
// Fri Sep 12 2014 12:00:00 GMT-0500 (CDT)
```

More info: [@fwd/time](https://github.com/fwd/time)

## Natural Language Timestamps

```js
server.time(5, 'seconds') // 5000
server.time(1, 'minute') // 60000

// example
setInterval(() => {
	console.log("The time is:", server.timestamp('LLLL'))
}, server.time(24, 'minutes'))
```

## Simple Timestamps

```js
server.timestamp() // UNIX timestamp
server.timestamp('LL') // September 28, 1994
server.timestamp('LLL') // September 28, 1994 4:30PM
server.timestamp('LLL', 'America/New_York') // Optional, pass timezone.
```

More info: [@fwd/cache](https://github.com/fwd/cache)

## Natural Language Cron

```js
server.cron(() => {
	console.log("The time is:", server.timestamp('LLLL'))
}, 'every 1 hour')
```

More info: [@fwd/cron](https://github.com/fwd/cron)

## Generate Crypto UUID

```js
const server = require('@fwd/server')

server.uuid() // 9e471b08-38fe-11eb-adc1-0242ac120002 
server.uuid(true) // short uuid, 9e471b08
```

## Execute Shell from NodeJS

```js
;(async () => {
	var cpu_usage = await server.exec(`awk '/cpu /{print 100*($2+$4)/($2+$4+$5)}' /proc/stat`)
	console.log( cpu_usage )
})()

```

## Built-in File Read/Write 

```js
;(async () => {
	var data = await server.read('./grades.csv')
	console.log( data )
})()
```

#### Write File

```js
;(async () => {
	
	var data = await server.write('./notes.txt', 'John Doe')

	console.log( data )

})()
```

#### Append a File

```js
;(async () => {
	var data = await server.append('./names.txt', 'John Doe')
	console.log( data )
})()

```

#### Prepend a File

```js
;(async () => {
	var data = await server.prepend('./names.txt', 'Joe Mama')
	console.log( data )
})()

```

### MomentJS Included

```js
console.log(server.moment().format('LLLL'))
console.log(server.moment().fromNow())
```

## 👤 Author

**Fresh Web Designs**

📍 Miami, Florida (Crypto Capital of the World)

* Github: [@fwd](https://github.com/fwd)
* Website: [https://fwd.dev](https://fwd.dev)

## 🤝 Contributing

Give a ⭐️ if this project helped you!

Contributions, issues and feature requests are welcome! Feel free to check [issues page](https://github.com/fwd/server/issues).

## ♥️ Donate 

We accept Crypto donations at the following addresses: 

https://nano.to/Development

```
# Nano
nano_3gf57qk4agze3ozwfhe8w6oap3jmdb4ofe9qo1ra3wcs5jc888rwyt61ymea
```

## 📝 License

MIT License

Copyright © 2022 [Fresh Web Designs](https://fwd.dev).

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Stargazers

[![Stargazers over time](https://starchart.cc/fwd/server.svg)](https://starchart.cc/fwd/server)
