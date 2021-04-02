<template>
  <div>
    <mt-field :label="label" :placeholder="placeholder" v-model="form[pname]"/>
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
    "label": String,
    "placeholder": String,
    "error": Object
  }
}
</script>
