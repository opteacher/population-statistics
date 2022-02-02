<template>
<div class="mtb-10" style="max-width: 210px">
  <a
    v-for="url in images"
    :key="url" href="#"
    style="width: 64px"
    @click="vwImgURL = url"
  >
    <img :src="url" style="width: 64px; height: 64px"/>
  </a>
  <mt-popup
    class="w-100 center-container"
    :value="vwImgURL.length !== 0"
    position="right"
    :modal="false"
  >
    <div style="position: fixed; top: 10px; right: 10px">
      <a href="#" @click="vwImgURL = ''">
        <svg
          slot="icon" class="icon"
          aria-hidden="true"
          style="width: 2.5em; height: 2.5em"
        >
          <use xlink:href="#icon-error"/>
        </svg>
      </a>
    </div>
    <img
      v-if="vwImgURL.length"
      :src="vwImgURL"
      style="width: 100%; height: auto"
    />
    <div style="position: fixed; bottom: 10px; left: 0px; right: 0px">
      <mt-button class="bottom-half-btn" type="primary" @click="onDnldClicked">
        <svg
          slot="icon" class="icon"
          aria-hidden="true"
        >
          <use xlink:href="#icon-download"/>
        </svg>下载
      </mt-button>
      <mt-button class="bottom-half-btn" type="danger" @click="onDelImgClicked">
        <svg
          slot="icon" class="icon"
          aria-hidden="true"
        >
          <use xlink:href="#icon-ashbin"/>
        </svg>删除
      </mt-button>
    </div>
  </mt-popup>
  <mt-button v-if="images.length < maxNum" :style="{
    width: '64px',
    height: '64px',
    'box-shadow': 'none',
    'border-radius': 0
  }" @click="onUpldImgClicked">
    <svg slot="icon" class="icon" aria-hidden="true">
      <use xlink:href="#icon-add-bold"/>
    </svg>
  </mt-button>
  <input
    :id="elId"
    v-show="false"
    type="file"
    accept="image/*"
    @change="onUpldImgChanged"
  />
</div>
</template>

<script>
import { reqBackend } from '../utils.js'
import $ from 'jquery'
import { MessageBox } from 'mint-ui'

export default {
  props: {
    value: { type: Array, required: true },
    name: { type: String, required: true },
    maxNum: { type: Number, default: 1 }
  },
  computed: {
    elId: function () {
      return 'iptUpload' + this.name
    }
  },
  data () {
    return {
      images: [],
      vwImgURL: ''
    }
  },
  watch: {
    vwImgURL: function () {
      if (this.vwImgURL.length) {
        $('.mint-tabbar').hide()
      } else {
        $('.mint-tabbar').show()
      }
    }
  },
  created() {
    $('.mint-tabbar').hide()
  },
  methods: {
    cvtBase64UrlToBlob (base64) {
      const array = base64.split(',')
      const mime = array[0].match(/:(.*?);/)[1]
      const decStr = window.atob(array[1])
      const decLen = decStr.length
      const u8Arr = new Uint8Array(decLen)
      for (let i = decLen; i >= 0; --i) {
        u8Arr[i] = decStr.charCodeAt(i)
      }
      return new Blob([u8Arr], { type: mime })
    },
    async compressImg (imgFile, options) {
      if((imgFile.size >> 10) <= 1025) {
        return imgFile
      }
      let width = options.width
      let height = options.height
      const quality = options.quality || 0.7
      if (!options.imgCvs) {
        options.imgCvs = {}
        const reader = new FileReader()
        reader.readAsDataURL(imgFile)
        const result = await new Promise((res) => {
          reader.onload = function () {
            res(this.result)
          }
        })
        const image = new Image()
        image.src = result
        options.imgEle = await new Promise((res) => {
          image.onload = function () { res(this) }
        })
        width = !width ? options.imgEle.width : width
        height = !height ? options.imgEle.height : height
        options.canvas = document.createElement('canvas')
        options.canvas.setAttribute('width', width)
        options.canvas.setAttribute('height', height)
      }
      const context = options.canvas.getContext('2d')
      context.drawImage(options.imgEle, 0, 0, width, height)
      const base64 = options.canvas.toDataURL('image/jpeg', quality)
      const blob = this.cvtBase64UrlToBlob(base64)
      return this.compressImg(blob, Object.assign(options, {
        quality: quality * 0.5
      }))
    },
    async onUpldImgChanged (e) {
      if (!e.target.files.length) {
        return
      }
      const file = await this.compressImg(e.target.files[0], { quality: 0.2 })
      const upldURL = '/population-statistics/api/v1/image'
      const fbody = new FormData()
      fbody.append('file', file)
      const result = await reqBackend(axios.post(upldURL, fbody, {
        'Content-Type': 'multipart/form-data'
      }))
      if (!result.url) {
        return
      }
      const imgURL = result.url
      this.images.push(imgURL)
      this.value.push(imgURL)
    },
    onUpldImgClicked () {
      document.getElementById(this.elId).click()
    },
    onDelImgClicked () {
      MessageBox.confirm('确定删除该图片吗？', '警告').then(async action => {
        if (action === 'confirm') {
          this.$emit('delete', this.vwImgURL)
          this.images.splice(this.images.indexOf(this.vwImgURL), 1)
          this.value.splice(this.images.indexOf(this.vwImgURL), 1)
          this.vwImgURL = ''
        }
      }).catch(() => {})
    },
    onDnldClicked () {
      window.location.href = this.vwImgURL
    }
  }
}
</script>

