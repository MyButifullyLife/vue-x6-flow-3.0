<template>
  <el-card
    class="box-card"
    :style="{ left: x + 'px', top: y + 'px' }"
    @click.stop=""
    style="padding: 0; width: 250px;"
  >
    <div style="font-size:12px;">
         <h5 >connector</h5>
         <div>
           <span style="margin-right: 6px;" v-for="item in connectorData" :class="{'active': item === connector}"     :key="item" @click="connectFn(item)"> {{item}}</span>
         </div>
        <h5>router</h5>
        <div>
          <span   style="margin-right: 6px;" v-for="item in routerData"  :class="{'active': item === router}"  :key="item" @click="routerFn(item)"> {{item}}</span>
        </div>

      <h5>label</h5>
       <el-input placeholder="线条名字" v-model="label" @input="labelFn"></el-input>

      <h5>参数</h5>
      <el-input placeholder="线条名字" v-model="propsData" @input="propsFn"></el-input>
    </div>

  </el-card>
</template>

<script>
export default {
  name: "MenuBar",
  data() {
    return {
      x: "",
      y: "",
      item: {},
      label: '',
      connector: '',
      router: '',
      propsData: '',
      connectorData: [
        'rounded',
         'normal',
        'smooth',
        'jumpover'
      ],
      routerData: [
       'orth',
       'normal',
       'oneSide',
       'manhattan',
       'metro',
       'er'
      ]
    };
  },
  mounted() {},
  methods: {
    connectFn(data){
      this.connector = data
      this.item.item.setConnector(data)
    },
    routerFn(data){
      this.router = data
      this.item.item.setRouter(data)
    },
    propsFn(){
      this.item.item.data.props = this.propsData
    },
    labelFn(){
      this.item.item.setLabels(this.label)
    },
    initFn(x, y, item) {
      this.x = parseInt(x) + "";
      this.y = y + "";

      if (item) {
        this.item = item;
        console.log(this.item.item)
        const label = item.item.getLabels()
        this.label = label[0] ? label[0].attrs.label.text : ''
        this.connector = item.item.getConnector() ? item.item.getConnector().name: ''
        this.router = item.item.getRouter() ? item.item.getRouter().name :''
        this.propsData =  this.item.item.data? this.item.item.data.props : ''
      }
    },
    setItem(item) {
      this.item = item;
    },
    callBack(type) {
      this.$emit("callBack", type, this.item);
    },
  },
};
</script>
<style  lang="less" scoped>
  .active{
    color: #38c7f8;
  }
.box-card {
  position: absolute;
  width: 260px;
  z-index: 112;
}

.box-card ::v-deep .el-card__body {
  padding: 0;
}

.text {
  font-size: 14px;
}

.item {
  padding: 10px 0;
  text-align: center;
}

.item:hover {
  color: #ffffff;
  background-color: #409eff;
}

.box-card {
  width: 150px;
}
</style>
