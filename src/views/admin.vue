<template>
  <div>
    <mt-navbar v-model="selTab">
      <mt-tab-item id="company">实有单位</mt-tab-item>
      <mt-tab-item id="person">实有人口</mt-tab-item>
      <mt-tab-item id="house">实有房屋</mt-tab-item>
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container v-model="selTab">
      <mt-tab-container-item id="company">
        <companies-bdat ref="company-bdat" />
      </mt-tab-container-item>
      <mt-tab-container-item id="person">
        <people-bdat ref="person-bdat" />
      </mt-tab-container-item>
      <mt-tab-container-item id="house">
        <houses-bdat ref="house-bdat" />
      </mt-tab-container-item>
    </mt-tab-container>
    <btm-navi-bar select="admin" />
  </div>
</template>

<script>
import btmNaviBar from '../components/btmNaviBar.vue'
import peopleBdat from '../components/peopleBdat.vue'
import companiesBdat from '../components/companiesBdat.vue'
import housesBdat from '../components/housesBdat.vue'
export default {
  components: {
    'btm-navi-bar': btmNaviBar,
    'people-bdat': peopleBdat,
    'companies-bdat': companiesBdat,
    'houses-bdat': housesBdat,
  },
  data() {
    return {
      selTab: 'company',
    }
  },
  watch: {
    selTab: function (n, o) {
      const ref = this.$refs[`${n}-bdat`]
      ref.refresh && ref.refresh()
    },
  },
}
</script>
