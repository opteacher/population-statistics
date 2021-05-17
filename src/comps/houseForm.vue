<template>
  <sch-addr-field :form="form" pname="lvAddress" params="?shopName===&shopName=" :top="108" :bottom="61"/>
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
