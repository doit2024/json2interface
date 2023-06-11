/* eslint-disable no-underscore-dangle */
const ExportEnum = {
  EXPORT: 2, // export
  EXPORT_DEFAULT: 3, // export default
}
// 接口名称
let interfaceName = 'Result'
// 直接拼接基本类型
const normalTypes = ['string', 'number', 'boolean', 'undefined']
// 处理数组
let arrs: { key: string, value: string }[] = []
let interfaceNames: string[] = []
let globalExportMode = ExportEnum.EXPORT_DEFAULT
let globalInterfaceNamePrefix = ''

// 生成的代码缩进 一个tab
const indent = '  '

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 获取接口名称
 * @param name 返回字段key
 * @returns {string} 返回处理过的名称
 */
function _getOnlyInterfaceName(name: string): string {
  if (!interfaceNames.includes(name)) {
    return name
  }
  // 取最后一位
  let lastCharacter = Number(name.slice(-1))

  if (lastCharacter >= 0 && lastCharacter <= 9) {
    lastCharacter = lastCharacter + 1
    return _getOnlyInterfaceName(name.substring(0, name.length - 1) + lastCharacter)
  }
  return _getOnlyInterfaceName(name + '1')

}

function _getBaseName(key: string) {
  const firstName = key.substring(0, 1)
  const lastName = key.substring(1)

  return firstName.toUpperCase() + lastName
}

function _getInterfaceName(key: string) {
  const arr = key.split('_')

  for (let i = 0; i < arr.length; i++) {
    arr[i] = _getBaseName(arr[i])
  }
  let fullName = arr.join('')

  fullName = globalInterfaceNamePrefix + _getBaseName(fullName)
  fullName = _getOnlyInterfaceName(fullName)
  interfaceNames.push(fullName)
  return fullName
}
function toCamelCase(str: string): string {
  return str.replace(/(^|_)([a-z])/g, (_, __, p1) => p1.toUpperCase())
}
/**
 * 如果是导出为默认，只能导出最外一级
 * @param name
 * @returns {string}
 * @private
 */
function _getRenderInterface(name: string) {
  const iName = `${globalInterfaceNamePrefix}${toCamelCase(interfaceName)}`

  if (globalExportMode === ExportEnum.EXPORT_DEFAULT && name === iName || name === iName) { // export default 只能导出第一级
    return `${globalExportMode === ExportEnum.EXPORT ? 'export' : globalExportMode === ExportEnum.EXPORT_DEFAULT ? 'export default' : ''} interface`
  }
  return `${globalExportMode === ExportEnum.EXPORT ? 'export ' : ''}interface`
}

function __getRenderInterfaceName(name: string) {
  if (name === globalInterfaceNamePrefix + interfaceName) {
    return `${name}`
  }
  return `${name}`

}

function _getRenderLeft() {
  return '{\n'
}

function _getRenderRight() {
  return '}\n'
}

function _getRenderKey(key: string) {
  return `${key}`
}

function _getRenderValue(value: string) {
  return ` ${value};\n`
}

/**
 * 判断数组是否为普通类型数组
 * @param arr
 * @returns {string}
 */
function _isBaseType(arr) {
  // 判断数组是否
  let type = typeof arr[0]

  for (let i = 1; i < arr.length; i++) {
    if (type !== typeof arr[i]) {
      return 'any'
    }
  }
  return type
}

/**
 * 处理数组
 * @param json 包含当前数组的json对象
 * @param key 数组对应的key
 * @param inters 拼接字符串
 * @param indent 缩进
 * @returns {*}
 */
function _handleArray(json, key, inters, indent) {
  if (json[key].length === 0) {
    inters += `${indent}${_getRenderKey(key)}:${_getRenderValue('any[]')}`
  } else {
    // 如果是个空数组或者数组里面为非对象
    if (Array.isArray(json[key][0])) {
      // 判断数组是否都为boolean number string等基本类型
      inters += `${indent}${_getRenderKey(key)}:${_getRenderValue('any[]')}`
    } else {
      // 有可能是对象也有可能是普通类型，如果是对象，类型按照第一个元素类型定义，如果都为普通类型，则指定为具体类型数组
      // 否则为any数组
      // 判断是否为 [1,2,3]形式处理
      if (normalTypes.includes(typeof json[key][0])) {
        const type = _isBaseType(json[key])

        inters += `${indent}${_getRenderKey(key)}: ${_getRenderValue(type + '[]')}`
      } else {
        const interfaceName = _getInterfaceName(key)

        inters += `${indent}${_getRenderKey(key)}: ${_getRenderValue(interfaceName + '[]')}`
        arrs.push({
          key: interfaceName,
          value: json[key][0],
        })
      }
    }
  }
  return inters
}

/**
 * 处理json
 * @param json 待处理json
 * @param name 接口名字
 * @param inters 拼接的字符串
 * @param first 是否为第一级
 * @param ind 缩进方式 默认一个tab
 * @returns {*}
 */
function _parseJson(json, name, inters, first = true, ind = indent) {
  let keys = []

  try {
    keys = Reflect.ownKeys(json)
  } catch (e) {
    console.log(e)
  }
  if (!keys.length) { // 判断是否有key
    inters += `${_getRenderInterface(name)} ${__getRenderInterfaceName(name)} ${_getRenderLeft()}`
    inters += _getRenderRight()
    return inters
  }
  if (!inters && first) {
    inters += `${_getRenderInterface(name)} ${__getRenderInterfaceName(name)} ${_getRenderLeft()}`
  } else if (!inters && !first) {
    inters += _getRenderLeft()
  }
  let type

  for (const key of keys) {
    // 判断值类型
    type = typeof json[key]
    if (normalTypes.includes(type) || json[key] === null) {
      inters += `${ind}${_getRenderKey(key)}:${_getRenderValue(json[key] === null ? 'null' : type)}`
    } else if (Array.isArray(json[key])) {
      inters = _handleArray(json, key, inters, ind)
    } else if (isObject(json[key])) {
      // inters += `${ind}${_getRenderKey(key)}: ${_parseJson(json[key], key, '', false, ind + ind)}`;
      const interfaceName = _getInterfaceName(key)

      inters += `${indent}${_getRenderKey(key)}: ${interfaceName};\n`
      arrs.push({
        key: interfaceName,
        value: json[key],
      })
    }
  }
  if (first) {
    inters += _getRenderRight()
  } else {
    inters += indent + _getRenderRight()
  }
  return inters
}

/**
 * 导出接口定义
 * @param data json对象
 * @param exportMode 1 不导出 2 导出 3 导出为默认
 * @returns {*}
 */
export default function interfaceDefinition(data: object, {
  exportInterfaceName,
  interfaceNamePrefix = 'I',
}: {
  exportInterfaceName: string;
  interfaceNamePrefix?: string;
  exportMode?: ExportEnum;
}) {
  globalInterfaceNamePrefix = interfaceNamePrefix
  interfaceName = exportInterfaceName
  let result

  arrs = []
  interfaceNames = []
  result = _parseJson(data, _getInterfaceName(interfaceName), '', true)
  for (const obj of arrs) {
    result += '\n'
    result += _parseJson(obj.value, obj.key, '', true)
  }
  return result
}
