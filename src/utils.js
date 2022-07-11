import { Toast, Indicator } from 'mint-ui'

export function onSchWdsChanged(schInfo, incProps) {
  if (!this[schInfo].schWords) {
    this[schInfo].mchItems = this[schInfo].allItems
  } else {
    this[schInfo].mchItems = []
    this[schInfo].allItems.map((item) => {
      for (let incProp of incProps) {
        if (item[incProp] && item[incProp].includes(this[schInfo].schWords)) {
          this[schInfo].mchItems.push(item)
          break
        }
      }
    })
  }
}

export async function reqBackend(pms, callback) {
  Indicator.open({ text: '加载中...' })
  if (pms instanceof Array) {
    const ress = await Promise.all(pms)
    for (let res of ress) {
      if (res.status != 200) {
        Toast({
          message: `系统错误！${res.statusText}`,
          iconClass: 'iconfont icon-close-bold fs-50',
        })
        return Promise.resolve(null)
      }
    }
    callback && callback(ress)
    Indicator.close()
    return Promise.resolve(ress.map((res) => res.data.result || res.data.data))
  } else {
    const res = await pms
    Indicator.close()
    if (res.status != 200) {
      Toast({
        message: `系统错误！${res.statusText}`,
        iconClass: 'iconfont icon-close-bold fs-50',
      })
      return Promise.resolve(null)
    } else {
      callback && callback(res)
      Indicator.close()
      const result = res.data.result || res.data.data
      if (result.error) {
        Toast({
          message: `错误！${result.error}`,
          iconClass: 'iconfont icon-close-bold fs-50',
        })
        return Promise.reject(result.error)
      }
      return Promise.resolve(result)
    }
  }
}

export const IdCardRegexp =
  /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
export const PsnNameRegexp =
  /^(?:[\u4e00-\u9fa5]+)(?:·[\u4e00-\u9fa5]+)*$|^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$/
export const PhoneRegexp =
  /^((\+|00)86)?((134\d{4})|((13[0-3|5-9]|14[1|5-9]|15[0-9]|16[2|5|6|7]|17[0-8]|18[0-9]|19[0-2|5-9])\d{8}))$/

export function popoverErrTip(fieldId, errContent) {
  $(fieldId).popover({
    html: true,
    content: `<p class='err-popover-content'>${errContent}</p>`,
  })
  $(fieldId).on('shown.bs.popover', () => {
    $('.popover-body .err-popover-content').html(errContent)
    if (!$('.popover-mask').length) {
      $('.popover').after(
        "<div class='popover-mask' style='position: fixed; left: 0; right: 0; top: 0; bottom: 0; z-index: 1059; background-color: rgba(.5, .5, .5, .5)'/>"
      )
    }
    var onHideClick = function () {
      $(fieldId).popover('hide')
      $('.popover-mask').remove()
    }
    $('.popover').on('click', onHideClick)
    $('.popover-mask').on('click', onHideClick)
  })
  $(fieldId).popover('show')
}

export const PieModel = {
  title: {
    left: 'left',
  },
  legend: {
    orient: 'vertical',
    left: 'right',
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
  series: [
    {
      type: 'pie',
      radius: '50%',
      label: {
        normal: {
          formatter: '{c}',
          position: 'inside',
        },
      },
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
}

export const BarModel = {
  title: {},
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01],
  },
  yAxis: {
    type: 'category',
    data: [],
  },
  series: [
    {
      type: 'bar',
      label: {
        show: true,
        position: 'inside',
      },
      color: [],
      itemStyle: {
        normal: {
          color: function (params) {
            var colorList = [
              '#5570c7',
              '#91cb74',
              '#fac859',
              '#ee6666',
              '#72c0de',
              '#3ba372',
              '#fc8452',
              '#9a60b4',
              '#e97ccb',
            ]
            return colorList[params.dataIndex]
          },
        },
      },
      data: [],
    },
  ],
}

export const eventBus = new Vue({})

export async function $wait(iden, cond) {
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

export function assignToCloneObj(temp, src) {
  return Object.assign(_.cloneDeep(temp), src)
}

function copyWithDefault(value, options = { dft: '', pcs: val => val }) {
  if (!options.pcs) {
    options.pcs = val => val
  }
  return typeof value !== 'undefined' &&
    value !== null &&
    value.toLowerCase() !== 'null'
    ? options.pcs(value)
    : options.dft
}

export function copyCompany(query) {
  let ret = {
    name: copyWithDefault(query.name),
    shopName: copyWithDefault(query.shopName),
    type: copyWithDefault(query.type),
    regId: copyWithDefault(query.regId),
    address: copyWithDefault(query.address),
    area: copyWithDefault(query.area, { dft: 0 }),
    lglName: copyWithDefault(query.lglName),
    lglId: copyWithDefault(query.lglId),
    lglPhone: copyWithDefault(query.lglPhone),
    openHours: copyWithDefault(query.openHours),
    isClosed: copyWithDefault(query.isClosed, {
      dft: false,
      pcs: (val) => JSON.parse(val),
    }),
    fireFgtTags: copyWithDefault(query.fireFgtTags),
    pbcSecuTags: copyWithDefault(query.pbcSecuTags),
    remarks: copyWithDefault(query.remarks),
    pictures: copyWithDefault(query.pictures, { dft: [] }),
    license: copyWithDefault(query.license, { dft: [] }),
  }
  if (query.id) {
    ret.id = parseInt(query.id)
  }
  if (typeof ret.pictures === 'string') {
    ret.pictures = ret.pictures.split(',')
  }
  if (typeof ret.license === 'string') {
    ret.license = ret.license.split(',')
  }
  if (typeof ret.fireFgtTags === 'string') {
    ret.fireFgtTags = ret.fireFgtTags.split(',')
  }
  ret.fireFgtTagsMap = {
    店住人: ret.fireFgtTags.includes('店住人'),
    沿街: ret.fireFgtTags.includes('沿街'),
    有仓库: ret.fireFgtTags.includes('有仓库'),
    用明火: ret.fireFgtTags.includes('用明火'),
    '高层/地下室': ret.fireFgtTags.includes('高层/地下室'),
  }
  if (typeof ret.pbcSecuTags === 'string') {
    ret.pbcSecuTags = ret.pbcSecuTags.split(',')
  }
  ret.pbcSecuTagsMap = {
    销售酒类: ret.pbcSecuTags.includes('销售酒类'),
    可疑行径: ret.pbcSecuTags.includes('可疑行径'),
  }
  return ret
}

export function copyPerson(query) {
  let ret = {
    name: copyWithDefault(query.name),
    idCard: copyWithDefault(query.idCard),
    gender: copyWithDefault(query.gender),
    nation: copyWithDefault(query.nation),
    phone: copyWithDefault(query.phone),
    hhAddress: copyWithDefault(query.hhAddress),
    lvAddress: copyWithDefault(query.lvAddress),
    hasLvCard: copyWithDefault(query.hasLvCard, {
      dft: false,
      pcs: (val) => JSON.parse(val),
    }),
    cmpId: copyWithDefault(query.cmpId, {
      dft: -1,
      pcs: (val) => parseInt(val),
    }),
    company: copyWithDefault(query.company),
    specTags: copyWithDefault(query.specTags),
    remarks: copyWithDefault(query.remarks),
    pictures: copyWithDefault(query.pictures, { dft: [] }),
    idPicture: copyWithDefault(query.idPicture, { dft: [] }),
  }
  if (query.id) {
    ret.id = parseInt(query.id)
  }
  if (typeof ret.pictures === 'string') {
    ret.pictures = ret.pictures.split(',')
  }
  if (typeof ret.idPicture === 'string') {
    ret.idPicture = ret.idPicture.split(',')
  }
  if (typeof ret.specTags === 'string') {
    ret.specTags = ret.specTags.split(',')
  }
  ret.specTagsMap = {
    独居老人: ret.specTags.includes('独居老人'),
    孕妇: ret.specTags.includes('孕妇'),
    患精神疾病: ret.specTags.includes('患精神疾病'),
    生理残疾人: ret.specTags.includes('生理残疾人'),
    行径可疑: ret.specTags.includes('行径可疑'),
  }
  return ret
}

export const fireFgtColrMap = {
  店住人: 'error',
  沿街: 'success',
  有仓库: 'warning',
  用明火: 'error',
  '高层/地下室': 'success',
}

export const pbcSecuColrMap = {
  销售酒类: 'warning',
  存在可疑行径: 'error',
}

export const specColrMap = {
  独居老人: 'warning',
  孕妇: 'success',
  患精神疾病: 'warning',
  生理残疾人: 'success',
  行径可疑: 'error',
}
