<template>
  <div>
    <div>
      <mt-field :label="label" placeholder="请输入身份证" v-model="form.idCard" :attr="{ type: 'number', maxlength: 18 }">
        <mt-button size="small" @click="onCameraClick">
          <i class="iconfont icon-camera"/>
        </mt-button>
      </mt-field>
    </div>
    <err-popup-tip :error="error" pname="idCard"/>
  </div>
</template>

<script>
import { Toast } from "mint-ui"
import errPopupTip from "./errPopupTip"

export default {
  components: {
    "err-popup-tip": errPopupTip
  },
  props: {
    "form": Object,
    "error": {
      type: Object,
      default: () => ({
        active: false,
        pname: "",
        message: ""
      })
    },
    "label": {
      type: String,
      default: "身份证"
    }
  },
  methods: {
    onCameraClick() {
      Toast({
        message: "拍摄身份证录入功能还在开发中",
        iconClass: "iconfont icon-warning"
      })
    }
  }
}
</script>

