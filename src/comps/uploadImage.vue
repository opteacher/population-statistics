<template>
<div class="mtb-10" style="max-width: 210px">
  <a
    v-for="(img, idx) in images"
    :key="img" href="#"
    style="width: 64px"
    @click="viewIdx = idx"
  >
    <img :src="img.url" style="width: 64px; height: 64px"/>
  </a>
  <mt-popup
    class="w-100 center-container"
    :value="viewIdx !== -1"
    position="right"
    :modal="false"
  >
    <div style="position: fixed; top: 10px; right: 10px">
      <a href="#" @click="viewIdx = -1">
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
      v-if="viewIdx !== -1"
      :src="images[viewIdx].url"
      style="width: 100%; height: auto"
    />
    <div style="position: fixed; bottom: 10px; left: 10px; right: 10px">
      <mt-button class="w-100" type="danger" @click="onDelImgClicked">
        <svg
          slot="icon" class="icon"
          aria-hidden="true"
        >
          <use xlink:href="#icon-ashbin"/>
        </svg>
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
import { reqBackend } from '../utils'
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
      viewIdx: -1
    }
  },
  watch: {
    viewIdx: function () {
      if (this.viewIdx !== -1) {
        $('.mint-tabbar').hide()
      } else {
        $('.mint-tabbar').show()
      }
    }
  },
  async created () {
    const urlPrfx = '/population-statistics/mdl/v1/image'
    this.images = (await Promise.all(this.value.map(imgId => {
      return reqBackend(axios.get(`${urlPrfx}/${imgId}`))
    }))).map(item => {
      return { id: item[0].id, url: item[0].url }
    })
  },
  methods: {
    async onUpldImgChanged (e) {
      if (!e.target.files.length) {
        return
      }
      const file = e.target.files[0]
      const upldURL = '/population-statistics/api/v1/image'
      const fbody = new FormData()
      fbody.append('file', file)
      const result = await reqBackend(axios.post(upldURL, fbody, {
        'Content-Type': 'multipart/form-data'
      }))
      if (!result) {
        return
      }
      this.images.push(result)
      this.value.push(result.id)
    },
    onUpldImgClicked () {
      document.getElementById(this.elId).click()
    },
    onDelImgClicked () {
      MessageBox.confirm('确定删除该图片吗？', '警告').then(async action => {
        if (action === 'confirm') {
          const delURL = `/population-statistics/mdl/v1/image/${
            this.images[this.viewIdx].id
          }`
          await reqBackend(axios.delete(delURL))
          this.images.splice(this.viewIdx, 1)
          this.value.splice(this.viewIdx, 1)
          this.viewIdx = -1
        }
      }).catch(() => {})
    }
  }
}
</script>

