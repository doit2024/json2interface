const interfaceDefinition = require('./definition')

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function json2interface(json, uri) {
  const result = interfaceDefinition(json, {
    exportInterfaceName: `I${capitalize(uri.dir)}${capitalize(uri.page)}`,
  })
  return result;
}

module.exports = {
  json2interface,
}
