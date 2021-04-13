<template>
  <div>
    <div>
      <mt-cell title="来此地目的" label="半工作半居住的请选择工作" is-link :value="form.purposeCn || '请选择'" @click.native="selHouseTypeVisible = true"/>
    </div>
    <err-popup-tip :error="error" pname="purpose"/>
    <mt-actionsheet :actions="houseTypes" v-model="selHouseTypeVisible"/>
  </div>
</template>

<script>
import errPopupTip from "./errPopupTip"

export default {
  components: {
    "err-popup-tip": errPopupTip
  },
  props: {
    "form": Object,
    "error": Object
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