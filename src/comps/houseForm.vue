<template>
  <div>
    <mt-cell title="房屋类型" is-link :value="form.lvAddrType || '请选择'" @click.native="selHouseTypeVisible = true"/>
    <mt-actionsheet :actions="houseTypes" v-model="selHouseTypeVisible"/>
    <mt-field label="居住地址" placeholder="居住地址" v-model="form.lvAddress"/>
    <div class="sch-houses-panel">
      <div class="h-100">
        <mt-cell v-for="house in schHouses"
          :title="house.address"
          :key="house.id"
          is-link @click.native="onHouseLnkClick(house.address)"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    "form": Object
  },
  data() {
    return {
      selHouseTypeVisible: false,
      houseTypes: [{
        name: "居住",
        method: () => {
          this.form.lvAddrType = "居住"
        }
      }, {
        name: "工作",
        method: () => {
          this.form.lvAddrType = "工作"
        }
      }, {
        name: "半住半工",
        method: () => {
          this.form.lvAddrType = "半住半工"
        }
      }],
      houses: [],
      schHouses: []
    }
  },
  watch: {
    "form.lvAddress": function(n, o) {
      if (!n) {
        this.schHouses = this.houses
        return
      }
      this.schHouses = []
      for (let house of this.houses) {
        if (house.address.includes(n)) {
          this.schHouses.push(house)
        }
      }
    }
  },
  async created() {
    const res = await this.axios.get("/population-statistics/mdl/v1/companys")
    if (res.status != 200) {
      Toast({
        message: `系统错误！${res.statusText}`,
        iconClass: "iconfont icon-close-bold"
      })
    } else {
      this.houses = res.data.data
      this.schHouses = this.houses
    }
  },
  methods: {
    onHouseLnkClick(address) {
      this.form.lvAddress = address
    }
  }
}
</script>

<style lang="scss">
.sch-houses-panel {
  position: fixed;
  margin-top: 1vh;
  right: 0;
  left: 0;
  top: 156px;
  bottom: 60px;
  overflow-y: scroll
}
</style>
