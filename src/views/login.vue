<template>
  <div>
    <div>
      <mt-field
        label="用户名"
        placeholder="请输入用户名"
        v-model="form.username"
      />
      <mt-field
        label="密码"
        placeholder="请输入密码"
        type="password"
        v-model="form.password"
      />
      <mt-field
        v-if="mode !== 'admin'"
        label="注册码"
        placeholder="请输入注册码（注册时需要）"
        v-model="form.regCode"
      />
    </div>
    <div class="w-100 fixed-bottom" style="background-color: white">
      <mt-button
        class="mlr-1pc mtb-1pc"
        style="width: 98vw"
        type="primary"
        @click="onLoginClicked"
        >登录{{ mode !== 'admin' ? ' / 注册' : '' }}</mt-button
      >
      <mt-button
        class="mlr-1pc mtb-1pc"
        style="width: 98vw; background-color: #04be02; color: white"
        disabled
      >
        <img
          src="/assets/imgs/wechat.png"
          height="20"
          width="20"
          style="color: white"
          slot="icon"
        />微信登录
      </mt-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        regCode: '',
      },
      mode: 'user',
    }
  },
  created() {
    this.mode = this.$route.query.mode
  },
  methods: {
    async onLoginClicked() {
      await this.$store.dispatch('login', {
        role: this.mode,
        form: this.form,
      })
      let redirect = '/admin'
      if (this.$route.query.redirect) {
        redirect = this.$route.query.redirect
      }
      this.$router.push({
        path: redirect,
        replace: true,
      })
    },
  },
}
</script>
