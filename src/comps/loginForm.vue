<template>
  <div>
    <ipt-valid-field label="姓名" placeholder="请输入姓名" :form="form" :error="error" pname="name"/>
    <id-card-field :form="form" :error="error"/>
    <mt-navbar v-model="selTab">
      <mt-tab-item id="house">居住房屋</mt-tab-item>
      <mt-tab-item id="company">工作单位</mt-tab-item>
    </mt-navbar>
    <mt-tab-container class="mt-3" v-model="selTab">
      <mt-tab-container-item id="house">
        <sch-addr-field :form="form" :error="error" pname="lvAddress" params="?shopName===&shopName=" :top="253" :bottom="61"/>
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

export default {
  components: {
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
      } else {
        this.form.cmpId = ""
        this.form.company = ""
      }
    }
  }
}
</script>