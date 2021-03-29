<template>
  <div>
    <mt-cell title="单位注册名称" :value="company.name"/>
    <mt-cell title="店名称" :value="company.shopName"/>
    <mt-cell title="注册编号" :value="company.regId"/>
    <mt-cell title="地址" :value="company.address"/>
    <mt-cell title="法人姓名" :value="company.lglName"/>
    <mt-cell title="法人身份证" :value="company.lglId"/>
    <mt-cell title="法人手机号" :value="company.lglPhone"/>
    <mt-cell title="员工" value="详情" :to="`/population-statistics/list?type=person&company=${company.id}`" is-link/>
    <div class="w-100 fixed-bottom mb-55" style="background-color: white">
      <mt-button class="ml-1pc mtb-1pc" style="width: 48vw; display: inline-block" type="primary" @click="onUpdateClick">编辑</mt-button>
      <mt-button class="mr-1pc mtb-1pc" style="width: 48vw; display: inline-block" type="danger" @click="onDeleteClick">删除</mt-button>
    </div>
    <btm-navi-bar select="company"/>
  </div>
</template>

<script>
import btmNaviBar from "../comps/btmNaviBar"
import { MessageBox, Toast } from "mint-ui"

export default {
  components: {
    "btm-navi-bar": btmNaviBar
  },
  data() {
    return {
      company: {}
    }
  },
  created() {
    this.company = this.$route.query
  },
  methods: {
    onUpdateClick() {

    },
    onDeleteClick() {
      MessageBox({
        title: "提示",
        message: "确定执行此操作?",
        showCancelButton: true
      }).then(async action => {
        if (action !== "confirm") {
          return
        }
        const res = await this.axios.delete(`/population-statistics/mdl/v1/company/${this.company.id}`)
        if (res.status != 200) {
          Toast({
            message: `系统错误！${res.statusText}`,
            iconClass: "iconfont icon-close-bold"
          })
        } else {
          Toast({
            message: "删除成功！",
            iconClass: "iconfont icon-select-bold"
          })
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>
