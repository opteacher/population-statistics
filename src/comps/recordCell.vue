<template>
  <mt-cell :title="`${record.name} | ${record.phone}`" is-link @click.native="onRecordClick(record)">
    <mt-badge slot="icon" :type="record.isLeave ? 'error' : 'success'">{{record.typeCn}}</mt-badge>
    <mt-button size="small" type="primary" @click="onPassPsnClick(record)">通过</mt-button>
  </mt-cell>
</template>

<script>
export default {
  props: {
    "record": Object,
    "onPassPsnClick": Function,
    "onRecordClick": Function
  }
}
</script>

