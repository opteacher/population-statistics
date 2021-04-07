<template>
  <div>
    <div>
      <mt-cell title="提交人员">{{sbtPsn}}</mt-cell>
      <dsp-valid-cell title="离去人员" :form="form" pname="name" :error="error"/>
    </div>

    <mt-navbar v-model="selTab">
      <mt-tab-item id="house">同住</mt-tab-item>
      <mt-tab-item id="company">同工</mt-tab-item>
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container class="mt-3" v-model="selTab">
      <mt-tab-container-item id="house">
        <div class="scroll-panel">
          <mt-radio
            align="right"
            v-model="form.idCard"
            :options="psnInSameHs.map(person => ({
              label: person.name,
              value: person.idCard
            }))"/>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="company">
        <div class="scroll-panel">
          <mt-radio
            align="right"
            v-model="form.idCard"
            :options="psnInSameCmp.map(person => ({
              label: person.name,
              value: person.idCard
            }))"/>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
import dspValidCell from "./dspValidCell"
import { reqBackend } from "../utils"

export default {
  components: {
    "dsp-valid-cell": dspValidCell
  },
  props: {
    "form": Object,
    "error": Object
  },
  data() {
    return {
      selTab: "house",
      sbtPsn: "",
      psnInSameHs: [],
      psnInSameCmp: []
    }
  },
  watch: {
    "form.idCard": function(n, o) {
      for (let person of this.selTab === "house" ? this.psnInSameHs : this.psnInSameCmp) {
        if (person.idCard === n) {
          this._copyPerson(person)
          break
        }
      }
    }
  },
  async created() {
    const cmpUrl = `/population-statistics/mdl/v1/persons?cmpId=${this.form.cmpId}`
    await reqBackend(this.axios.get(cmpUrl), data => {
      this.psnInSameCmp = data
    })

    const hsUrl = `/population-statistics/mdl/v1/persons?lvAddress=${this.form.lvAddress}`
    await reqBackend(this.axios.get(hsUrl), data => {
      this.psnInSameHs = data
    })

    this.sbtPsn = this.form.submit
  },
  methods: {
    _copyPerson(person) {
      this.form.psnId = person.id
      this.form.name = person.name
      this.form.phone = person.phone
      this.form.hhAddress = person.hhAddress
      this.form.lvAddress = person.lvAddress
      this.form.cmpId = person.cmpId
      this.form.company = person.company
    }
  }
}
</script>

<style>
.sel-person {
  left: 0;
  right: 0;
  z-index: 100
}

.mint-header-title {
  margin-bottom: 0 !important;
}

.mint-radiolist label {
  margin: 0 !important;
}

.scroll-panel {
  position: fixed;
  left: 0;
  right: 0;
  top: 205px;
  bottom: 61px;
  overflow-y: scroll;
}
</style>
