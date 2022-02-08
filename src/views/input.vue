<template>
  <div>
    <mt-navbar v-model="selected">
      <mt-tab-item id="company">实有单位</mt-tab-item>
      <mt-tab-item id="person">实有人口</mt-tab-item>
    </mt-navbar>
    <mt-tab-container class="mt-3 mb-55" v-model="selected">
      <mt-tab-container-item id="company">
        <company-form />
      </mt-tab-container-item>
      <mt-tab-container-item id="person">
        <person-form />
      </mt-tab-container-item>
    </mt-tab-container>
    <btm-navi-bar select="input" />
  </div>
</template>

<script>
import companyForm from '../components/companyForm.vue'
import personForm from '../components/personForm.vue'
import btmNaviBar from '../components/btmNaviBar.vue'

export default {
  components: {
    'company-form': companyForm,
    'person-form': personForm,
    'btm-navi-bar': btmNaviBar,
  },
  data() {
    return {
      selected: 'company',
    }
  },
  async created() {
    if (this.$route.query.tab) {
      this.selected = this.$route.query.tab
    }
  },
}
</script>
