const _ = require("lodash")
const fs = require("fs")
const Path = require("path")
const toml = require("toml")

const exp = {
  _serverParam: {},
  // @block{scanPath}:扫描指定目录和子目录
  // @type:function
  // @includes:lodash
  // @includes:fs
  // @includes:path
  // @params{path}[string]:指定的目录
  // @params{options}[object]:扫描方式
  //          * *ignores*[```array```]：忽略的目录和文件
  // @return{subPathAry}[array]:扫描出来的文件（带相对路径）
  scanPath: (path, options) => {
    // @steps{1}:参数配置，默认扫描方式为空
    if (!options) {
      options = {}
    }
    if (!options.ignores) {
      options.ignores = []
    }
    if (!options.orgPath) {
      options.orgPath = path
    }

    // @steps{2}:扫描当前目录下所有子目录和文件
    let subPathAry = []
    fs.readdirSync(path).map(file => {
      let absPth = Path.join(path, file)
      let relPth = absPth.replace(`${options.orgPath}${Path.sep}`, "")
      let fstat = fs.statSync(absPth)
      if (fstat.isDirectory()) {
        // @steps{2_1}:如果是目录，递归调用并把返回值合并进返回值中
        subPathAry = _.concat(subPathAry, exp.scanPath(absPth, options))
      } else if (fstat.isFile()) {
        // @steps{2_2}:如果是文件，查看是否指定忽略
        let bIgnore = false
        options.ignores.map(ignore => {
          if (ignore[0] === "*") {
            // @steps{2_2_1}:如果文件名为*，则检查文件后缀
            let ext = ignore.slice(1)
            let pthInfo = Path.parse(relPth)
            if (pthInfo.ext === ext) {
              bIgnore = true
            }
          } else {
            // @steps{2_2_2}:如果忽略的是目录，查看相对路径的前ignore\
            //         长度的字符串是否相等
            //         ```
            //         ignore -> node_modules/
            //         relPth -> node_modules/koa/Readme.md
            //         ```
            let pth = relPth
            if (relPth.length > ignore.length) {
              pth = relPth.slice(0, ignore.length)
            }
            // @_steps{2_2_3}:如果忽略的是文件，查看相对路径的后ignore\
            //         长度的字符串是否相等
            //         ```
            //         ignore -> Readme.md
            //         relPth -> node_modules/koa/Readme.md
            //         ```
            // if(pth === ignore) { bIgnore = true }
            // if(relPth.length > ignore.length) {
            //   pth = relPth.slice(-ignore.length)
            // }
            if (pth === ignore) {
              bIgnore = true
            }
          }
        })
        // @steps{2_3}:最后把子文件路径塞入返回值中
        !bIgnore && subPathAry.push(relPth)
      }
    })
    return subPathAry
  },
  projRootPath() {
    return Path.resolve(__dirname, "..")
  },
  readConfig(cfgFile, withEnv = false) {
    if (withEnv && !this._serverParam.env) {
      this._serverParam = this.readConfig("./configs/server")
      return toml.parse(fs.readFileSync(`${cfgFile}.${this._serverParam.env}.toml`, {encoding: "utf8"}))
    }
    return toml.parse(fs.readFileSync(`${cfgFile}.toml`, {encoding: "utf8"}))
  },
  env() {
    if (!this._serverParam.env) {
      this._serverParam = this.readConfig("./configs/server")
    }
    return this._serverParam.env
  },
  getClientIp(req) {
    return req.headers['x-forwarded-for']
      || req.connection.remoteAddress
      || req.socket.remoteAddress
      || req.connection.socket.remoteAddress
  },
  getDatabase() {
    return require(`../databases/${
      this.readConfig("./configs/model").type
    }`)
  },
  fmtQuerySQL(sql, query, symbol, options) {
    if (!options) {
      options = {addWhere: true}
    }
    let conds = []
    switch (query.scope) {
      case "week":
        conds.push(`DATEDIFF(CURDATE(), \`${symbol}\`.\`createdAt\`) < 7`)
        break
      case "month":
        conds.push(`DATEDIFF(CURDATE(), \`${symbol}\`.\`createdAt\`) < 30`)
        break
      case "year":
        conds.push(`DATEDIFF(CURDATE(), \`${symbol}\`.\`createdAt\`) < 365`)
        break
    }
    delete query.scope
    for (let key in query) {
      let value = query[key]
      let valLowCs = value.toUpperCase()
      if (isNaN(parseFloat(value)) && valLowCs !== "TRUE" && valLowCs !== "FALSE" && valLowCs !== "NULL") {
        value = `'${value}'`
      }
      conds.push(`\`${symbol}\`.\`${key}\` ${valLowCs === 'NULL' ? 'IS' : '='} ${value}`)
    }
    if (conds.length) {
      return sql.trim() + (options.addWhere ? " WHERE " : " AND ") + conds.join(" AND ")
    } else {
      return sql
    }
  }
}

module.exports = exp