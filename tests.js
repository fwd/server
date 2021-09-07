const server = require('../index')

;(async () => {

	console.log('Exec command')
	console.log( await server.exec('pwd') )

	console.log('Wait')
	await server.wait(1000)
	console.log('One second later...')

	console.log('Sleep')
	await server.sleep(1000)
	console.log('Another second later...')

	console.log('Time')
	console.log( await server.time(1, 'second') )
	console.log('Should be 1000 ms')

	console.log('Encrypt')
	var secret = 'password'
	var encrypted = await server.encrypt(secret)
	console.log( "encrypted", encrypted )
	console.log('Decrypt')
	console.log( "Real", await server.decrypt(encrypted, secret) )
	console.log( "Fake", await server.decrypt(encrypted, secret + '1') )
	// console.log('Should be 1000 ms')

	console.log('Timestamp')
	console.log( await server.timestamp('LLL') )
	console.log( await server.timestamp('LLL', 'us-east') )
	console.log( await server.timestamp('LLL', 'us-west') )
	// console.log('Should be 1000 ms')

	console.log('Cron')

	var interval = await server.cron(() => {
		console.log("Hello")
	}, 'every 5 seconds')

	await server.sleep(1000)
	clearInterval(interval)

	console.log('UUID')
	console.log("Regular", await server.uuid() )
	console.log("Exsacly 7 chars long", await server.uuid(7) )
	console.log("Exsacly 7 chars long", await server.uuid(null, 5, 'PRIVATE-') )
	console.log("No dashes", await server.uuid(null, 5, 'PRIVATE-', true) )

	console.log('Cache')
	server.cache('hello', { id: 5 })
	await server.sleep(1000)
	console.log( server.cache('hello') )

	console.log("Database")
	var database = server.database('local', {
		database: 'database1.json'
	})

	await database.create('users', { id: 1, name: 'Joe' })
	console.log( await database.get('users', { name: 'Joe' }) )
	
	var database = server.database('local', {
		database: 'database2.json'
	})

	await database.create('users', { id: 2, name: 'Joe' })
	console.log( await database.get('users', { name: 'Joe' }) )

})()