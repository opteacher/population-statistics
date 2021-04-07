<template>
  <div>
    <div>
      <mt-cell :title="title">{{form[pname]}}</mt-cell>
    </div>
    <err-popup-tip :error="error" :pname="pname"/>
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
    "pname": String,
    "title": String,
    "error": Object
  }
}
</script>