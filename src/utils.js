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
            iconClass: "iconfont icon-close-bold fs-50"
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
          iconClass: "iconfont icon-close-bold fs-50"
        })
        return Promise.resolve(null)
      } else {
        callback && callback(res)
        Indicator.close()
        if (res.data.error) {
          Toast({
            message: `错误！${res.data.error}`,
            iconClass: "iconfont icon-close-bold fs-50"
          })
          return Promise.reject(res.data.error)
        }
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
    legend: {
      orient: "vertical",
      left: "right"
    },
    // tooltip : {
    //   axisPointer: {
    //     type: 'cross'
    //   },
    //   triggerOn: 'click',   //触发方式
    //   // alwaysShowContent:true,   //鼠标离开区域不消失
    //   trigger:'axis',
    //   formatter:function(params){
    //     var html = '';
    //     if(params.length>0){
    //       Xindex = params[0].dataIndex;
    //       html+= date + ' ' +params[0].name+'<br>';
    //       for ( var int = 0; int < params.length; int++) {
    //         if(int == 0){
    //           html+=params[int].marker + params[int].seriesName+': '+params[int].data+'&nbsp;&nbsp;&nbsp;<button class="fr btn closeHandle" id="specialLook"  οnclick="lookVideoGo(\''+ date + ' ' +params[0].name +'\')">查 看</button><br>';
    //           //lookVideoGo按钮触发函数 ，注意传递参数引号规则
    //         }else{
    //           html+=params[int].marker + params[int].seriesName+': '+params[int].data+'<br>';
    //         }
    //       }
    //     }
    //     return html;
    //   },
    // },
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
      color: [],
      itemStyle: {
        normal: {
          color: function(params) {
            var colorList = [
              "#5570c7","#91cb74","#fac859","#ee6666","#72c0de","#3ba372","#fc8452","#9a60b4","#e97ccb",
            ]
            return colorList[params.dataIndex]
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
  },
  assignToCloneObj(temp, src) {
    return Object.assign(_.cloneDeep(temp), src)
  },
  copyCompany(query) {
    let ret =  {
      name: query.name || "",
      shopName: query.shopName || "",
      type: query.type || "",
      regId: query.regId || "",
      address: query.address || "",
      area: query.area || 0,
      lglName: query.lglName || "",
      lglId: query.lglId || "",
      lglPhone: query.lglPhone || "",
      openHours: query.openHours || "",
      isClosed: query.isClosed ? JSON.parse(query.isClosed) : false,
      fireFgtTags: query.fireFgtTags || "",
      pbcSecuTags: query.pbcSecuTags || "",
      remarks: query.remarks || "",
      pictures: [],
      license: []
    }
    if (query.id) {
      ret.id = parseInt(query.id)
    }
    if (query.pictures && query.pictures !== 'null') {
      ret.pictures = query.pictures.split(',').map(num => parseInt(num))
    }
    if (query.license && query.license !== 'null') {
      ret.license = [parseInt(query.license)]
    }
    const fireFgtTagsSet = ret.fireFgtTags.split(",")
    ret.fireFgtTagsMap = {
      "店住人": fireFgtTagsSet.includes("店住人"),
      "沿街": fireFgtTagsSet.includes("沿街"),
      "有仓库": fireFgtTagsSet.includes("有仓库"),
      "用明火": fireFgtTagsSet.includes("用明火"),
      "高层/地下室": fireFgtTagsSet.includes("高层/地下室"),
    }
    const pbcSecuTagsSet = ret.pbcSecuTags.split(",")
    ret.pbcSecuTagsMap = {
      "销售酒类": pbcSecuTagsSet.includes("销售酒类"),
      "可疑行径": pbcSecuTagsSet.includes("可疑行径"),
    }
    return ret
  },
  copyPerson(query) {
    let ret =  {
      name: query.name || "",
      idCard: query.idCard || "",
      gender: query.gender || "",
      nation: query.nation || "",
      phone: query.phone || "",
      hhAddress: query.hhAddress || "",
      lvAddress: query.lvAddress || "",
      hasLvCard:  query.hasLvCard ? JSON.parse(query.hasLvCard) : false,
      cmpId: query.cmpId ? parseInt(query.cmpId) : -1,
      company: query.company || "",
      specTags: query.specTags || "",
      remarks: query.remarks || "",
      pictures: [],
      idPicture: []
    }
    if (query.id) {
      ret.id = parseInt(query.id)
    }
    if (query.pictures && query.pictures !== 'null') {
      ret.pictures = query.pictures.split(',').map(num => parseInt(num))
    }
    if (query.idPicture && query.idPicture !== 'null') {
      ret.idPicture = [parseInt(query.idPicture)]
    }
    const specTagsSet = ret.specTags.split(",")
    ret.specTagsMap = {
      "独居老人": specTagsSet.includes("独居老人"),
      "孕妇": specTagsSet.includes("孕妇"),
      "患精神疾病": specTagsSet.includes("患精神疾病"),
      "生理残疾人": specTagsSet.includes("生理残疾人"),
      "行径可疑": specTagsSet.includes("行径可疑"),
    }
    return ret
  },
  fireFgtColrMap: {
    "店住人": "error",
    "沿街": "success",
    "有仓库": "warning",
    "用明火": "error",
    "高层/地下室": "success",
  },
  pbcSecuColrMap: {
    "销售酒类": "warning",
    "存在可疑行径": "error",
  },
  specColrMap: {
    "独居老人": "warning",
    "孕妇": "success",
    "患精神疾病": "warning",
    "生理残疾人": "success",
    "行径可疑": "error",
  }
}
