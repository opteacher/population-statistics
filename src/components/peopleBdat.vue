<template>
  <div class="ptb-10 plr-1pc scroll-panel" style="top: 49px; bottom: 55px">
    <div class="card ptb-10 plr-5 mb-5">
      <h2 class="text-center mb-0">
        <b>实有人口：{{ totalNumber }}人</b>
      </h2>
      <hr />
      <ul class="w-100 mb-0 list-inline d-flex justify-content-around">
        <li class="list-inline-item">周新增：<br />{{ numInWeek }}人</li>
        <li class="list-inline-item">月新增：<br />{{ numInMonth }}人</li>
        <li class="list-inline-item">年新增：<br />{{ numInYear }}人</li>
      </ul>
    </div>
    <div class="card ptb-10 plr-1pc mb-5 text-center">
      <div id="purposeClassify" style="width: 96vw; height: 50vh" />
    </div>
    <div class="card ptb-10 plr-1pc mb-5 text-center">
      <div id="nationClassify" style="width: 96vw; height: 40vh" />
    </div>
    <div class="card ptb-10 plr-1pc mb-5 text-center">
      <div id="ageClassify" style="width: 96vw; height: 40vh" />
    </div>
    <div class="card ptb-10 plr-1pc mb-5 text-center">
      <div id="specialClassify" style="width: 96vw; height: 40vh" />
    </div>
    <div class="card ptb-10 plr-1pc mb-5 text-center">
      <div id="missPersonInfo" style="width: 96vw; height: 40vh" />
    </div>
  </div>
</template>

<script>
import * as utils from '../utils.js'
export default {
  data() {
    return {
      totalNumber: 0,
      numInWeek: 0,
      numInMonth: 0,
      numInYear: 0,
    }
  },
  async created() {
    const url = '/population-statistics/api/v1/bdata/people/total_count'
    const pmss = [
      axios.get(url),
      axios.get(url + '?scope=week'),
      axios.get(url + '?scope=month'),
      axios.get(url + '?scope=year'),
      axios.get(url + '?cmpId=null'),
      axios.get(url + '/living_and_working'),
      axios.get(url + '/groupby/nation'),
      axios.get(url + '/groupby/age'),
      axios.get(url + '?phone='),
      axios.get(url + '?hhAddress='),
      axios.get(url + '?lvAddress='),
      axios.get(url + '?idCard='),
    ]
    const data = await utils.reqBackend(pmss)
    this.totalNumber = data[0][0].pplNum
    this.numInWeek = data[1][0].pplNum
    this.numInMonth = data[2][0].pplNum
    this.numInYear = data[3][0].pplNum

    const numLiving = data[4][0].pplNum
    const numLvAndWk = data[5][0].pplNum
    const numWorking = this.totalNumber - numLiving - numLvAndWk
    echarts.init((await utils.$wait('#purposeClassify'))[0]).setOption(
      utils.assignToCloneObj(utils.PieModel, {
        title: {
          text: '来此目的',
          left: 'right',
        },
        legend: utils.assignToCloneObj(utils.PieModel.legend, {
          left: 'left',
        }),
        series: [
          utils.assignToCloneObj(utils.PieModel.series[0], {
            radius: '80%',
            data: [
              { value: numLvAndWk, name: '半住半工人口' },
              { value: numLiving, name: '居住人口' },
              { value: numWorking, name: '就业人口' },
            ],
            left: '30%',
            right: 0,
            bottom: '-20%',
          }),
        ],
      })
    )

    const numGpByNation = data[6]
    const nations = numGpByNation.map((item) => {
      if (!item.nation) {
        item.nation = '其他'
      }
      return item.nation
    })
    const numPpl = numGpByNation.map((item) => item.pplNum)
    echarts.init((await utils.$wait('#nationClassify'))[0]).setOption(
      utils.assignToCloneObj(utils.BarModel, {
        title: { text: '民族分布' },
        yAxis: {
          data: nations,
        },
        series: [
          utils.assignToCloneObj(utils.BarModel.series[0], {
            data: numPpl,
          }),
        ],
      })
    )

    echarts.init((await utils.$wait('#ageClassify'))[0]).setOption(
      utils.assignToCloneObj(utils.BarModel, {
        title: { text: '年龄分布' },
        yAxis: {
          data: Object.keys(data[7]),
        },
        series: [
          utils.assignToCloneObj(utils.BarModel.series[0], {
            data: Object.values(data[7]),
          }),
        ],
      })
    )
    echarts.init((await utils.$wait('#specialClassify'))[0]).setOption(
      utils.assignToCloneObj(utils.BarModel, {
        title: { text: '特殊人群分布' },
        yAxis: {
          data: ['独居老人', '有孕妇', '有精神/心理疾病', '有残疾', '可疑'],
        },
        series: [
          utils.assignToCloneObj(utils.BarModel.series[0], {
            data: [999999, 999999, 999999, 999999, 999999],
          }),
        ],
      })
    )

    const numMsPhone = data[8][0].pplNum
    const numMsHhAddr = data[9][0].pplNum
    const numMsLvAddr = data[10][0].pplNum
    const numMsIdCard = data[11][0].pplNum
    echarts.init((await utils.$wait('#missPersonInfo'))[0]).setOption(
      utils.assignToCloneObj(utils.BarModel, {
        title: { text: '信息完整性统计' },
        yAxis: {
          data: ['缺联系方式', '缺户籍地址', '缺居住地址', '缺身份证'],
        },
        series: [
          utils.assignToCloneObj(utils.BarModel.series[0], {
            data: [numMsPhone, numMsHhAddr, numMsLvAddr, numMsIdCard],
          }),
        ],
      })
    )
  },
}
</script>
