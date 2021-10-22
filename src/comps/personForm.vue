<template>
  <div class="scroll-panel" style="top: 49px; bottom: 55px">
    <div>
      <mt-cell class="mint-field" title="头像">
        <upload-image name="Pictures" v-model="form.pictures" :maxNum="3"/>
      </mt-cell>
      <mt-cell class="mint-field" title="身份证照片">
        <upload-image name="IdPicture" v-model="form.idPicture"/>
      </mt-cell>
      <mt-field label="姓名" placeholder="请输入真实姓名" v-model="form.name"/>
      <id-card-field :form="form"/>
      <gender-field :form="form"/>
      <nation-field :form="form" :bottom="55"/>
      <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="form.phone"/>
      <mt-field label="户籍地址" placeholder="请输入户籍地址" v-model="form.hhAddress"/>
      <mt-field label="居住地址" placeholder="请输入居住地址" v-model="form.lvAddress"/>
      <mt-cell class="mint-field" title="有无居住证">
        <mt-switch v-model="form.hasLvCard" style="color: grey">{{form.hasLvCard ? "有" : "无"}}</mt-switch>
      </mt-cell>
      <mt-cell class="mint-field" title="所在单位"
        is-link :to="`/population-statistics/list?type=company&mode=select&${(new URLSearchParams(form)).toString()}`">
        <span style="color: gray">{{form.company || "请选择所在单位"}}</span>
      </mt-cell>
      <mt-field label="备注" placeholder="请输入备注" type="textarea" rows="4" v-model="form.remarks"/>
      <mt-cell title="特殊" :value="!showSpecial ? '展开' : '收起'" is-link @click.native="showSpecial = !showSpecial"
        data-target="#specialList" data-toggle="collapse" aria-expanded="false" aria-controls="specialList"/>
    </div>
    <div class="collapse mt-3" id="specialList">
      <mt-cell title="独居老人" class="mint-field">
        <mt-switch style="color: grey" v-model="form.specTagsMap['独居老人']">
          {{form.specTagsMap['独居老人'] ? "是" : "否"}}
        </mt-switch>
      </mt-cell>
      <mt-cell title="孕妇" class="mint-field">
        <mt-switch style="color: grey" v-model="form.specTagsMap['孕妇']">
          {{form.specTagsMap['孕妇'] ? "是" : "否"}}
        </mt-switch>
      </mt-cell>
      <mt-cell title="患精神疾病" class="mint-field">
        <mt-switch style="color: grey" v-model="form.specTagsMap['患精神疾病']">
          {{form.specTagsMap['患精神疾病'] ? "是" : "否"}}
        </mt-switch>
      </mt-cell>
      <mt-cell title="生理残疾" class="mint-field">
        <mt-switch style="color: grey" v-model="form.specTagsMap['生理残疾人']">
          {{form.specTagsMap['生理残疾人'] ? "是" : "否"}}
        </mt-switch>
      </mt-cell>
      <mt-cell title="可疑" class="mint-field">
        <mt-switch style="color: grey" v-model="form.specTagsMap['行径可疑']">
          {{form.specTagsMap['行径可疑'] ? "是" : "否"}}
        </mt-switch>
      </mt-cell>
    </div>
    <div class="w-100">
      <mt-button class="mlr-1pc mtb-1pc" :disabled="formSubmit" type="primary" style="width: 98vw" @click.prevent="onSubmitClick">提交</mt-button>
      <mt-button class="mlr-1pc mtb-1pc" :disabled="batchLoad" style="width: 98vw; display: none" type="default" @click.prevent="onBatchLoad">批量导入</mt-button>
    </div>
  </div>
</template>

<script>
import idCardField from "./idCardField"
import nationField from "./nationField"
import genderField from "./genderField"
import uploadImage from "./uploadImage"
import utils from "../utils"
import { Toast } from "mint-ui"
import "url"

export default {
  components: {
    "id-card-field": idCardField,
    "nation-field": nationField,
    "gender-field": genderField,
    'upload-image': uploadImage
  },
  data() {
    return {
      form: {},
      specTags: {},
      URLSearchParams,
      formSubmit: false,
      showSpecial: false,
      batchLoad: false,
    }
  },
  created() {
    this.form = utils.copyPerson(this.$route.query || {})
  },
  methods: {
    async onSubmitClick() {
      this.formSubmit = true
      let specTagsSet = []
      for (const [key, value] of Object.entries(this.form.specTagsMap)) {
        if (value) {
          specTagsSet.push(key)
        }
      }
      this.form.specTags = specTagsSet.join(",")
      this.form.pictures = this.form.pictures.join(',')
      this.form.idPicture = this.form.idPicture.join(',')
      await utils.reqBackend(this.form.id ?
        axios.put(`/population-statistics/mdl/v1/person/${this.form.id}`, this.form) :
        axios.post("/population-statistics/mdl/v1/person", this.form))
      Toast({
        message: "提交成功！",
        iconClass: "iconfont icon-select-bold fs-50"
      })
      this._clearForm()
      this.formSubmit = false
      this.$router.go(-1)
    },
    async onBatchLoad () {
      this.batchLoad = true
      const url = "/population-statistics/api/v1/people/batch_load?" + [
        "name=姓名", "idCard=公民身份号码", "gender=性别", "nation=民族",
        "hhAddress=户籍地址", "lvAddress=居住地址"
      ].join("&")
      const resp = await utils.reqBackend(axios.post(url))
      console.log(resp)
      Toast({
        message: "提交成功！",
        iconClass: "iconfont icon-select-bold fs-50"
      })
      this.batchLoad = false
    }
  }
}
</script>
