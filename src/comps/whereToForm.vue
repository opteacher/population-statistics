<template>
  <div>
    <mt-cell title="姓名" :value="form.name"/>
    <mt-cell title="身份证" :value="form.idCard"/>
    <mt-field label="去向地址" placeholder="请输入将前往的地址" v-model="form.toAddress"/>
    <err-popup-tip :error="error" pname="toAddress"/>
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
  }
}
</script>