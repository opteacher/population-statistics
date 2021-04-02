<template>
  <div>
    <mt-field label="身份证" placeholder="请输入身份证" v-model="form.idCard" :attr="{ type: 'number', maxlength: 18 }">
      <mt-button disabled size="small">
        <i class="iconfont icon-camera"/>
      </mt-button>
    </mt-field>
    <err-popup-tip :error="error" pname="idCard"/>
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

