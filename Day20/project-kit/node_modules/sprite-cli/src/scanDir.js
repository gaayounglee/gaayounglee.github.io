let fs = require('fs')

/**
 * 返回的目标数组
 * @type {Array}
 */
let files = []
/**
 * 查找文件夹下指定的文件
 * @param path 需要查找上午文件目录
 * @param name 需要查找的文件名称
 * @param file 附加参数，递归时用于匹配需要查找的文件
 * @returns {Array}
 */
module.exports = function find(path, name, file) {
  /**
   * 忽略的文件夹
   * node_modules
   * .git...
   */
  if(['.git','.idea','dist','test', 'node_modules'].indexOf(file)=='-1'){
    /**
     * 找到目标文件
     */
    if (fs.statSync(path).isFile()&&file==name) {
      return files.push(path)
    }
    /**
     * 是文件夹的话递归查找
     */
    fs.statSync(path).isDirectory()&&
    fs.readdirSync(path).forEach((file) => {
      find(path + '/' + file, name, file)
    })
    return files
  }
}