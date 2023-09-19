<template>
  <div class="node" @dblclick="showInput = true" @mouseleave="showInput = false">
    <div ref="content">
      <el-input
        @click.stop=""
        v-if="showInput"
        v-model="label"
        @blur="changeName"
        @keydown.enter="changeName"
      ></el-input>
      <span class="label" v-else>{{ label }}</span>

      <h5 v-if="region">{{region}}</h5>
    </div>
  </div>
</template>

<script>
  import { $Bus } from '@/global.js';
  export default {
    name: 'DatabaseCom',

    inject: ['getGraph', 'getNode'],
    data() {
      return {
        status: 'logo',
        label: '',
        node: '',
        showInput: false,
        region: ''
      };
    },
    methods: {
      changeName() {
        this.node.data.props.name = this.label;
        this.showInput = false;
      },
      watchNode() {
        // 监听数据改变事件
        const self = this;
        const node = this.getNode();
        this.node = node;
        this.label = node.data.props.name;
        this.region = node.data.props.region;
        node.on('change:data', ({ current }) => {
          self.label = current.props.name;
          self.region = current.props.region;

          this.$nextTick(() => {
            const { height } = this.$refs.content.getBoundingClientRect();
            // 如果高度更改，重新布局
            if (height !== current.height) {
              $Bus.$Bus.emit('nodeHeightChange', { id: self.node.id, height: height });
            }
          });
        });
      },
    },
    mounted() {
      this.watchNode.bind(this);
      this.watchNode();
      this.changeName.bind(this);
    },
  };
</script>
<style xml:lang="scss" scoped>
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
