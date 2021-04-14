<template>
  <div>
    <mt-cell id="purpose" title="来此地目的" label="半工作半居住的请选择工作" :value="form.purposeCn || '请选择'"
      is-link @click.native="selHouseTypeVisible = true"
      data-container="body" data-toggle="popover" data-trigger="manual" data-placement="bottom"/>
    <mt-actionsheet :actions="houseTypes" v-model="selHouseTypeVisible"/>
  </div>
</template>

<script>
export default {
  props: {
    "form": Object
  },
  data() {
    return {
      selHouseTypeVisible: false,
      houseTypes: [{
        name: "居住",
        method: () => {
          this.form.purpose = "live"
          this.form.purposeCn = "居住"
        }
      }, {
        name: "工作",
        method: () => {
          this.form.purpose = "work"
          this.form.purposeCn = "工作"
        }
      }]
    }
  }
}
</script>