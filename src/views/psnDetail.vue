<template>
  <div>
    <mt-header title="人员详情">
      <mt-button icon="back" slot="left" @click="onBackClick">返回</mt-button>
    </mt-header>
    <div
      class="scroll-panel"
      :style="'top: 40px;' + (uneditable ? 'bottom: 50px' : 'bottom: 106px')"
    >
      <mt-swipe v-if="person.pictures" :auto="0" style="height: 200px">
        <mt-swipe-item v-for="(picture, index) in person.pictures" :key="index">
          <img :src="picture" style="width: 100%; height: 200px" />
        </mt-swipe-item>
      </mt-swipe>
      <mt-cell title="姓名" :value="person.name" />
      <mt-cell
        title="身份证"
        :value="person.idCard"
        :is-link="person.idPicture.length !== 0"
        data-target="#psnIdPic"
        data-toggle="collapse"
        aria-expanded="false"
        aria-controls="psnIdPic"
      />
      <div v-if="person.idPicture" class="collapse" id="psnIdPic">
        <img :src="person.idPicture" style="width: 100%; height: auto" />
      </div>
      <mt-cell v-if="person.gender" title="性别" :value="person.gender" />
      <mt-cell v-if="person.nation" title="民族" :value="person.nation" />
      <mt-cell title="手机号" :value="person.phone" />
      <mt-cell title="户籍地址" :value="person.hhAddress" />
      <mt-cell title="居住地址" :value="person.lvAddress" />
      <mt-cell title="有无居住证" :value="person.hasLvCard ? '有' : '无'" />
      <mt-cell
        v-if="person.company && person.company !== 'null'"
        title="所在单位"
        :value="person.company"
      />
      <mt-field
        v-if="person.remarks && !uneditable"
        label="备注"
        readonly
        disabled
        type="textarea"
        rows="1"
        v-model="person.remarks"
      />
      <mt-cell title="特殊标签" v-if="person.specTags">
        <mt-badge
          v-for="spec in person.specTags"
          :key="spec"
          class="mr-1pc"
          size="small"
          :type="specColrMap[spec]"
          >{{ spec }}</mt-badge
        >
      </mt-cell>
    </div>
    <div
      v-if="uneditable"
      class="w-100 fixed-bottom mtb-1pc mlr-1pc"
      style="background-color: white"
    >
      <mt-button class="w-98" type="primary" @click="report.showTopPopup = true"
        >信息有误？提醒管理员</mt-button
      >
    </div>
    <div
      v-else
      class="w-100 fixed-bottom mb-55"
      style="background-color: white"
    >
      <mt-button class="bottom-half-btn" type="primary" @click="onUpdateClick"
        >编辑</mt-button
      >
      <mt-button class="bottom-half-btn" type="danger" @click="onDeleteClick"
        >删除</mt-button
      >
    </div>
    <btm-navi-bar v-if="!uneditable" select="person" />
    <mt-popup class="w-100" v-model="report.showTopPopup" position="top">
      <mt-picker
        :slots="report.slots"
        :visible-item-count="3"
        :show-toolbar="false"
        @change="onReportChanged"
      />
      <div>
        <mt-field
          label="补充说明"
          placeholder="请输入补充说明（可选）"
          v-model="report.form.desc"
        />
      </div>
      <mt-button class="w-100 br-0" type="primary" @click="onReportSubmit"
        >确认</mt-button
      >
    </mt-popup>
  </div>
</template>

<script>
import btmNaviBar from '../components/btmNaviBar.vue'
import { MessageBox, Toast } from 'mint-ui'
import * as utils from '../utils.js'
import cookies from '../cookies.js'

export default {
  components: {
    'btm-navi-bar': btmNaviBar,
  },
  data() {
    return {
      person: {
        idPicURL: '',
        picURLs: [],
      },
      uneditable: false,
      specColrMap: utils.specColrMap,
      report: {
        showTopPopup: false,
        slots: [
          {
            flex: 1,
            values: [
              '姓名',
              '身份证',
              '性别',
              '民族',
              '手机号',
              '户籍地址',
              '居住地址',
            ],
            textAlign: 'right',
          },
          {
            divider: true,
            content: '-',
          },
          {
            flex: 1,
            values: ['变更', '错误', '缺失'],
            textAlign: 'left',
          },
        ],
        form: {
          type: '',
          relId: -1,
          name: '',
          props: '',
          desc: '',
          submit: '',
          sbtPhone: '',
          solved: false,
        },
      },
    }
  },
  async created() {
    if (this.$route.query.uneditable) {
      this.uneditable = JSON.parse(this.$route.query.uneditable)
    }
    this.person = utils.copyPerson(this.$route.query)
  },
  async mounted() {
    if (this.uneditable) {
      // 身份校验
      const url = '/population-statistics/api/v1/person/sign/stat'
      const data = await utils.reqBackend(
        axios.get(url, {
          headers: { authorization: cookies.get('personTkn') },
        }),
        (res) => {
          if (!res.data.data) {
            Toast({
              message: res.data.message,
              iconClass: 'iconfont icon-close-bold fs-50',
            })
            this.$router.push({ path: '/valid' })
          }
        }
      )
      if (!data) {
        return
      }
    }
  },
  methods: {
    onUpdateClick() {
      this.$router.push({
        path: `/input?tab=person&${new URLSearchParams(
          this.person
        ).toString()}`,
      })
    },
    onDeleteClick() {
      MessageBox({
        title: '提示',
        message: '确定执行此操作?',
        showCancelButton: true,
      }).then(async (action) => {
        if (action !== 'confirm') {
          return
        }
        const res = await utils.reqBackend(
          axios.delete(`/population-statistics/mdl/v1/person/${this.person.id}`)
        )
        Toast({
          message: '删除成功！',
          iconClass: 'iconfont icon-select-bold fs-50',
        })
        this.$router.go(-1)
      })
    },
    onReportSubmit() {
      this.report.showTopPopup = false
      MessageBox({
        title: '提示',
        message: '确定上报信息更新？管理员收到此记录会对您的个人信息进行核实',
        showCancelButton: true,
      }).then(async (action) => {
        if (action !== 'confirm') {
          return
        }
        this.report.form.type = '人员'
        this.report.form.relId = parseInt(this.person.id)
        this.report.form.name = this.person.name
        this.report.form.submit = this.$route.query.submit
        this.report.form.sbtPhone = this.$route.query.sbtPhone
        if (
          await utils.reqBackend(
            axios.post('/population-statistics/mdl/v1/report', this.report.form)
          )
        ) {
          Toast({
            message:
              '提交成功！感谢您上报的信息更新，稍后管理员会对您提交的信息进行确认',
            iconClass: 'iconfont icon-select-bold fs-50',
          })
        }
      })
    },
    onReportChanged() {
      this.report.form.props = `${arguments[1][0]}.${arguments[1][1]}`
    },
    onBackClick() {
      if (this.$route.query.scroll) {
        utils.eventBus.$emit('scroll', this.$route.query.scroll)
      }
      this.$router.go(-1)
    },
  },
}
</script>
