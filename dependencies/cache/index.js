const cache = require('./cache')

module.exports = (key, value, exp, callback) => {

  if (key && value) {
    cache.put(key, value, exp, function(key, value) {
    	if (callback) {
    		callback(key, value)
    	}
    })
    return
  }

  if (key && !value) {
    return cache.get(key)
  }

}
