![Cover](https://raw.githubusercontent.com/fwd/server/master/.github/cover.png)

<h1 align="center">@fwd/server 🦾</h1>

> A wrapper around ExpressJS that that makes web development actually fun. 

## Install

```sh
npm install @fwd/server
```

## Usage

### Basic Example

```js

const server = require('@fwd/server')

server.get('/', (req, res) => {
	res.render('index', {
		message: "Hello, World!"
	})
})

server.start(process.argv[2] || 80, __dirname)

```

## Available Methods

### sleep

```js

;(async () => {
	await server.sleep(1000)
})()

```

### time

```js

server.time(1, 'hour') // 1 hour in milliseconds

```

### timestamp

```js

server.timestamp() // UNIX timestamp
server.timestamp('LL') // September 28, 1994
server.timestamp('LLL') // September 28, 1994 4:30PM

```

### cron

```js

server.cron(() => {
	console.log("Hello")
}, 'every 1 hour')

```

### database

```js

;(async () => {
	await server.database.find('users', { id: 1 }) // find user with id of 1
	await server.database.update('users', 1, { name: "John" }) // update user with id of 1 
	await server.database.remove('users', 1)  // remove user with id of 1
	await server.database.create('users', { name: john }) // creates user, id will be generated if not provided 
})()

```

### uuid

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

Contributions, issues and feature requests are welcome! <br />Feel free to check [issues page](https://github.com/fwd/server/issues).

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
