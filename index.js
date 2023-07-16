const interfaceDefinition = require('./definition')

function jsonString2interface(jsonString) {
  try {
    const json = JSON.parse(jsonString);
    json2interface(json);
  } catch(e) {
    throw e;
  }
}

function json2interface(json) {
  const content = interfaceDefinition(json, {
    exportInterfaceName: 'IResult',
  })
  console.log(content);
}

module.exports = {
  json2interface,
  jsonString2interface,
}
