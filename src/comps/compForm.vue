<template>
  <div>
    <mt-field label="单位名称" placeholder="请输入营业执照上的全称" v-model="name"/>
    <mt-field label="店名称" placeholder="请输入招牌名称" v-model="shopName"/>
    <mt-field label="注册编号" placeholder="请输入注册编号" v-model="regId"/>
    <mt-field label="地址" placeholder="请输入所在地址" v-model="address"/>
    <mt-field label="法人姓名" placeholder="请输入法人姓名" v-model="lglName"/>
    <mt-field label="法人身份证" placeholder="请输入法人身份证" v-model="lglId"/>
    <mt-field label="法人手机号" placeholder="请输入法人手机号" type="tel" v-model="lglPhone"/>
    <div class="w-100 fixed-bottom mb-1pr">
      <mt-button class="mlr-1pr" type="primary" style="width: 98vw">提交</mt-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        name: "",
        shopName: "",
        regId: "",
        address: "",
        lglName: "",
        lglId: "",
        lglPhone: ""
      }
    },
    async created() {
    },
    methods: {
    }
  }
</script>

<style type="text/scss">
</style>