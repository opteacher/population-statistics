<template>
  <div>
    <div style="position: fixed; width: 100%; top: 0; bottom: 51px; overflow-y: scroll">
      <div>
        <mt-cell title="主标题" :value="title.array[title.mainIdx].title"
          is-link @click.native="onToolBoxSelChanged('title.array', 'title.mainIdx')"
        />
        <mt-cell title="副标题" :value="title.array[title.subIdx].title"
          is-link @click.native="onToolBoxSelChanged('title.array', 'title.subIdx')"
        />
        <mt-cell title="排序" is-link :value="sort.array[sort.index].title" @click.native="onSortClicked"/>
        <mt-cell v-if="lsType === 'house'" title="只显示有住人房屋">
          <mt-switch v-model="house.hasLv"/>
        </mt-cell>
        <mt-cell v-if="lsType === 'company'" title="类别" is-link
          :value="company.type.array[company.type.index]"
          @click.native="onToolBoxSelChanged('company.type.array', 'company.type.index')"
        />
        <mt-cell v-if="lsType === 'person'" title="民族" is-link
          :value="person.nation.array[person.nation.index]"
          @click.native="onToolBoxSelChanged('person.nation.array', 'person.nation.index')"
        />
        <div v-if="lsType === 'house'">
          <mt-cell title="批量生成房屋"
            is-link :value="house.bthGenHss.show ? '收起' : '展开'"
            @click.native="house.bthGenHss.show = !house.bthGenHss.show"
            data-toggle="collapse" data-target="#bthGenHss"
            aria-expanded="false" aria-controls="bthGenHss"
          />
          <div class="collapse" id="bthGenHss">
            <mt-field label="地址前缀" placeholder="请输入地址前缀" v-model="house.bthGenHss.pre"/>
            <mt-field label="开始室号" placeholder="请输入数字" type="number" v-model="house.bthGenHss.begRoom"/>
            <mt-field label="结束室号" placeholder="请输入数字" type="number" v-model="house.bthGenHss.endRoom"/>
            <mt-button type="primary" size="small" class="w-98 mlr-1pc" @click="onBthGenHssClicked">生成</mt-button>
          </div>
        </div>
        <div v-if="lsType === 'company'">
          <mt-cell title="导出单位数据"
            is-link :value="company.exports.show ? '收起' : '展开'"
            @click.native="company.exports.show = !company.exports.show"
            data-toggle="collapse" data-target="#cmpExps"
            aria-expanded="false" aria-controls="cmpExps"
          />
          <div class="collapse plr-1pc" id="cmpExps">
            <mt-field label="导出文件名" placeholder="导出单位 + 日期" v-model="company.exports.fileName"/>
            <mt-button class="mt-5 w-100" type="primary" @click="onCompaniesExport">导出</mt-button>
          </div>
        </div>
        <div v-if="lsType === 'person'">
          <mt-cell title="导出人员数据"
            is-link :value="person.exports.show ? '收起' : '展开'"
            @click.native="person.exports.show = !person.exports.show"
            data-toggle="collapse" data-target="#psnExps"
            aria-expanded="false" aria-controls="psnExps"
          />
          <div class="collapse plr-1pc" id="psnExps">
            <p class="mb-0 pl-10" style="color: #888; background-color: #ddd">导出列</p>
            <mt-cell title="姓名">
              <mt-switch v-model="person.exports.columns.name">
                {{person.exports.columns.name ? "导出" : "不导出"}}
              </mt-switch>
            </mt-cell>
            <mt-cell title="身份证">
              <mt-switch v-model="person.exports.columns.idCard">
                {{person.exports.columns.idCard ? "导出" : "不导出"}}
              </mt-switch>
            </mt-cell>
            <mt-cell title="性别">
              <mt-switch v-model="person.exports.columns.gender">
                {{person.exports.columns.gender ? "导出" : "不导出"}}
              </mt-switch>
            </mt-cell>
            <mt-cell title="民族">
              <mt-switch v-model="person.exports.columns.nation">
                {{person.exports.columns.nation ? "导出" : "不导出"}}
              </mt-switch>
            </mt-cell>
            <mt-cell title="手机号">
              <mt-switch v-model="person.exports.columns.phone">
                {{person.exports.columns.phone ? "导出" : "不导出"}}
              </mt-switch>
            </mt-cell>
            <mt-cell title="户籍地址">
              <mt-switch v-model="person.exports.columns.hhAddress">
                {{person.exports.columns.hhAddress ? "导出" : "不导出"}}
              </mt-switch>
            </mt-cell>
            <mt-cell title="居住地址">
              <mt-switch v-model="person.exports.columns.lvAddress">
                {{person.exports.columns.lvAddress ? "导出" : "不导出"}}
              </mt-switch>
            </mt-cell>
            <mt-cell title="工作单位">
              <mt-switch v-model="person.exports.columns.company">
                {{person.exports.columns.company ? "导出" : "不导出"}}
              </mt-switch>
            </mt-cell>
            <mt-cell v-for="column in person.exports.addCols" :key="column" :title="column">
              <mt-button size="small" type="danger" @click="onDelColClicked(column)">删除</mt-button>
            </mt-cell>
            <mt-field label="自定义列" placeholder="请输入列名" v-model="person.exports.addCol"/>
            <mt-button class="mb-5 w-100" size="small" type="primary" plain @click="onAddNewColClicked">
              添加新列
            </mt-button>
            <p class="mb-0 pl-10" style="color: #888; background-color: #ddd">导出配置</p>
            <mt-field label="导出文件名" placeholder="导出单位 + 日期" v-model="person.exports.fileName"/>
            <mt-cell title="工作单位覆盖居住地址">
              <mt-switch v-model="person.exports.cmpCovAdd">
                {{person.exports.cmpCovAdd ? "是" : "否"}}
              </mt-switch>
            </mt-cell>
            <mt-button class="mt-5 w-100" type="primary" plain @click="onPeopleExport">导出</mt-button>
          </div>
        </div>
      </div>
    </div>
    <div style="position: fixed; width: 100%; bottom: 0; padding: 5px 3px">
      <mt-button type="primary" style="width: 100%" @click="onToolsConfirmed">确定</mt-button>
    </div>
  </div>
</template>

<script>
import utils from "../utils"
import { Toast, MessageBox, Indicator } from "mint-ui"
export default {
  props: {
    "lsType": String,
    "searchItem": Object,
    "confirmed": Function
  },
  data() {
    return {
      title: {
        array: [""],
        mainIdx: 0,
        subIdx: 0
      },
      sort: {
        array: [{
          title: "无", value: "none"
        }],
        index: 0,
      },
      house: {
        hasLv: false,
        bthGenHss: {
          show: false,
          pre: "",
          begRoom: "",
          endRoom: ""
        }
      },
      person: {
        nation: {
          array: [""],
          index: 0
        },
        exports: {
          show: false,
          fileName: "",
          columns: {
            name: true,
            idCard: true,
            gender: true,
            nation: true,
            phone: true,
            hhAddress: true,
            lvAddress: true,
            company: true
          },
          addCol: "",
          addCols: [],
          cmpCovAdd: false
        }
      },
      company: {
        type: {
          array: [""],
          index: 0
        },
        exports: {
          show: false,
          fileName: ""
        }
      }
    }
  },
  methods: {
    refresh() {
      switch(this.lsType) {
      case "company":
        this.title.array = [{
          title: "执照名", value: "name"
        }, {
          title: "招牌名", value: "shopName"
        }, {
          title: "类别", value: "type"
        }, {
          title: "地址", value: "address"
        }]
        this.title.mainIdx = 1
        this.title.subIdx = 0

        let types = new Set()
        for (const item of this.searchItem.allItems) {
          types.add(item.type)
        }
        this.company.type.array = ["无"].concat(Array.from(types))
        this.company.type.index = 0
        break
      case "house":
        this.title.array = [{
          title: "地址", value: "address"
        }, {
          title: "房东", value: "lglName"
        }, {
          title: "人数", value: "psnNum"
        }]
        this.title.mainIdx = 0
        this.title.subIdx = 1
        break
      case "person":
        this.title.array = [{
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
        this.title.mainIdx = 0
        this.title.subIdx = 5

        let nations = new Set()
        for (const item of this.searchItem.allItems) {
          nations.add(item.nation)
        }
        this.person.nation.array = ["无"].concat(Array.from(nations))
        this.person.nation.index = 0
        break
      }
      this.sort.array = [{
        title: "无", value: "none"
      }].concat(this.title.array)
      this.sort.index = 0

      this.confirmed({
        mainTitle: this.title.array[this.title.mainIdx].value,
        subTitle: this.title.array[this.title.subIdx].value
      })
    },
    onToolBoxSelChanged(aryProp, idxProp) {
      const addOnce = _.get(this, idxProp) + 1
      if (addOnce >= _.get(this, aryProp).length) {
        _.set(this, idxProp, 0)
      } else {
        _.set(this, idxProp, addOnce)
      }
    },
    onToolsConfirmed() {
      switch (this.lsType) {
        case "house":
          if (this.house.hasLv) {
            this.searchItem.mchItems = _.filter(
              this.searchItem.allItems, o => o.psnNum !== 0
            )
          } else {
            this.searchItem.mchItems = this.searchItem.allItems
          }
          break
        case "person":
          if (this.person.nation.index) {
            this.searchItem.mchItems = _.filter(
              this.searchItem.allItems, o => o.nation === this.person.nation.array[this.person.nation.index]
            )
          } else {
            this.searchItem.mchItems = this.searchItem.allItems
          }
          break
        case "company":
          if (this.company.type.index) {
            this.searchItem.mchItems = _.filter(
              this.searchItem.allItems, o => o.type === this.company.type.array[this.company.type.index]
            )
          } else {
            this.searchItem.mchItems = this.searchItem.allItems
          }
          break
      }
      const sortKey = this.sort.array[this.sort.index].value
      this.searchItem.mchItems.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) {
          return -1
        } else if (a[sortKey] > b[sortKey]) {
          return 1
        }
        return 0
      })
      this.confirmed({
        mainTitle: this.title.array[this.title.mainIdx].value,
        subTitle: this.title.array[this.title.subIdx].value
      })
    },
    async onCompaniesExport() {
      const url = "/population-statistics/api/v1/companies/export/excel"
      const data = await utils.reqBackend(axios.post(url, {
        fileName: this.company.exports.fileName,
        cmpIds: this.searchItem.mchItems.map(item => item.id)
      }))
      Toast({
        message: "导出Excel成功！",
        iconClass: "iconfont icon-select-bold fs-50"
      })
      window.location.href = data
      this.confirmed()
    },
    onBthGenHssClicked() {
      if (!this.house.bthGenHss.pre.length
      || !this.house.bthGenHss.begRoom.length
      || !this.house.bthGenHss.endRoom.length) {
        MessageBox("错误", "地址前缀、开始室号或结束室号不能为空！")
        return
      }
      const nBegRm = parseInt(this.house.bthGenHss.begRoom)
      const nEndRm = parseInt(this.house.bthGenHss.endRoom)
      if (nBegRm > nEndRm) {
        MessageBox("错误", "开始室号不能大于结束室号！")
        return
      }
      MessageBox.confirm(`确定批量生成：${
        this.house.bthGenHss.pre
      }${
        this.house.bthGenHss.begRoom
      }~${
        this.house.bthGenHss.endRoom
      }室`).then(async action => {
        if (action !== "confirm") {
          return
        }
        Indicator.open("加载中...")
        for (let room = nBegRm; room <= nEndRm; ++room) {
          await axios.post("/population-statistics/mdl/v1/company", utils.copyCompany({
            address: `${this.house.bthGenHss.pre}${room}室`
          }))
        }
        Indicator.close()
        Toast({
          message: "批量生成房屋成功！",
          iconClass: "iconfont icon-select-bold fs-50"
        })
        this.confirmed()
      }).catch(e => {})
    },
    async onPeopleExport() {
      let columns = []
      for (const [key, value] of Object.entries(this.person.exports.columns)) {
        if (value) {
          columns.push(key)
        }
      }
      const url = "/population-statistics/api/v1/people/export/excel"
      const data = await utils.reqBackend(axios.post(url, {
        fileName: this.person.exports.fileName,
        psnIds: this.searchItem.mchItems.map(item => item.id),
        columns, addCols: this.person.exports.addCols
      }))
      Toast({
        message: "导出Excel成功！",
        iconClass: "iconfont icon-select-bold fs-50"
      })
      window.location.href = data
      this.confirmed()
    },
    onSortClicked() {
      this.sort.index = this.sort.index < this.sort.array.length - 1 ? this.sort.index + 1 : 0
    },
    onAddNewColClicked() {
      this.person.exports.addCols.push(this.person.exports.addCol)
      this.person.exports.addCol = ""
    },
    onDelColClicked(column) {
      // _.pull(this.person.exports.addCols, column)
      const colIdx = this.person.exports.addCols.indexOf(column)
      this.person.exports.addCols = this.person.exports.addCols
        .slice(0, colIdx).concat(this.person.exports.addCols.slice(colIdx + 1))
    }
  }
}
</script>
