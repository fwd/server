![Cover](https://raw.githubusercontent.com/fwd/server/master/.github/banner.png)

# fwd/server

> Open Source Back-end Development Framework for NodeJS.

#### This package is in active development by the team at [Formsend](https://formsend.org). Pull requests and feature requests are welcomed.

## Install

```sh
npm install fwd/server
```

## Usage

### HTTP Server Example (ExpressJs)

```js

const server = require('@fwd/server')


server.use((req, res, next) => {
	// middleware
	next()
})

server.get('/', (req, res) => {
	res.send("Hello, World!")
})

server.post('/login', async (req, res) => {

	var user = await server.database.create('users', {
		id: server.uuid(),
		name: req.body.name,
		password: await server.encrypt(req.body.password),
		created: server.timestamp()
	})
	
	res.send(user)
	
})

server.start(8080, {
	timezone: 'America/New_York' // how many headaches will this save
})

```

### Middleware

```js

const server = require('@fwd/server')

server.use((req, res, next) => {
	console.log( req.originalUrl )
	next()
})

server.get('/', (req, res) => {
	res.send("Hello, World!")
})

server.start(8080)

```

## Available Methods


### Date (Chrono-node)

> Added September 7th, 2021

```js

server.date('An appointment on Sep 12-13-2014');
// Fri Sep 12 2014 12:00:00 GMT-0500 (CDT)

```

### Database

```js

;(async () => {
	await server.database.create('users', { name: john }) // creates user, id will be generated if not provided 
	await server.database.findOne('users', { id: 1 }) // find user with id of 1
	await server.database.update('users', 1, { name: "John" }) // update user with id of 1 
	await server.database.remove('users', 1)  // remove user with id of 1
})()

```

More info: [@fwd/database](https://github.com/fwd/database)


### Http (Axios)

```js

;(async () => {
	var joke = await server.http.get('https://api.chucknorris.io/jokes/random')
	console.log( joke.data )
})()

```

### Sleep

```js

;(async () => {
	await server.sleep(1000)
	await server.wait(1000) // alias
})() 

```

### Time

```js

server.time(1, 'hour') // 1 hour in milliseconds

```

More info: [@fwd/time](https://github.com/fwd/time)


### Timestamp

```js

server.timestamp() // UNIX timestamp
server.timestamp('LL') // September 28, 1994
server.timestamp('LLL') // September 28, 1994 4:30PM

```

### In-Memory Cache

```js

server.cache('unique_key', { fname: 'Joe' })

console.log( server.cache('unique_key') ) // { fname: 'Joe' }

```

More info: [@fwd/cache](https://github.com/fwd/cache)


### Cron

```js

server.cron(() => {
	console.log("Hello")
}, 'every 1 hour')

```

More info: [@fwd/cron](https://github.com/fwd/cron)

### UUID

```js
server.uuid() // 9e471b08-38fe-11eb-adc1-0242ac120002 
server.uuid(true) // short uuid, 9e471b08
```

## 👤 Author

**Forward Miami**

* Github: [@fwd](https://github.com/fwd)
* Website: [https://forward.miami](https://forward.miami)

## 🤝 Contributing

Give a ⭐️ if this project helped you!

Contributions, issues and feature requests are welcome! Feel free to check [issues page](https://github.com/fwd/server/issues).

## ♥️ Donate 

We accept Crypto donations at the following addresses: 

```
# Nano
nano_3gf57qk4agze3ozwfhe8w6oap3jmdb4ofe9qo1ra3wcs5jc888rwyt61ymea

# Bitcoin
bc1qcgvew2a7ta3f7xy5999tdwyd8clrvdtpe2uvj5

# Doge
D9U1FLygkMydx3DE2sXgnuFpHm7ePm3Zwe

# Ethereum
0xdD4691Dc9562FB262e4b2076bE255303243f271d
```

## 📝 License

MIT License

Copyright © 2021 [Forward Miami](https://forward.miami).

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
