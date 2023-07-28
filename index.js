const interfaceDefinition = require('./definition')

function json2interface(json, exportInterfaceName = 'IResult', isDeclare = false) {
  const result = interfaceDefinition(json, {
    exportInterfaceName,
  })
  if (isDeclare) {
    return result.replace(/export\s/g, 'declare ');
  }
  return result;
}

module.exports = {
  json2interface,
}
