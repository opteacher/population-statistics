<template>
  <mt-cell is-link @click.native="onReportClick">
    <div slot="title">
      <span class="mint-cell-text">
        <mt-badge type="primary">{{report.type}}</mt-badge>{{report.name}}
      </span>
      <span class="mint-cell-label">
        <mt-badge :type="report.etypeClr">{{report.etype}}</mt-badge>{{report.pps}}
      </span>
    </div>
    <span>{{report.submit}}</span>
    <mt-button class="ml-1" type="default" size="small" @click.stop="onCallReqPsnClick">{{report.sbtPhone}}</mt-button>
  </mt-cell>
</template>

<script>
export default {
  props: {
    "report":Object
  },
  created() {
    let props = this.report.props.split(".")
    this.report.etype = props.pop()
    this.report.pps = props.join(".")
    switch (this.report.etype) {
      case "变更":
        this.report.etypeClr = "success"
        break
      case "错误":
        this.report.etypeClr = "error"
        break
      case "缺失":
        this.report.etypeClr = "warning"
        break
    }
  },
  methods: {
    onReportClick() {

    },
    onCallReqPsnClick() {
      window.location.href = `tel:${this.report.sbtPhone}`
    }
  }
}
</script>
