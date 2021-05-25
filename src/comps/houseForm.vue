<template>
  <div>
    <sch-addr-field :form="form" pname="lvAddress" params="?shopName===&shopName="
      :top="108" :bottom="109" :hasBtmMgn="true"
    />
    <div>
      <mt-cell class="mint-field has-lv-cd" title="有无居住证">
        <mt-switch v-model="form.hasLvCard" style="color: grey">
          {{form.hasLvCard ? "有" : "无"}}
        </mt-switch>
      </mt-cell>
    </div>
  </div>
</template>

<script>
import utils from "../utils"
import schAddrField from "./schAddrField"

export default {
  props: {
    "form": Object
  },
  components: {
    "sch-addr-field": schAddrField
  }
}
</script>

<style>
.has-lv-cd {
  position: absolute;
  left: 0; right: 0;
  bottom: 0;
}
</style>

