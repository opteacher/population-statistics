<template>
  <div>
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">实有单位</mt-tab-item>
      <mt-tab-item id="2">实有人口</mt-tab-item>
    </mt-navbar>
    <mt-tab-container class="mt-3" v-model="selected">
      <mt-tab-container-item id="1"><compForm/></mt-tab-container-item>
      <mt-tab-container-item id="2"><staffForm/></mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
  import compForm from "../comps/compForm.vue"
  import staffForm from "../comps/staffForm.vue"

  export default {
    components: {
      compForm, staffForm
    },
    data() {
      return {
        selected: "1"
      }
    },
    async created() {
    },
    methods: {
    }
  }
</script>