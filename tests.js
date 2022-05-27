const server = require('./index')

function log(one, two, type) {
	console.log('\x1b[33m%s\x1b[0m', `${one}${two}`);
}

;(async () => {

	console.log('-----Exec----')
	console.log('server.exec(\'pwd\'): ', (await server.exec('pwd')).replace('\n', ''))

	await server.sleep(1000)
	console.log('-----Sleep----')

	console.log('Waiting for 2 seconds.', await server.wait(2000) ? 'Waited' : '') // server.sleep(1000) is the same
	// console.log('Timestamp:', server.moment().format('LLLL')) 

	await server.sleep(1000)
	console.log('-----Timestamps----')
	console.log('server.timestamp(): ', server.moment() ? 'Ok' : 'Error') 
	console.log('server.timestamp(L): ', server.timestamp('L') ? 'Ok' : 'Error') 
	console.log('server.timestamp(LL): ', server.timestamp('LL') ? 'Ok' : 'Error') 
	console.log('server.timestamp(LLL): ', server.timestamp('LLL') ? 'Ok' : 'Error') 
	console.log('server.timestamp(LLLL): ', server.timestamp('LLLL') ? 'Ok' : 'Error') 

	await server.sleep(1000)
	console.log('-----Natural Language Time----')
	console.log('server.time(1, \'minute\'): ', server.time(1, 'minute') ? 'Ok' : 'Error') 
	console.log('server.time(24, \'hours\'): ', server.time(1, 'hours') ? 'Ok' : 'Error') 

	console.log('Moment:', typeof server.moment() === 'object' ? 'Ok' : 'Error' )
	console.log('Moment:', server.moment().format('LLLL') ? 'Ok' : 'Error' )
	console.log('Moment (fromNow):', server.moment().fromNow() ? 'Ok' : 'Error' )

	await server.sleep(1000)

	console.log('-----Cron----')

	var check = []
	var index = 0

	server.cron(() => {
		console.log("Hello")
		if (index >= 5) clearInterval(interval)
		if (index < 5) {
			check.push('1')
			index++
		}
	}, 'every 5 seconds')

	log(`server.cron: `, check.length === 5 ? 'Ok' : 'Error' + check)

	await server.sleep(5000)

	console.log('-----UUID----')

	console.log("Regular", await server.uuid() )
	console.log("24 Char Long, Prepended, With No Dashes:", await server.uuid(24, 'MY-KEY-', true) )

	await server.sleep(1000)
	console.log('-----In-Memory Caching-----')

	server.cache('hello', { id: 5 })
	console.log( server.cache('hello') )

	await server.sleep(1000)

	console.log('-----Database (JSON)----')

	var database = server.database('local', { database: 'database.json' })
	console.log('server.database.create: ', await database.create('users', { name: 'Joe' }) ? 'Ok' : 'Error' )
	var joe_json = await database.findOne('users', { name: 'Joe' })
	console.log('server.database.get: ', (await database.get('users')).length > 0 ? 'Ok' : 'Error' )
	console.log('server.database.findOne: ', joe_json ? 'Ok' : 'Error' )
	console.log('server.database.update: ', await database.update('users', joe_json.id, { last: 'Joe' }) ? 'Ok' : 'Error' )
	await database.remove('users', joe_json.id) 
	console.log('server.database.remove: ', !(await database.findOne('users', { name: 'Joe' })) ? 'Ok' : 'Error' )

	await server.sleep(1000)

	console.log('-----Database (LowDB)----')

	var database = server.database('lowdb', { database: 'database.json' })
	console.log('server.database.create: ', await database.create('users', { name: 'Joe' }) ? 'Ok' : 'Error' )
	var joe_lowdb = await database.findOne('users', { name: 'Joe' })
	console.log('server.database.findOne: ', joe_lowdb ? 'Ok' : 'Error' )
	console.log('server.database.update: ', await database.update('users', joe_lowdb.id, { last: 'Joe' }) ? 'Ok' : 'Error' )
	console.log('server.database.findOne: ', joe_lowdb ? 'Ok' : 'Error' )
	console.log('server.database.update: ', await database.update('users', joe_lowdb.id, { last: 'Joe' }) ? 'Ok' : 'Error' )
	await database.remove('users', joe_lowdb.id) 
	console.log('server.database.remove: ', !(await database.findOne('users', { name: 'Joe' })) ? 'Ok' : 'Error' )

	server.unlink('./database.json')

	await server.sleep(1000)

	console.log('-----File Editing----')

	var original = 'Original'
	var prepend = 'Prepend'
	var append = 'Append'

	await server.unlink('hello.txt')

	await server.write('hello.txt', original)
	await server.prepend('hello.txt', prepend)
	await server.prepend('hello.txt', append)

	var file = await server.read('hello.txt')

	console.log( "server.read: ", file ? 'Ok' : 'Error:' + file )
	
	console.log( "server.write: ", file && file.includes(original) ? 'Ok' : 'Error:' + file )
	console.log( "server.prepend: ", file && file.includes(prepend) ? 'Ok' : 'Error:' + file )
	console.log( "server.append: ", file && file.includes(append) ? 'Ok' : 'Error:' + file )
	
	await server.unlink('hello.txt')

	console.log( "server.unlink: ", await server.read('hello.txt') ? 'Ok' : 'Error:' + file )

	await server.sleep(1000)

})()