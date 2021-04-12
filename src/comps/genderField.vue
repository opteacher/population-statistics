<template>
  <div>
    <mt-cell class="mint-field" title="性别"
      is-link @click.native="form.gender = form.gender === '男' ? '女' : '男'">
      <span style="color: gray">{{form.gender || "请选择性别"}}</span>
    </mt-cell>
  </div>
</template>

<script>
export default {
  props: {
    "form": Object
  }
}
</script>

