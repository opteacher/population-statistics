<template>
  <div>
    <mt-field label="代办人姓名" placeholder="请输入姓名" v-model="form.name">
      <mt-button size="small" @click="onInforBtnClick">
        <i class="iconfont icon-tishi"/>
      </mt-button>
    </mt-field>
    <err-popup-tip :error="error" pname="name"/>
    <id-card-field label="代办人身份证" :form="form" :error="error"/>
    <mt-navbar v-model="selTab">
      <mt-tab-item id="house">居住房屋</mt-tab-item>
      <mt-tab-item id="company">工作单位</mt-tab-item>
    </mt-navbar>
    <mt-tab-container class="mt-3" v-model="selTab">
      <mt-tab-container-item id="house">
        <sch-addr-field ref="sch-addr-field" :form="form" :error="error" pname="lvAddress" params="?shopName===&shopName=" :top="253" :bottom="61"/>
      </mt-tab-container-item>
      <mt-tab-container-item id="company">
        <house-form :form="form" :error="error" purpose="work"/>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
import iptValidField from "./iptValidField"
import idCardField from "./idCardField"
import schAddrField from "./schAddrField"
import houseForm from "./houseForm"
import errPopupTip from "./errPopupTip"
import { reqBackend } from "../utils"
import { MessageBox } from "mint-ui"

export default {
  components: {
    "err-popup-tip": errPopupTip,
    "ipt-valid-field": iptValidField,
    "id-card-field": idCardField,
    "sch-addr-field": schAddrField,
    "house-form": houseForm
  },
  props: {
    "form": Object,
    "error": Object
  },
  data() {
    return {
      selTab: "house"
    }
  },
  watch: {
    "selTab": function(n, o) {
      if (n === "company") {
        this.form.lvAddress = ""
        this.$refs["sch-addr-field"].searchAddr.schWords = ""
      } else {
        this.form.cmpId = ""
        this.form.company = ""
      }
    }
  },
  methods: {
    async onNextBtnClick() {
      let url = `/population-statistics/mdl/v1/persons?name=${this.form.name}&idCard=${this.form.idCard}`
      url += this.form.cmpId !== "" ? `&cmpId=${this.form.cmpId}` : `&lvAddress=${this.form.lvAddress}`
      let sbtPerson = null
      try {
        sbtPerson = await new Promise((res, rej) => {
          reqBackend(axios.get(url), data => {
            (!data || data.length !== 1) ? rej() : res(data[0])
          })
        })
      } catch(e) {
        return Promise.resolve(false)
      }
      this.form.psnId = sbtPerson.id
      this.form.submit = sbtPerson.name
      this.form.phone = sbtPerson.phone
      return Promise.resolve(true)
    },
    onInforBtnClick() {
      MessageBox("提示", "代办人可代替将离去的人员申报相关信息，现暂定为同住一屋或者共同工作的人员可代办该业务，代办人需提供自己真实的姓名、身份证以及住址/单位。如自身就是将离人员，代办人填写自身信息即可。")
    }
  }
}
</script>