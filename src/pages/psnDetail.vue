<template>
  <div>
    <mt-header title="人员详情">
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)">返回</mt-button>
    </mt-header>
    <div style="position: absolute; top: 40px; left: 0; right: 0; bottom: 106px; overflow-y: scroll">
      <mt-cell title="姓名" :value="person.name"/>
      <mt-cell title="身份证" :value="person.idCard"/>
      <mt-cell v-if="person.gender" title="性别" :value="person.gender"/>
      <mt-cell v-if="person.nation" title="民族" :value="person.nation"/>
      <mt-cell title="手机号" :value="person.phone"/>
      <mt-cell title="户籍地址" :value="person.hhAddress"/>
      <mt-cell title="居住地址" :value="person.lvAddress"/>
      <mt-cell v-if="person.company && person.company !== 'null'" title="所在单位" :value="person.company"/>
    </div>
    <div class="w-100 fixed-bottom mb-55" style="background-color: white">
      <mt-button class="bottom-half-btn" type="primary" @click="onUpdateClick">编辑</mt-button>
      <mt-button class="bottom-half-btn" type="danger" @click="onDeleteClick">删除</mt-button>
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
      this.$router.push({path: `/population-statistics/input?type=person&${(new URLSearchParams(this.person)).toString()}`})
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
        const res = await axios.delete(`/population-statistics/mdl/v1/person/${this.person.id}`)
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