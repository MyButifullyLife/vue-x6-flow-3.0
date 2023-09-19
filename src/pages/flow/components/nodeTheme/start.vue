<template>
  <div class="node" @dblclick="showInput = true"  @mouseleave="showInput = false">
    <el-input @click.stop=""  v-if="showInput" v-model="label"  @blur="changeName" @keydown.enter="changeName"></el-input>
    <span class="label" v-else>{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: "DatabaseCom",

  inject: ["getGraph", "getNode"],
  data() {
    return {
      status: "logo",
      label: "",
      node:'',
      showInput: false
    };
  },
  methods: {
     changeName(){
       this.node.data.props.name = this.label
       this.showInput = false
     },
  },
  mounted() {
    this.changeName.bind(this)

    const self = this;
    const node = this.getNode();
    this.node = node
    this.label =node.data.props.name;

  },
};
</script>
<style lang="less" scoped>
.node {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  box-shadow: 0px 1px 3px 3px rgb(245 245 245);
}

.node img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-left: 8px;
}

.node .label {
  display: inline-block;
  flex-shrink: 0;
  width: 104px;
  margin-left: 8px;
  color: #666;
  font-size: 12px;
}


</style>
