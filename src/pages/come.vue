<template>
  <div>
    <ul class="nav nav-pills nav-fill" style="margin: 2vh 2vw">
      <li class="nav-item">
        <a class="nav-link active" @click="onToStepClick('house')">房屋</a>
      </li>
      <i class="iconfont icon-arrow-right"/>
      <li class="nav-item">
        <a class="nav-link" @click="onToStepClick('person')">人员</a>
      </li>
      <i class="iconfont icon-arrow-right"/>
      <li class="nav-item">
        <a class="nav-link" @click="onToStepClick('company')">单位</a>
      </li>
      <i class="iconfont icon-arrow-right"/>
      <li class="nav-item">
        <a class="nav-link" @click="onToStepClick('connect')">联系方式</a>
      </li>
    </ul>
    <div class="center-container">
      <div class="w-100">
        <mt-cell title="房屋类型" is-link :value="form.lvAddrType || '请选择'" @click.native="selHouseTypeVisible = true"/>
        <mt-actionsheet :actions="houseTypes" v-model="selHouseTypeVisible"/>
        <mt-field label="居住地址" placeholder="居住地址" v-model="form.lvAddress"/>
        <div style="margin: 0 2vw">
          <mt-cell title="标题文字" is-link/>
          <mt-cell title="标题文字" is-link/>
          <mt-cell title="标题文字" is-link/>
          <mt-cell title="标题文字" is-link/>
          <mt-cell title="标题文字" is-link/>
          <mt-cell title="标题文字" is-link/>
          <mt-cell title="标题文字" is-link/>
          <mt-cell title="标题文字" is-link/>
          <mt-cell title="标题文字" is-link/>
          <mt-cell title="标题文字" is-link/>
          <mt-cell title="标题文字" is-link/>
          <mt-cell title="标题文字" is-link/>
          <mt-cell title="标题文字" is-link/>
          <mt-cell title="标题文字" is-link/>
        </div>
      </div>
    </div>
    <div class="fixed-bottom" style="margin: 2vh 2vw">
      <mt-button v-if="curStep !== 'house'" type="default">上一步</mt-button>
      <mt-button v-if="curStep !== 'connect'" class="float-right" type="primary">下一步</mt-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curStep: "house",
      selHouseTypeVisible: false,
      houseTypes: [{
        name: "居住",
        method: () => {
          this.form.lvAddrType = "居住"
        }
      }, {
        name: "工作",
        method: () => {
          this.form.lvAddrType = "工作"
        }
      }, {
        name: "半住半工",
        method: () => {
          this.form.lvAddrType = "半住半工"
        }
      }],
      form: {
        lvAddress: "",
        lvAddrType: ""
      }
    }
  },
  async created() {
  },
  methods: {
    onToStepClick(step) {
      return function() {

      }
    }
  }
}
</script>

<style lang="scss">
.iconfont::before {
  position: relative;
  top: 8px;
}
.nav-item a {
  padding-left: 0;
  padding-right: 0;
}
</style>