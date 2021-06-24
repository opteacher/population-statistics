<template>
  <div>
    <mt-header v-if="lsMode === 'select'" title="选择模式">
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)">返回</mt-button>
    </mt-header>
    <mt-search class="nml-search" :class="{'sel-search': lsMode === 'select'}" v-model="searchItem.schWords" :show="true" @input="onSchWdsChanged('searchItem', [
      'name', 'shopName', 'address', 'lglName', 'lglPhone', 'phone', 'lvAddress', 'company'
    ])">
      <mt-radio v-if="lsMode === 'select'"
        align="right"
        v-model="edtEmployee.cmpId"
        :options="searchItem.mchItems.map(item => ({
          label: item.shopName,
          value: item.id.toString()
        }))"
      />
      <div v-else>
        <p class="mb-0 text-center" style="color: #888">
          {{searchItem.mchItems.length}}条记录
        </p>
        <mt-cell v-for="item in searchItem.mchItems" :key="item.id"
          :title="item[toolBox.titles[toolBox.mainIdx].value]"
          :label="item[toolBox.titles[toolBox.subIdx].value]"
          is-link @click.native="onItemClick(item)"
        >
          <span>详情</span>
        </mt-cell>
      </div>
    </mt-search>
    <div v-if="lsMode === 'select'" class="w-100 fixed-bottom mb-55" style="background-color: white">
      <mt-button class="mlr-1pc mtb-1pc" style="width: 98vw" type="primary" @click="onCfmSelClick">确定</mt-button>
    </div>
    <div v-else style="position: absolute; width: 100%; bottom: 55px; padding: 5px 3px; background-color: white">
      <mt-button type="default" style="width: 100%" size="small" @click="toolBox.visible = true">工具箱</mt-button>
      <mt-popup v-model="toolBox.visible" position="left" style="height: 100%; width: 80vw">
        <div style="position: fixed; width: 100%; top: 0; bottom: 97px">
          <mt-cell title="主标题" is-link :value="toolBox.titles[toolBox.mainIdx].title" @click.native="onTitleChanged('main')"/>
          <mt-cell title="副标题" is-link :value="toolBox.titles[toolBox.subIdx].title" @click.native="onTitleChanged('sub')"/>
          <mt-cell v-if="lsType === 'house'" title="只显示有住人房屋">
            <mt-switch v-model="toolBox.house.hasLv"></mt-switch>
          </mt-cell>
          <mt-cell v-if="lsType === 'person'" title="民族" is-link
            :value="toolBox.person.nations[toolBox.person.nationIdx]" @click="onNationChanged"
          />
        </div>
        <div style="position: fixed; width: 100%; bottom: 0; padding: 5px 3px">
          <mt-button class="mb-5" type="default" style="width: 100%" @click="onToolBoxExport">导出</mt-button>
          <mt-button type="primary" style="width: 100%" @click="onToolsConfirmed">确定</mt-button>
        </div>
      </mt-popup>
    </div>
    <btm-navi-bar :select="lsType" :onSelTabChanged="onSelTabChanged"/>
  </div>
</template>

<script>
import btmNaviBar from "../comps/btmNaviBar"
import utils from "../utils"
import "url"
import { MessageBox, Toast } from "mint-ui"
import { setTimeout } from 'timers';

export default {
  components: {
    "btm-navi-bar": btmNaviBar
  },
  data() {
    return {
      lsType: "",
      lsMode: "display",
      searchItem: {
        schWords: "",
        allItems: [],
        mchItems: []
      },
      URLSearchParams,
      edtEmployee: {},
      toolBox: {
        visible: false,
        titles: [],
        mainIdx: 0,
        subIdx: 0,
        house: {
          hasLv: false
        },
        person: {
          nationIdx: 0,
          nations: ["无"]
        }
      }
    }
  },
  watch: {
    "edtEmployee.cmpId": function(n, o) {
      for (let item of this.searchItem.mchItems) {
        if (item.id == n) {
          this.edtEmployee.company = item.shopName
          break
        }
      }
    }
  },
  created() {
    if (this.$route.query.search) {
      this.searchItem.schWords = this.$route.query.search
    }
    this.lsMode = this.$route.query.mode || "display"
    this.onSelTabChanged(this.$route.query.type)
    if (this.lsMode === "select") {
      this.edtEmployee = utils.copyPerson(this.$route.query)
    }
  },
  methods: {
    async onSelTabChanged(selTab) {
      this.lsType = selTab
      let urlParamStr = ""
      let url = ""
      switch (selTab) {
      case "company":
        url = "/population-statistics/mdl/v1/companys?shopName=!=&shopName="
        this.toolBox.titles = [{
          title: "执照名", value: "name"
        }, {
          title: "招牌名", value: "shopName"
        }, {
          title: "类别", value: "type"
        }, {
          title: "地址", value: "address"
        }]
        this.toolBox.mainIdx = 1
        this.toolBox.subIdx = 0
        break
      case "house":
        url = "/population-statistics/api/v1/houses/people"
        this.toolBox.titles = [{
          title: "地址", value: "address"
        }, {
          title: "房东", value: "lglName"
        }, {
          title: "人数", value: "psnNum"
        }]
        this.toolBox.mainIdx = 0
        this.toolBox.subIdx = 1
        break
      case "person":
        url = "/population-statistics/mdl/v1/persons"
        this.toolBox.titles = [{
          title: "姓名", value: "name"
        }, {
          title: "身份证", value: "idCard"
        }, {
          title: "手机号", value: "phone"
        }, {
          title: "居住地址", value: "lvAddress"
        }, {
          title: "工作单位", value: "company"
        }, {
          title: "居住地址/工作单位", value: "addCmp"
        }]
        this.toolBox.mainIdx = 0
        this.toolBox.subIdx = 5
        break
      }
      this.searchItem.allItems = await utils.reqBackend(axios.get(url))
      if (selTab === "person") {
        let nations = new Set()
        this.searchItem.allItems = this.searchItem.allItems.map(item => {
          item.addCmp = item.company || item.lvAddress
          nations.add(item.nation)
          return item
        })
        this.toolBox.person.nations = ["无"].concat(Array.from(nations))
        this.toolBox.person.nationIdx = 0
      }
      this.searchItem.mchItems = this.searchItem.allItems

      utils.eventBus.$on("scroll", async data => {
        const list = await utils.$wait(".mint-search-list", () => {
          return $(".mint-search-list-warp").height() > 0
        })
        if (data) {
          list.scrollTop(44 - parseInt(data))
        } else {
          list.scrollTop(0)
        }
      })
    },
    onCfmSelClick() {
      this.$router.push({
        path: `/input?tab=person&${(new URLSearchParams(this.edtEmployee)).toString()}`
      })
    },
    onItemClick(item) {
      const tab = this.lsType === "house" ? "company" : this.lsType
      const scroll = $(".mint-search-list-warp").offset().top
      const itmParams = (new this.URLSearchParams(item)).toString()
      this.$router.push({
        path: `/${tab}-detail?scroll=${scroll}&${itmParams}`
      })
    },
    onSchWdsChanged: utils.onSchWdsChanged,
    onTitleChanged(type) {
      if (this.toolBox[`${type}Idx`] + 1 >= this.toolBox.titles.length) {
        this.toolBox[`${type}Idx`] = 0
      } else {
        this.toolBox[`${type}Idx`]++
      }
    },
    onToolsConfirmed() {
      switch (this.lsType) {
        case "house":
          if (this.toolBox.house.hasLv) {
            this.searchItem.mchItems = _.filter(
              this.searchItem.mchItems, o => o.psnNum !== 0
            )
          } else {
            this.searchItem.mchItems = this.searchItem.allItems
          }
          break
      }
      this.toolBox.visible = false
    },
    onToolBoxExport() {

    }
  }
}
</script>

<style lang="scss">
.nml-search .mint-search-list {
  padding-bottom: 106px !important;
}

.sel-search .mint-search-list {
  padding-top: 0 !important;
  top: 84px !important;
  bottom: 53px !important;
}
</style>