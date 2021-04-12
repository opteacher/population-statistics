<template>
  <div style="overflow-y: scroll">
    <mt-cell title="类型" :value="record.typeCn"/>
    <mt-cell v-if="!record.isLeave" title="来此目的" :value="record.purpose === 'work' ? '工作' : '居住'"/>
    <mt-cell title="姓名" :value="record.name"/>
    <mt-cell title="身份证" :value="record.idCard"/>
    <mt-cell v-if="!record.cmpId" title="性别" :value="record.gender"/>
    <mt-cell v-if="!record.cmpId" title="民族" :value="record.nation"/>
    <mt-cell title="手机号" :value="record.phone"/>
    <mt-cell title="居住地" :value="record.lvAddress"/>
    <mt-cell v-if="record.isLeave" title="目的地" :value="record.toAddress"/>
    <mt-cell v-if="record.cmpId" title="单位" :value="record.company"/>
    <mt-cell v-if="record.createdAt" title="申请时间" :value="(new Date(record.createdAt)).toLocaleString()"/>
  </div>
</template>

<script>
export default {
  props: {
    "record": Object
  },
  created() {
    this.record.isLeave = this.record.type === "leave"
    this.record.typeCn = this.record.isLeave ? "离开此地" : "来到此地"
  }
}
</script>