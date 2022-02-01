<template>
  <div class="scroll-panel" style="top: 49px; bottom: 55px">
    <div>
      <mt-cell class="mint-field" title="单位照片">
        <upload-image name="Pictures" :maxNum="10" v-model="form.pictures"/>
      </mt-cell>
      <mt-cell class="mint-field" title="营业执照">
        <upload-image name="License" v-model="form.license"/>
      </mt-cell>
      <mt-field label="单位注册名称" placeholder="请输入营业执照上的全称" v-model="form.name"/>
      <mt-field label="店名称" placeholder="请输入招牌名称" v-model="form.shopName"/>
      <popup-field title="类型" :form="form" pname="type" :bottom="55" :values="[
        '企业公司', '金融证券', '餐饮', '美容美发', '医疗机构', '健身房', '教育培训', '宾旅馆', '中介', '养身按摩', '便利超市', '其他'
      ]"/>
      <mt-field label="注册编号" placeholder="请输入注册编号" v-model="form.regId"/>
      <mt-field label="地址" placeholder="请输入所在地址" v-model="form.address"/>
      <mt-field label="占地面积" placeholder="请输入占地面积" v-model="form.area" type="number"/>
      <mt-field label="法人姓名" placeholder="请输入法人姓名" v-model="form.lglName"/>
      <mt-field label="法人身份证" placeholder="请输入法人身份证" v-model="form.lglId"/>
      <mt-field label="法人手机号" placeholder="请输入法人手机号" type="tel" v-model="form.lglPhone"/>
      <popup-field title="营业时间" :form="form" pname="openHours" :bottom="55" :values="[times, times]"/>
      <mt-cell title="状态" class="mint-field">
        <mt-switch v-model="form.isClosed" style="color: grey">{{form.isClosed ? "已停业" : "营业中"}}</mt-switch>
      </mt-cell>
      <mt-field label="备注" placeholder="请输入备注" type="textarea" rows="4" v-model="form.remarks"/>
    </div>
    <mt-cell title="消防安全" :value="!showFirefight ? '展开' : '收起'" is-link @click.native="showFirefight = !showFirefight"
        data-target="#fireFightList" data-toggle="collapse" aria-expanded="false" aria-controls="fireFightList"/>
    <div class="collapse mt-3" id="fireFightList">
      <mt-cell title="居住情况" class="mint-field">
        <mt-switch v-model="form.fireFgtTagsMap['店住人']" style="color: grey">
          {{form.fireFgtTagsMap['店住人'] ? "有人居住" : "无人居住"}}
        </mt-switch>
      </mt-cell>
      <mt-cell title="沿街情况" class="mint-field">
        <mt-switch v-model="form.fireFgtTagsMap['沿街']" style="color: grey">
          {{form.fireFgtTagsMap['沿街'] ? "沿街" : "不沿街"}}
        </mt-switch>
      </mt-cell>
      <mt-cell title="仓储情况" class="mint-field">
        <mt-switch v-model="form.fireFgtTagsMap['有仓库']" style="color: grey">
          {{form.fireFgtTagsMap['有仓库'] ? "有仓库" : "无仓库"}}
        </mt-switch>
      </mt-cell>
      <mt-cell title="明火情况" class="mint-field">
        <mt-switch v-model="form.fireFgtTagsMap['用明火']" style="color: grey">
          {{form.fireFgtTagsMap['用明火'] ? "用明火" : "不用明火"}}
        </mt-switch>
      </mt-cell>
      <mt-cell title="高层/地下情况" class="mint-field">
        <mt-switch v-model="form.fireFgtTagsMap['高层/地下室']" style="color: grey">
          {{form.fireFgtTagsMap['高层/地下室'] ? "高层/地下室" : "非高层/非地下室"}}
        </mt-switch>
      </mt-cell>
    </div>
    <mt-cell title="治安安全" :value="!showSecurity ? '展开' : '收起'" is-link @click.native="showSecurity = !showSecurity"
      data-target="#securityList" data-toggle="collapse" aria-expanded="false" aria-controls="securityList"/>
    <div class="collapse mt-3" id="securityList">
      <mt-cell title="销售酒类" class="mint-field">
        <mt-switch v-model="form.pbcSecuTagsMap['销售酒类']" style="color: grey">
          {{form.pbcSecuTagsMap['销售酒类'] ? "销售" : "不销售"}}
        </mt-switch>
      </mt-cell>
      <mt-cell title="存在可疑行径" class="mint-field">
        <mt-switch v-model="form.pbcSecuTagsMap['可疑行径']" style="color: grey">
          {{form.pbcSecuTagsMap['可疑行径'] ? "可疑" : "不可疑"}}
        </mt-switch>
      </mt-cell>
    </div>
    <div class="w-100">
      <mt-button class="mlr-1pc mtb-1pc" :disabled="formSubmit" style="width: 98vw" type="primary" @click.prevent="onSubmitClick">提交</mt-button>
    </div>
  </div>
</template>

<script>
import * as utils from '../utils.js'
import { Toast } from 'mint-ui'
import popupField from './popupField'
import uploadImage from './uploadImage'

export default {
  components: {
    'popup-field': popupField,
    'upload-image': uploadImage
  },
  data() {
    return {
      form: {
        name: '',
        shopName: '',
        type: '',
        regId: '',
        address: '',
        area: 0,
        lglName: '',
        lglId: '',
        lglPhone: '',
        openHours: '',
        isClosed: false,
        fireFgtTags: '',
        pbcSecuTags: '',
        remarks: '',
        pictures: [],
        license: []
      },
      formSubmit: false,
      times: [],
      showFirefight: false,
      showSecurity: false
    }
  },
  created() {
    for (let i = 0; i <= 23; ++i) {
      let hour = i.toString().padStart(2, '0')
      this.times.push(`${hour}:00`)
      this.times.push(`${hour}:30`)
    }
    this.form = utils.copyCompany(this.$route.query || {})
  },
  methods: {
    async onSubmitClick() {
      this.formSubmit = true
      let fireFgtTagsSet = []
      for (const [key, value] of Object.entries(this.form.fireFgtTagsMap)) {
        if (value) {
          fireFgtTagsSet.push(key)
        }
      }
      this.form.fireFgtTags = fireFgtTagsSet.join(',')
      let pbcSecuTagsSet = []
      for (const [key, value] of Object.entries(this.form.pbcSecuTagsMap)) {
        if (value) {
          pbcSecuTagsSet.push(key)
        }
      }
      this.form.pbcSecuTags = pbcSecuTagsSet.join(',')
      this.form.pictures = this.form.pictures.join(',')
      this.form.license = this.form.license.join(',')
      await utils.reqBackend(this.form.id ?
        axios.put(`/population-statistics/mdl/v1/company/${this.form.id}`, this.form) :
        axios.post('/population-statistics/mdl/v1/company', this.form))
      Toast({
        message: '提交成功！',
        iconClass: 'iconfont icon-select-bold fs-50'
      })
      this.$router.push({path: `/list?type=${this.form.shopName ? 'company' : 'house'}`})
    }
  }
}
</script>
