<template>
  <div>
    <mt-cell title="来此目的" is-link :value="form.purposeCn || '请选择'" @click.native="selHouseTypeVisible = true"/>
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
      }, {
        name: "半住半工",
        method: () => {
          this.form.purpose = "live"
          this.form.purposeCn = "半住半工"
        }
      }]
    }
  }
}
</script>
