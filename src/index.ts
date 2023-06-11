import fs from 'fs'
import path from 'path'

import interfaceDefinition from './interface-definition'

export default function genInterface(pageName: string, data: object) {
  const pageDir = path.join(process.cwd(), 'app', pageName) // 构造目标目录的绝对路径
  const typeFile = path.join(pageDir, 'page.type.ts') // 构造目标文件的绝对路径
  const content = interfaceDefinition(data, {
    exportInterfaceName: pageName,
  })

  fs.mkdirSync(pageDir, { recursive: true }) // 确保目录存在，使用了recursive参数可以创建多级目录结构
  fs.writeFileSync(typeFile, content) // 写入内容到文件中
}
