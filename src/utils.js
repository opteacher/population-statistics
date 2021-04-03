const { Toast, Indicator } = require("mint-ui")

module.exports = {
  onSchWdsChanged(schInfo, incProps) {
    if (!this[schInfo].schWords) {
      this[schInfo].mchItems = this[schInfo].allItems
    } else {
      this[schInfo].mchItems = []
      this[schInfo].allItems.map(item => {
        for (let incProp of incProps) {
          if (item[incProp] && item[incProp].includes(this[schInfo].schWords)) {
            this[schInfo].mchItems.push(item)
            break
          }
        }
      })
    }
  },
  async reqBackend(pms, callback) {
    Indicator.open({text: "加载中..."})
    if (pms instanceof Array) {
      const ress = await Promise.all(pms)
      Indicator.close()
      for (let res of ress) {
        if (res.status != 200) {
          Toast({
            message: `系统错误！${res.statusText}`,
            iconClass: "iconfont icon-close-bold"
          })
          return false
        }
      }
      callback(ress.map(res => res.data.data))
      return true
    } else {
      const res = await pms
      Indicator.close()
      if (res.status != 200) {
        Toast({
          message: `系统错误！${res.statusText}`,
          iconClass: "iconfont icon-close-bold"
        })
        return false
      } else {
        callback(res.data.data)
        return true
      }
    }
  }
}