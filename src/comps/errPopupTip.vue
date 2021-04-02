<template>
  <div style="position: relative">
    <mt-popup class="popup-error-tip text-center" v-model="showTip" popup-transition="popup-fade">{{error.message}}</mt-popup>
  </div>
</template>

<script>
export default {
  props: {
    "error": Object,
    "pname": String
  },
  data() {
    return {
      showTip: false
    }
  },
  watch: {
    "error.active": function(n, o) {
      if (this.error.active) {
        if (this.error.pname === this.pname) {
          this.showTip = true
        }
        this.error.active = false
      }
    }
  }
}
</script>

<style lang="scss">
.popup-error-tip {
  position: absolute !important;
  top: 24px !important;
  left: 75vw !important;
  width: 50vw;
  padding: 10px 5px;
  border-radius: 5%;
}

.popup-error-tip::before {
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
</style>