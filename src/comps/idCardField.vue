<template>
  <mt-field id="idCard" :label="label" placeholder="请输入身份证" v-model="form.idCard" :attr="{ maxlength: 18 }"
    data-container="body" data-toggle="popover" data-trigger="manual" data-placement="bottom">

    <mt-button size="small" @click="onCameraClick">
      <i class="iconfont icon-camera"/>
    </mt-button>
  </mt-field>
</template>

<script>
import { Toast } from "mint-ui"

export default {
  props: {
    "form": Object,
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

