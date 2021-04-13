<template>
  <div class="err-popup-container" style="position: relative">
    <mt-popup class="popup-error-tip text-center" v-model="showTip" popup-transition="popup-fade"
      :class="`popup-error-tip-${poppos}`" :style="`top: ${top}`">
      {{error.message}}
    </mt-popup>
  </div>
</template>

<script>
export default {
  props: {
    "error": Object,
    "pname": String,
    "poppos": {
      type: String,
      default: () => "bottom"
    }
  },
  data() {
    return {
      showTip: false,
      top: 0
    }
  },
  watch: {
    "error.active": function(n, o) {
      if (this.error.active) {
        if (this.error.pname === this.pname) {
          this.showTip = true
          this.error.active = false
        }
      }
    }
  },
  created() {
    switch (this.poppos) {
      case "top":
        this.top = "-72px"
        break
      case "bottom":
        this.top = "24px"
        break
      default:
        this.top = "-24px"
        break
    }
  }
}
</script>

<style lang="scss">
.popup-error-tip {
  position: absolute !important;
  // top: 24px !important;
  // top: -72px !important;
  left: 75vw !important;
  width: 50vw;
  padding: 10px 5px;
  border-radius: 5%;
  color: #ef4f4f;
}

.popup-error-tip-bottom::before {
  display: inline-block;
  width: 0;
  height: 0;
  border: solid transparent;
  border-width: 10px;
  border-bottom-color: #fff;
  content: "";
  position: absolute;
  top: -20px;
  right: 50px;
}

.popup-error-tip-top::after {
  display: inline-block;
  width: 0;
  height: 0;
  border: solid transparent;
  border-top-width: 10px;
  border-right-width: 10px;
  border-bottom-width: 0px;
  border-left-width: 10px;
  border-top-color: #fff;
  content: "";
  position: absolute;
  bottom: -10px;
  right: 50px;
}

// .popup-error-tip-right::before {
//   display: inline-block;
//   width: 0;
//   height: 0;
//   border: solid transparent;
//   border-top-width: 10px;
//   border-right-width: 10px;
//   border-bottom-width: 10px;
//   border-left-width: 0px;
//   border-bottom-color: #fff;
//   content: "";
//   position: absolute;
//   top: 25px;
//   left: -10px;
// }

// .popup-error-tip-right::after {
//   display: inline-block;
//   width: 0;
//   height: 0;
//   border: solid transparent;
//   border-width: 10px;
//   border-bottom-color: #fff;
//   content: "";
//   position: absolute;
//   top: 25px;
//   left: -10px;
// }
</style>