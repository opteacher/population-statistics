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
      for (let res of ress) {
        if (res.status != 200) {
          Toast({
            message: `系统错误！${res.statusText}`,
            iconClass: "iconfont icon-close-bold"
          })
          return Promise.resolve(null)
        }
      }
      callback && callback(ress)
      Indicator.close()
      return Promise.resolve(ress.map(res => res.data.data))
    } else {
      const res = await pms
      Indicator.close()
      if (res.status != 200) {
        Toast({
          message: `系统错误！${res.statusText}`,
          iconClass: "iconfont icon-close-bold"
        })
        return Promise.resolve(null)
      } else {
        callback && callback(res)
        Indicator.close()
        return Promise.resolve(res.data.data)
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
  },
  PieModel: {
    title: {
      left: "left"
    },
    tooltip: {
      trigger: "item"
    },
    legend: {
      orient: "vertical",
      left: "right"
    },
    series: [{
      type: "pie",
      radius: "50%",
      label: {
        normal: {
          formatter: "{c}",
          position: "inside"
        }
      },
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }]
  },
  BarColors: [
    "#dd6b66","#759aa0","#e69d87","#8dc1a9","#ea7e53","#eedd78","#73a373","#73b9bc","#7289ab", "#91ca8c","#f49f42","#c23531",
    "#2f4554", "#61a0a8", "#d48265", "#91c7ae","#749f83",  "#ca8622", "#bda29a","#6e7074", "#546570", "#c4ccd3", "#37A2DA", 
    "#32C5E9", "#67E0E3", "#9FE6B8", "#FFDB5C","#ff9f7f", "#fb7293", "#E062AE", "#E690D1", "#e7bcf3", "#9d96f5", "#8378EA", "#96BFFF",
  ],
  BarModel: {
    title: {},
    tooltip: {
      trigger: "axis",
      axisPointer: {type: "shadow"}
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: "category",
      data: []
    },
    series: [{
      type: "bar",
      label: {
        show: true,
        position: "inside"
      },
      itemStyle: {
        normal: {
          colors: [],
          color: function(params) {
            console.log(this)
            return this.colors[params.dataIndex]
          }
        }
      },
      data: []
    }]
  },
  eventBus: new Vue({}),
  async $wait(iden, cond) {
    return new Promise((res, rej) => {
      if (!cond) {
        cond = () => true
      }
      let count = 0
      const h = setInterval(() => {
        const ret = $(iden)
        if (ret.length && cond()) {
          clearInterval(h)
          return res(ret)
        } else if (count < 120) {
          count++
        } else {
          clearInterval(h)
          return rej()
        }
      }, 100)
    })
  }
}