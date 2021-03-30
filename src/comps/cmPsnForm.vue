<template>
  <div>
    <mt-navbar v-model="selTab">
      <mt-tab-item id="new">新居民</mt-tab-item>
      <mt-tab-item id="old">老居民</mt-tab-item>
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container class="mt-3" v-model="selTab">
      <mt-tab-container-item id="new">
        <mt-field label="身份证" placeholder="请输入身份证" v-model="form.idCard" :attr="{ type: 'number', maxlength: 18 }">
          <mt-button disabled size="small">
            <i class="iconfont icon-camera"/>
          </mt-button>
        </mt-field>
        <mt-field label="姓名" placeholder="请输入姓名" v-model="form.name"/>
        <mt-field label="户籍地址" placeholder="请输入户籍地址（可选）" v-model="form.hhAddress"/>
      </mt-tab-container-item>
      <mt-tab-container-item id="old">
        <mt-search v-model="schWords">
          <mt-radio
            align="right"
            v-model="oldPerson"
            :options="people.map(person => ({
              label: person.name,
              value: person.idCard
            }))"/>
        </mt-search>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
export default {
  props: {
    "form": Object
  },
  data() {
    return {
      selTab: "new",
      oldPerson: "",
      schWords: "",
      people: []
    }
  }
}
</script>