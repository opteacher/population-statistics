<template>
  <div>
    <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="form.phone"/>
    <err-popup-tip :error="error" pname="phone"/>
    <mt-field label="验证码" placeholder="请输入验证码" v-model="vcode">
      <mt-button :disabled="cdTime !== 0" size="small" @click.native="onSendVcodeClick">
        {{cdTime === 0 ? "发送验证码" : `${cdTime}s后重新发送`}}
      </mt-button>
    </mt-field>
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
      vcode: "",
      cdTime: 0
    }
  },
  methods: {
    onSendVcodeClick() {
      this.cdTime = 60
      const h = setInterval(() => {
        if (this.cdTime === 0) {
          clearInterval(h)
        } else {
          this.cdTime--
        }
      }, 1000)
    }
  }
}
</script>

