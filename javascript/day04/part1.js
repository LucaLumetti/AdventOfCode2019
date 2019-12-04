let range = [147981, 691423]

function meetCriteria(password){
  password = `${password}`
  if(!password.match(/(\d)\1/g))
    return false
  if(password.split('').sort().join('') != password)
    return false
  return true
}

console.log((new Array(range[1]-range[0])).fill(0).map((v, i) => i+range[0]).filter(meetCriteria).length)
