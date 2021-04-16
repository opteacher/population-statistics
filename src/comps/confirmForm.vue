<template>
  <record-form :record="form" :top="60" :bottom="61"/>
</template>

<script>
import recordForm from "./recordForm"

export default {
  components: {
    "record-form": recordForm
  },
  props: {
    "form": Object
  }
}
</script>