<template>
  <mt-field label="身份证" placeholder="请输入身份证" v-model="form.idCard" :attr="{ type: 'number', maxlength: 18 }">
    <mt-button disabled size="small">
      <i class="iconfont icon-camera"/>
    </mt-button>
  </mt-field>
</template>

<script>
export default {
  props: {
    "form": Object
  }
}
</script>

