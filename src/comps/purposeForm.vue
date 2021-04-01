<template>
  <div>
    <mt-cell title="来此目的" is-link :value="form.purposeCn || '请选择'" @click.native="selHouseTypeVisible = true"/>
    <mt-actionsheet :actions="houseTypes" v-model="selHouseTypeVisible"/>
    <mt-cell title="提示"><span style="color: green">半工半住的请选择工作</span></mt-cell>
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
