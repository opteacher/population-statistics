<template>
  <div class="scroll-panel" :style="`top: ${top}px; bottom: ${bottom}px`">
    <mt-cell title="类型" :value="report.type" />
    <mt-cell :title="report.nameTitle" :value="report.name" />
    <mt-cell title="异常信息" :value="report.props" />
    <mt-cell v-if="report.desc" title="补充说明" :value="report.desc" />
    <mt-cell title="上报人" :value="report.submit" />
    <mt-cell title="上报人手机号">
      <mt-button
        size="small"
        type="default"
        @click="onCallReqPsnClick(report.sbtPhone)"
      >
        {{ report.sbtPhone }}
      </mt-button>
    </mt-cell>
    <mt-cell
      title="上报时间"
      :value="new Date(report.createdAt).toLocaleString()"
    />
  </div>
</template>

<script>
export default {
  props: {
    report: Object,
    top: {
      type: Number,
      default: 0,
    },
    bottom: {
      type: Number,
      default: 0,
    },
  },
  created() {
    switch (this.report.type) {
      case '人员':
        this.report.nameTitle = '姓名'
        break
      case '单位':
        this.report.nameTitle = '店名'
        break
      case '房屋':
        this.report.nameTitle = '地址'
        break
    }
  },
  methods: {
    onCallReqPsnClick(phone) {
      window.location.href = `tel:${phone}`
    },
  },
}
</script>
