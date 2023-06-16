const fs = require('fs')
const path = require('path')

const interfaceDefinition = require('./interface-definition')

const jsonfile = process.argv[process.argv.length - 1];

const { dir } = path.parse(jsonfile);

const { name } = path.parse(dir);

const json = require(jsonfile);

const content = interfaceDefinition(json, {
  exportInterfaceName: name,
})

fs.writeFileSync(`${dir}/${name}.type.ts`, content)
