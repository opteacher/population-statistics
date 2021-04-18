<template>
  <div class="scroll-panel" style="top: 49px; bottom: 55px">
    <div>
      <mt-field label="单位注册名称" placeholder="请输入营业执照上的全称" v-model="form.name"/>
      <mt-field label="店名称" placeholder="请输入招牌名称" v-model="form.shopName"/>
      <popup-field title="类型" :form="form" pname="type" :bottom="55" :values="[
        '企业公司', '金融证券', '餐饮', '美容美发', '医疗机构', '健身房', '教育培训', '宾旅馆', '中介', '养身保健', '洗浴按摩', '便利超市', '其他'
      ]"/>
      <mt-field label="注册编号" placeholder="请输入注册编号" v-model="form.regId"/>
      <mt-field label="地址" placeholder="请输入所在地址" v-model="form.address"/>
      <mt-field label="法人姓名" placeholder="请输入法人姓名" v-model="form.lglName"/>
      <mt-field label="法人身份证" placeholder="请输入法人身份证" v-model="form.lglId"/>
      <mt-field label="法人手机号" placeholder="请输入法人手机号" type="tel" v-model="form.lglPhone"/>
      <popup-field title="营业时间" :form="form" pname="openHours" :bottom="55" :values="[times, times]"/>
      <mt-cell title="状态" class="mint-field">
        <mt-switch v-model="form.isClosed" style="color: grey">{{!form.isClosed ? "已停业" : "营业中"}}</mt-switch>
      </mt-cell>
      <mt-cell title="居住情况" class="mint-field">
        <mt-switch v-model="form.hasLiving" style="color: grey">{{form.hasLiving ? "有人居住" : "无人居住"}}</mt-switch>
      </mt-cell>
      <mt-cell title="沿街情况" class="mint-field">
        <mt-switch v-model="form.isAlgStreet" style="color: grey">{{form.isAlgStreet ? "沿街" : "不沿街"}}</mt-switch>
      </mt-cell>
      <mt-cell title="仓储情况" class="mint-field">
        <mt-switch v-model="form.hasStore" style="color: grey">{{form.hasStore ? "有仓库" : "无仓库"}}</mt-switch>
      </mt-cell>
      <mt-cell title="明火情况" class="mint-field">
        <mt-switch v-model="form.useFire" style="color: grey">{{form.useFire ? "用明火" : "不用明火"}}</mt-switch>
      </mt-cell>
      <mt-cell title="高层/地下情况" class="mint-field">
        <mt-switch v-model="form.isTopBottom" style="color: grey">{{form.isTopBottom ? "高层/地下室" : "非高层/非地下室"}}</mt-switch>
      </mt-cell>
    </div>
    <div class="w-100">
      <mt-button class="mlr-1pc mtb-1pc" :disabled="formSubmit" style="width: 98vw" type="primary" @click.prevent="onSubmitClick">提交</mt-button>
    </div>
  </div>
</template>

<script>
import { reqBackend } from "../utils"
import { Toast } from "mint-ui"
import popupField from "./popupField"

export default {
  components: {
    "popup-field": popupField
  },
  data() {
    return {
      form: {
        name: "",
        shopName: "",
        type: "",
        regId: "",
        address: "",
        lglName: "",
        lglId: "",
        lglPhone: "",
        openHours: "",
        isClosed: false,
        hasLiving: false,
        isAlgStreet: false,
        hasStore: false,
        useFire: false,
        isTopBottom: false
      },
      formSubmit: false,
      times: []
    }
  },
  created() {
    for (let i = 0; i <= 23; ++i) {
      let hour = i.toString().padStart(2, '0')
      this.times.push(`${hour}:00`)
      this.times.push(`${hour}:30`)
    }
    if (this.$route.query.id) {
      this.form.id = parseInt(this.$route.query.id)
      this.form.name = this.$route.query.name || ""
      this.form.shopName = this.$route.query.shopName || ""
      this.form.type = this.$route.query.type || "",
      this.form.regId = this.$route.query.regId || ""
      this.form.address = this.$route.query.address || ""
      this.form.lglName = this.$route.query.lglName || ""
      this.form.lglId = this.$route.query.lglId || ""
      this.form.lglPhone = this.$route.query.lglPhone || ""
      this.form.openHours = this.$route.query.openHours || "",
      this.form.isClosed = JSON.parse(this.$route.query.isClosed) || false,
      this.form.hasLiving = JSON.parse(this.$route.query.hasLiving) || false,
      this.form.isAlgStreet = JSON.parse(this.$route.query.isAlgStreet) || false,
      this.form.hasStore = JSON.parse(this.$route.query.hasStore) || false,
      this.form.useFire = JSON.parse(this.$route.query.useFire) || false,
      this.form.isTopBottom = JSON.parse(this.$route.query.isTopBottom) || false
    }
  },
  methods: {
    async onSubmitClick() {
      this.formSubmit = true
      await reqBackend(this.form.id ?
        axios.put(`/population-statistics/mdl/v1/company/${this.form.id}`, this.form) :
        axios.post("/population-statistics/mdl/v1/company", this.form))
      Toast({
        message: "提交成功！",
        iconClass: "iconfont icon-select-bold"
      })
      this.$router.push({path: `/population-statistics/list?type=${this.form.shopName ? 'company' : 'house'}`})
    }
  }
}
</script>
