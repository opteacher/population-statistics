<template>
  <div>
    <mt-cell title="姓名" :value="person.name"/>
    <mt-cell title="身份证" :value="person.idCard"/>
    <mt-cell title="手机号" :value="person.phone"/>
    <mt-cell title="户籍地址" :value="person.hhAddress"/>
    <mt-cell title="居住地址" :value="person.lvAddress"/>
    <mt-cell title="所在单位" :value="person.workComp"/>
    <div class="w-100 fixed-bottom mb-55" style="background-color: white">
      <mt-button class="ml-1pc mtb-1pc" style="width: 48vw; display: inline-block" type="primary" @click="onUpdateClick">编辑</mt-button>
      <mt-button class="mr-1pc mtb-1pc" style="width: 48vw; display: inline-block" type="danger" @click="onDeleteClick">删除</mt-button>
    </div>
    <btm-navi-bar select="person"/>
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
      person: {}
    }
  },
  created() {
    this.person = this.$route.query
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
        const res = await this.axios.delete(`/population-statistics/mdl/v1/person/${this.person.id}`)
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