<template>
  <div>
    <mt-cell class="mint-field" :title="title" is-link @click.native="showPopup = true">
      <span style="color: gray">{{form[pname] || `请选择${title}`}}</span>
    </mt-cell>
    <mt-popup class="w-100" v-model="showPopup" position="bottom" :style="`bottom: ${bottom}px`">
      <mt-picker :slots="slots" :visible-item-count="5" :show-toolbar="false" @change="onValPicked"/>
    </mt-popup>
  </div>
</template>

<script>
export default {
  props: {
    "title": String,
    "form": Object,
    "pname": String,
    "bottom": {
      type: Number,
      default: 0
    },
    "values": Array
  },
  data() {
    return {
      showPopup: false,
      isMultiSel: false,
      slots: []
    }
  },
  created() {
    this.isMultiSel = this.values[0] instanceof Array
    let selValue = this.form[this.pname]
    if (this.isMultiSel) {
      selValue = selValue.split("-")
    }
    this.slots = !this.isMultiSel ? [{
      flex: 1,
      values: this.values,
      defaultIndex: this.values.indexOf(selValue)
    }] : this.values.map((value, idx) => {
      let ret = [{
        flex: 1,
        values: value,
        defaultIndex: value.indexOf(selValue[idx])
      }]
      if (this.values.length - 1 !== idx) {
        ret.push({
          divider: true,
          content: "-"
        })
      }
      return ret
    }).flat()
  },
  methods: {
    onValPicked(picker, values) {
      for (let i = 0; i < values.length - 1; ++i) {
        if (values[i] > values[i + 1]) {
          picker.setSlotValue(i + 1, values[i])
        }
      }
      this.form[this.pname] = values.join("-")
      this.showPopup = false
    }
  }
}
</script>
