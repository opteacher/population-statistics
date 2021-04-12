<template>
  <div>
    <mt-navbar v-model="selected">
      <mt-tab-item id="company">实有单位</mt-tab-item>
      <mt-tab-item id="person">实有人口</mt-tab-item>
    </mt-navbar>
    <mt-tab-container class="mt-3 mb-55" v-model="selected">
      <mt-tab-container-item id="company">
        <company-form :edtCompany="selected === 'company' ? edtSubject : undefined"/>
      </mt-tab-container-item>
      <mt-tab-container-item id="person">
        <person-form :edtPerson="selected === 'person' ? edtSubject : undefined"/>
      </mt-tab-container-item>
    </mt-tab-container>
    <btm-navi-bar select="input"/>
  </div>
</template>

<script>
import companyForm from "../comps/companyForm.vue"
import personForm from "../comps/personForm.vue"
import btmNaviBar from "../comps/btmNaviBar"

export default {
  components: {
    "company-form": companyForm,
    "person-form": personForm,
    "btm-navi-bar": btmNaviBar
  },
  data() {
    return {
      selected: "company",
      edtSubject: {}
    }
  },
  async created() {
    if (this.$route.query.type) {
      this.selected = this.$route.query.type
      this.edtSubject = Object.assign(this.$route.query)
      delete this.edtSubject.type
    }
  }
}
</script>