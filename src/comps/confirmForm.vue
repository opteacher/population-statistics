<template>
  <div class="confirm-form">
    <record-form :record="form"/>
  </div>
</template>

<script>
import recordForm from "./recordForm"

export default {
  components: {
    "record-form": recordForm
  },
  props: {
    "form": Object,
    "error": Object
  }
}
</script>

<style lang="scss">
.confirm-form {
  position: fixed;
  top: 60px;
  bottom: 61px;
  left: 0;
  right: 0;
}
</style>