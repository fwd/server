![Cover](https://raw.githubusercontent.com/fwd/server/master/.github/cover.png)

<h1 align="center">@fwd/server 🦾</h1>

> A full-stack NodeJS server built on ExpressJS, with lots of goodies to expedite development.

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

Contributions, issues and feature requests are welcome! Feel free to check [issues page](https://github.com/fwd/server/issues).

## ⭐️ Show your support

Give a star if this project helped you, and help us continue maintaining this project by contributing to it or becoming a sponsor.

[Become a sponsor to fwd](https://github.com/sponsors/fwd)

## 📝 License

Copyright © 2020 [Forward Miami](https://forward.miami). This project is [Apache-2.0](https://spdx.org/licenses/Apache-2.0.html) licensed.
