<template>
  <mt-cell is-link @click.native="onRecordClick(record)">
    <div slot="title">
      <mt-badge :type="record.isLeave ? 'error' : 'success'">{{
        record.type === 'leave' ? '离开' : '到来'
      }}</mt-badge>
      {{ record.name }}
      <mt-button
        type="default"
        size="small"
        @click.stop="onCallReqPsnClick(record.phone)"
        >{{ record.phone }}</mt-button
      >
    </div>
    <mt-button size="small" type="primary" @click.stop="onPassPsnClick(record)"
      >通过</mt-button
    >
  </mt-cell>
</template>

<script>
export default {
  props: {
    record: Object,
    onPassPsnClick: Function,
    onRecordClick: Function,
  },
  methods: {
    onCallReqPsnClick(phone) {
      window.location.href = `tel:${phone}`
    },
  },
}
</script>
