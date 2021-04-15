<template>
  <div>
    <div>
      <mt-cell title="代办人员">{{sbtPsn}}</mt-cell>
      <mt-cell id="name" title="离去人员" data-container="body" data-toggle="popover" data-trigger="manual" data-placement="bottom">
        {{form.name}}
      </mt-cell>
    </div>
    <div style="padding: 5px 10px">{{form.relation + "人员："}}</div>
    <div class="scroll-panel">
      <mt-radio
        align="right"
        v-model="form.idCard"
        :options="people.map(person => ({
          label: person.name,
          value: person.idCard
        }))"/>
    </div>
  </div>
</template>

<script>
import { reqBackend } from "../utils"

export default {
  props: {
    "form": Object
  },
  data() {
    return {
      sbtPsn: "",
      people: []
    }
  },
  watch: {
    "form.idCard": function(n, o) {
      for (let person of this.people) {
        if (person.idCard === n) {
          this._copyPerson(person)
          break
        }
      }
    }
  },
  async created() {
    let url = ""
    if (this.form.relation === "同工") {
      url = `/population-statistics/mdl/v1/persons?cmpId=${this.form.cmpId}`
    } else {
      url = `/population-statistics/mdl/v1/persons?lvAddress=${this.form.lvAddress}`
    }
    this.people = await reqBackend(axios.get(url))
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
  top: 190px;
  bottom: 61px;
  overflow-y: scroll;
}
</style>
