<template>
  <div class="ptb-10 plr-5 scroll-panel" style="top: 49px; bottom: 55px">
    <div class="card ptb-10 plr-5 mb-5">
      <h2 class="text-center mb-0">
        <b>实有房屋：{{ totalNumber }}间</b>
      </h2>
      <hr />
      <ul class="w-100 mb-0 list-inline d-flex justify-content-around">
        <li class="list-inline-item">空置：<br />{{ numEmpty }}间</li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as utils from '../utils.js'
export default {
  data() {
    return {
      totalNumber: 0,
      numEmpty: 0,
    }
  },
  async created() {
    const url = '/population-statistics/api/v1/bdata/houses/total_count'
    const pmss = [
      axios.get(url),
      axios.get(
        '/population-statistics/api/v1/bdata/people/total_count/groupby/house'
      ),
    ]
    const data = await utils.reqBackend(pmss)
    this.totalNumber = data[0][0].hsNum
    this.numEmpty = this.totalNumber - data[1].length
  },
}
</script>
