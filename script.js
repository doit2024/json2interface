#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const interfaceDefinition = require('./definition')

const lastArgv = process.argv[process.argv.length - 1];

if (/json$/.test(lastArgv)) {
  handleJsonFile(lastArgv);
} else {
  jsonString2interface(lastArgv);
}

function handleJsonFile(jsonfile) {
  const { dir } = path.parse(jsonfile);
  
  const { name } = path.parse(dir);
  
  const json = require(jsonfile);
  
  const content = interfaceDefinition(json, {
    exportInterfaceName: `${name}_json`,
  })
  
  fs.writeFileSync(`${dir}/${name}_json.type.ts`, content)
}
