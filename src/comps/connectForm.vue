<template>
  <div>
    <mt-field id="phone" label="手机号" placeholder="请输入手机号" type="tel" v-model="form.phone"
      data-container="body" data-toggle="popover" data-trigger="manual" data-placement="bottom"/>
    <!-- @_@：先注释掉，等短信业务办下来了再开 -->
    <!-- <mt-field label="验证码" placeholder="请输入验证码" v-model="vcode">
      <mt-button :disabled="cdTime !== 0" size="small" @click.native="onSendVcodeClick">
        {{cdTime === 0 ? "发送验证码" : `${cdTime}s后重新发送`}}
      </mt-button>
    </mt-field> -->
  </div>
</template>

<script>
import { Toast } from "mint-ui"
export default {
  props: {
    "form": Object
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
      Toast({
        message: "手机号验证功能还在开发中，填写正确的手机号点击下一步即可。",
        iconClass: "iconfont icon-warning"
      })
    }
  }
}
</script>

