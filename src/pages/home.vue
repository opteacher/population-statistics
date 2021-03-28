<template>
  <div>
    <mt-field label="姓名" placeholder="请输入真实姓名" v-model="name"/>
    <mt-field label="身份证" placeholder="请输入身份证号码" type="number" v-model="id"/>
    <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="phone"/>
    <mt-field label="户籍地址" placeholder="请输入户籍地址" v-model="hhAddress"/>
    <mt-field label="居住地址" placeholder="请输入居住地址" v-model="lvAddress"/>
    <div class="w-100 fixed-bottom mb-2pr">
      <mt-button class="mlr-1pr" type="primary" style="width: 98vw">提交</mt-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        name: "",
        id: "",
        phone: "",
        hhAddress: "",
        lvAddress: ""
      }
    },
    async created() {
    },
    methods: {
    }
  }
</script>

<style type="text/scss">
.mlr-1pr {
  margin-left: 1vw;
  margin-right: 1vw;
}

.mb-2pr {
  margin-bottom: 2vh;
}
</style>