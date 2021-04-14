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
  },
  IdCardRegexp: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  PsnNameRegexp: /^(?:[\u4e00-\u9fa5]+)(?:·[\u4e00-\u9fa5]+)*$|^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$/,
  PhoneRegexp: /^((\+|00)86)?((134\d{4})|((13[0-3|5-9]|14[1|5-9]|15[0-9]|16[2|5|6|7]|17[0-8]|18[0-9]|19[0-2|5-9])\d{8}))$/,
  popoverErrTip(fieldId, errContent) {
    $(fieldId).popover({
      html: true,
      content: `<p class='err-popover-content'>${errContent}</p>`
    })
    $(fieldId).on("shown.bs.popover", () => {
      $(".popover-body .err-popover-content").html(errContent)
      if (!$(".popover-mask").length) {
        $(".popover").after("<div class='popover-mask' style='position: fixed; left: 0; right: 0; top: 0; bottom: 0; z-index: 1059; background-color: rgba(.5, .5, .5, .5)'/>")
      }
      var onHideClick = function () {
        $(fieldId).popover("hide")
        $(".popover-mask").remove()
      }
      $(".popover").on("click", onHideClick)
      $(".popover-mask").on("click", onHideClick)
    })
    $(fieldId).popover("show")
  }
}