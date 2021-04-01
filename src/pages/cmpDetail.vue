<template>
  <div>
    <mt-header title="公司详情">
      <router-link :to="`/population-statistics/list?type=${company.shopName ? 'company' : 'house'}`" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div>
      <mt-cell v-if="company.name" title="单位注册名称" :value="company.name"/>
      <mt-cell v-if="company.shopName" title="店名称" :value="company.shopName"/>
      <mt-cell v-if="company.regId" title="注册编号" :value="company.regId"/>
      <mt-cell title="地址" :value="company.address"/>
      <mt-cell v-if="company.lglName" title="法人姓名" :value="company.lglName"/>
      <mt-cell v-if="company.lglId" title="法人身份证" :value="company.lglId"/>
      <mt-cell v-if="company.lglPhone" title="法人手机号" :value="company.lglPhone"/>
      <mt-cell :title="company.shopName ? '员工' : '居民'" value="详情"
        :to="`/population-statistics/list?type=person&search=${company.shopName || company.address}`" is-link/>
    </div>
    <div class="w-100 fixed-bottom mb-55" style="background-color: white">
      <mt-button class="bottom-half-btn" type="primary" @click="onUpdateClick">编辑</mt-button>
      <mt-button class="bottom-half-btn" type="danger" @click="onDeleteClick">删除</mt-button>
    </div>
    <btm-navi-bar select="company"/>
  </div>
</template>

<script>
import btmNaviBar from "../comps/btmNaviBar"
import { MessageBox, Toast } from "mint-ui"
import "url"

export default {
  components: {
    "btm-navi-bar": btmNaviBar
  },
  data() {
    return {
      company: {},
      URLSearchParams
    }
  },
  created() {
    this.company = this.$route.query
  },
  methods: {
    onUpdateClick() {
      this.$router.push({path: `/population-statistics/input?type=company&${(new URLSearchParams(this.company)).toString()}`})
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
