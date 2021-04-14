<template>
  <div>
    <mt-cell title="姓名" :value="form.name"/>
    <mt-cell title="身份证" :value="form.idCard"/>
    <mt-field id="toAddress" label="去向地址" placeholder="请输入将前往的地址" v-model="form.toAddress"
       data-container="body" data-toggle="popover" data-trigger="manual" data-placement="bottom"/>
  </div>
</template>

<script>
export default {
  props: {
    "form": Object
  }
}
</script>