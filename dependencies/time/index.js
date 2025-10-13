module.exports = (int, string) => {

  if (!int || !string) {
    throw "Int or String not provided";
    return
  }

  if (string === 'seconds' || string === 'second') {
    return int * 1000
  }

  if (string === 'minutes' || string === 'minute') {
    return int * 60000
  }

  if (string === 'hours' || string === 'hour') {
    return int * 3600000
  }

  if (string === 'months' || string === 'month') {
    var hoursInAMonth = 730.001
    var millisecondsInAMonth = hoursInAMonth * 3600000
    return int * millisecondsInAMonth
  }

  if (string === 'years' || string === 'year') {
    var hoursInAYear = 8760
    var millisecondsInAYear = hoursInAYear * 3600000
    return int * millisecondsInAYear
  }

}
