<template>
  <div class="ptb-10 plr-5 scroll-panel" style="top: 49px; bottom: 55px">
    <div class="card ptb-10 plr-5 mb-5">
      <h2 class="text-center mb-0">
        <b>实有单位：{{ totalNumber }}家</b>
      </h2>
      <hr />
      <ul class="w-100 mb-0 list-inline d-flex justify-content-around">
        <li class="list-inline-item">停业：<br />{{ numClosed }}家</li>
        <li class="list-inline-item">月新增：<br />{{ numInMonth }}家</li>
        <li class="list-inline-item">年新增：<br />{{ numInYear }}家</li>
      </ul>
    </div>
    <div class="card ptb-10 plr-1pc mb-5 text-center">
      <div id="industryClassify" style="width: 95vw; height: 50vh" />
    </div>
    <div class="card ptb-10 plr-1pc mb-5 text-center">
      <div id="firefightingPoint" style="width: 95vw; height: 50vh" />
    </div>
    <div class="card ptb-10 plr-1pc mb-5 text-center">
      <div id="securityPoint" style="width: 95vw; height: 50vh" />
    </div>
    <div class="card ptb-10 plr-1pc mb-5 text-center">
      <div id="missCompanyInfo" style="width: 95vw; height: 50vh" />
    </div>
  </div>
</template>

<script>
import * as utils from '../utils.js'
export default {
  data() {
    return {
      totalNumber: 0,
      numInMonth: 0,
      numInYear: 0,
      numClosed: 0,
      numClsfyType: [],
    }
  },
  async created() {
    const url = '/population-statistics/api/v1/bdata/companies/total_count'
    const pmss = [
      axios.get(url),
      axios.get(url + '?scope=month'),
      axios.get(url + '?scope=year'),
      axios.get(url + '?isClosed=true'),
      axios.get(url + '/groupby/type'),
      axios.get(url + '?fireFgtTags=店住人'),
      axios.get(url + '?fireFgtTags=沿街'),
      axios.get(url + '?fireFgtTags=有仓库'),
      axios.get(url + '?fireFgtTags=用明火'),
      axios.get(url + '?fireFgtTags=高层/地下室'),
      axios.get(url + '?name='),
      axios.get(url + '?type='),
      axios.get(url + '?openHours='),
      axios.get(url + '?openHours=-'),
      axios.get(url + '?address='),
      axios.get(url + '?lglName='),
      axios.get(url + '?lglId='),
      axios.get(url + '?lglPhone='),
      axios.get(
        '/population-statistics/api/v1/bdata/people/total_count/groupby/company'
      ),
      axios.get(url + '/open/night'),
      axios.get(url + '?pbcSecuTags=销售酒类'),
      axios.get(url + '?pbcSecuTags=可疑行径'),
    ]
    const data = await utils.reqBackend(pmss)
    this.totalNumber = data[0][0].cmpNum
    this.numInMonth = data[1][0].cmpNum
    this.numInYear = data[2][0].cmpNum
    this.numClosed = data[3][0].cmpNum
    this.numClsfyType = []
    data[4].map((tpItem) => {
      if (!tpItem.type) {
        return
      }
      this.numClsfyType.push({
        value: tpItem.cmpNum,
        name: tpItem.type,
      })
    })
    echarts.init((await utils.$wait('#industryClassify'))[0]).setOption(
      utils.assignToCloneObj(utils.PieModel, {
        title: {
          text: '行业类别',
          left: 'right',
        },
        legend: utils.assignToCloneObj(utils.PieModel.legend, {
          left: 'left',
        }),
        series: [
          utils.assignToCloneObj(utils.PieModel.series[0], {
            radius: '80%',
            data: this.numClsfyType,
            left: '30%',
            right: 0,
            bottom: '-20%',
          }),
        ],
      })
    )

    // data[5]
    echarts.init((await utils.$wait('#firefightingPoint'))[0]).setOption(
      utils.assignToCloneObj(utils.BarModel, {
        title: {
          text: '消防重点统计',
        },
        yAxis: {
          data: ['店住人', '沿街商铺', '有仓库', '用明火', '高层/地下室'],
        },
        series: [
          utils.assignToCloneObj(utils.BarModel.series[0], {
            data: [
              data[5][0].cmpNum,
              data[6][0].cmpNum,
              data[7][0].cmpNum,
              data[8][0].cmpNum,
              data[9][0].cmpNum,
            ],
          }),
        ],
      })
    )

    echarts.init((await utils.$wait('#securityPoint'))[0]).setOption(
      utils.assignToCloneObj(utils.BarModel, {
        title: {
          text: '治安重点统计',
        },
        yAxis: {
          data: ['夜间经营', '兜售酒精饮品', '有可疑行为'],
        },
        series: [
          utils.assignToCloneObj(utils.BarModel.series[0], {
            data: [data[19][0].cmpNum, data[20][0].cmpNum, data[21][0].cmpNum],
          }),
        ],
      })
    )

    echarts.init((await utils.$wait('#missCompanyInfo'))[0]).setOption(
      utils.assignToCloneObj(utils.BarModel, {
        title: {
          text: '完整性报告',
        },
        yAxis: {
          data: [
            '缺失单位注册名称',
            '缺失类型',
            '缺失营业时间',
            '缺失地址',
            '缺失法人姓名',
            '缺失法人身份证',
            '缺失法人手机号',
            '无员工',
          ],
        },
        series: [
          utils.assignToCloneObj(utils.BarModel.series[0], {
            data: [
              data[10][0].cmpNum,
              data[11][0].cmpNum,
              data[12][0].cmpNum + data[13][0].cmpNum,
              data[14][0].cmpNum,
              data[15][0].cmpNum,
              data[16][0].cmpNum,
              data[17][0].cmpNum,
              data[18].filter((cmp) => cmp.pplNum === 0).length,
            ],
          }),
        ],
      })
    )
  },
}
</script>
