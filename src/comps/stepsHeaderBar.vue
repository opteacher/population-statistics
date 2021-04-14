<template>
  <ul class="triangle_step list-unstyled">
    <li :class="{cur:active>=index}" v-for="(item,index) in stepArr" :key="index" :style="{width:width}">
      <span>{{item}}</span>
      <div v-if="index<stepArr.length-1" :class="active>=index?'jiaoActive':'jiao'"></div>
      <div class="interval"></div>
    </li>
  </ul>
</template>

<script>
export default{
  props:{
    active:{
      default:0
    },
    stepArr:{
      default:[]
    },
    width:{
      default:'100%'
    }
  },
  watch:{
    active(a){
      if(a<=0){
        this.$emit('update:active',0)
        console.log('已经是最小值了'+a)
      }
      if(a>this.stepArr.length-1){
        this.$emit('update:active',this.stepArr.length-1)
        console.log('已经是最大值了'+a)
      }
    }
  },
  data(){
    return{

    }
  }
}
</script>

<style scoped lang="scss">
.triangle_step{
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
  overflow-x: hidden;

  li{
    height: 40px;
    background: #d7d8da;
    color:#666;
    text-align: center;
    line-height: 40px;
    /*width: 20%;*/
    /*flex-basis: 100%;*/
    position: relative;
  }
  li.cur{
    background: #26a2ff;
    color:#fff;
  }
  /*三角形绘制*/
  .jiao{
    width: 0;
    height: 0;
    border-top: 20px solid transparent;/*高度一半*/
    border-left: 10px solid #d7d8da; /*调整宽度*/
    border-bottom: 20px solid transparent;/*高度一半*/
    position: absolute;
    right:-10px;/*跟宽度保持一致*/
    top:0;
    z-index: 1000;
  }
  .jiaoActive{
    width: 0;
    height: 0;
    border-top: 20px solid transparent;/*高度一半*/
    border-left: 10px solid #26a2ff; /*调整宽度*/
    border-bottom: 20px solid transparent;/*高度一半*/
    position: absolute;
    right:-10px;/*跟宽度保持一致*/
    top:0;
    z-index: 2;
  }
  /*大3个px的边 26-20/2*/
  .interval{
    width: 0;
    height: 0;
    border-top: 26px solid transparent;/*高度一半*/
    border-left: 13px solid #fff; /*调整宽度*/
    border-bottom: 26px solid transparent;/*高度一半*/
    position: absolute;
    right:-13px;/*跟宽度保持一致*/
    top:-6px;
    z-index: 1;
  }
}
</style>