<template>
  <el-card
    class="box-card"
    :style="{ left: x + 'px', top: y + 'px' }"
    @click.stop=""
    style="padding: 0; width: 250px;"
  >
    <div style="font-size:12px;">
         <el-button @click="callBack('edit')">打开编辑器</el-button>
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
    };
  },
  mounted() {},
  methods: {
    initFn(x, y, item) {
      this.x = parseInt(x) + "";
      this.y = y + "";
      if (item) {
        this.item = item.item;
      }
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
