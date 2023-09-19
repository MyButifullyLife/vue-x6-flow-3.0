<template>
  <div class="data-processing-dag-node" @mouseenter="onMainMouseEnter" @mouseleave="onMainMouseLeave">
    <div class="main-area">
      <div class="main-info">
        <i class="node-logo" :style="{ backgroundImage: `url(${NODE_TYPE_LOGO[type]})` }" />
        <div class="ellipsis-row node-name">{{name}}</div>
      </div>

      <div class="status-action">
        <template v-if="status === 'ERROR'">
          <i class="status-icon status-icon-error" />
        </template>
        <template v-else>
          <i class="status-icon status-icon-success" />
        </template>
        <div class="more-action-container">
          <i class="more-action" />
        </div>
      </div>
    </div>

      <div class="plus-dag">
        <el-dropdown popper-class="processing-node-menu">
          <el-icon class="icon"  style="background-color: #5F95FF">+ </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in PROCESSING_TYPE_LIST" @click.native="createDownstream(item.type)">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
  </div>
</template>

<script>
  import { $Bus } from '@/global.js';
  export default {
    name: 'Node',
    inject: ['getGraph', 'getNode'],
    data() {
      return {
        type: '',
        status: '',
        name:'',
         PROCESSING_TYPE_LIST :[
          {
            type: 'FILTER',
            name: '数据筛选',
          },
          {
            type: 'JOIN',
            name: '数据连接',
          },
          {
            type: 'UNION',
            name: '数据合并',
          },
          {
            type: 'AGG',
            name: '数据聚合',
          },

          {
            type: 'OUTPUT',
            name: '数据输出',
          },
        ],
        node: '',
        NODE_TYPE_LOGO: {
          INPUT:
            'https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*RXnuTpQ22xkAAAAAAAAAAAAADtOHAQ/original', // 数据输入
          FILTER:
            'https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*ZJ6qToit8P4AAAAAAAAAAAAADtOHAQ/original', // 数据筛选
          JOIN: 'https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*EHqyQoDeBvIAAAAAAAAAAAAADtOHAQ/original', // 数据连接
          UNION:
            'https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*k4eyRaXv8gsAAAAAAAAAAAAADtOHAQ/original', // 数据合并
          AGG: 'https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*TKG8R6nfYiAAAAAAAAAAAAAADtOHAQ/original', // 数据聚合
          OUTPUT:
            'https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*zUgORbGg1HIAAAAAAAAAAAAADtOHAQ/original', // 数据输出
        },
      };
    },
    mounted() {
      const methods = this.$options.methods;
      for (let key in methods) {
        methods[key].bind(this);
      }
      const self = this;

      const Node = this.node = this.getNode();

      this.name = Node.data.name;
      this.status = Node.data.status;
      this.type = Node.data.type;

      // 监听数据改变事件
      this.node.on('change:data', ({ current }) => {
        self.name = current.name;
        self.status = current.status;
        self.type = current.type;
      });
    },
    methods:{
      createDownstream (type) {
        $Bus.$Bus.emit('createNode',{type,node:this.node})
      },
      onMainMouseLeave () {
        // 获取该节点下的所有连接桩
        const ports = this.node.getPorts() || []
        ports.forEach((port) => {
          this.node.setPortProp(port.id, 'attrs/circle', {
            fill: 'transparent',
            stroke: 'transparent',
          })
        })
      },
      onMainMouseEnter ()  {
        // 获取该节点下的所有连接桩
        const ports = this.node.getPorts() || []
        ports.forEach((port) => {
          this.node.setPortProp(port.id, 'attrs/circle', {
            fill: '#fff',
            stroke: '#85A5FF',
          })
        })
      }
    }
  };
</script>
<style lang="less" scoped>
  .main-info{
  }
  .data-processing-dag-node {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .main-area {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 12px;
    width: 230px;
    height: 48px;
    color: rgba(0, 0, 0, 65%);
    font-size: 12px;
    font-family: PingFangSC;
    line-height: 24px;
    background-color: #fff;
    box-shadow: 0 -1px 4px 0 rgba(209, 209, 209, 50%), 1px 1px 4px 0 rgba(217, 217, 217, 50%);
    border-radius: 2px;
    border: 1px solid transparent;
  }
  .main-area:hover {
    border: 1px solid rgba(0, 0, 0, 10%);
    box-shadow: 0 -2px 4px 0 rgba(209, 209, 209, 50%), 2px 2px 4px 0 rgba(217, 217, 217, 50%);
  }

  .node-logo {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
  }

  .node-name {
    overflow: hidden;
    display: inline-block;
    width: 80px;
    margin-left: 6px;
    color: rgba(0, 0, 0, 65%);
    font-size: 12px;
    font-family: PingFangSC;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: top;
  }

  .status-action {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .status-icon {
    display: inline-block;
    width: 24px;
    height: 24px;
  }

  .status-icon-error {
    background: url('https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SEISQ6My-HoAAAAAAAAAAAAAARQnAQ')
      no-repeat center center / 100% 100%;
  }

  .status-icon-success {
    background: url('https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*6l60T6h8TTQAAAAAAAAAAAAAARQnAQ')
      no-repeat center center / 100% 100%;
  }

  .more-action-container {
    margin-left: 12px;
    width: 15px;
    height: 15px;
    text-align: center;
    cursor: pointer;
  }

  .more-action {
    display: inline-block;
    width: 3px;
    height: 15px;
    background: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*tFw7SIy-ttQAAAAAAAAAAAAADtOHAQ/original')
      no-repeat center center / 100% 100%;
  }

  .plus-dag {
    visibility: visible;
    position: relative;
    margin-left: 12px;
    height: 48px;
  }

  .plus-action {
    position: absolute;
    top: calc(50% - 8px);
    left: 0;
    width: 16px;
    height: 16px;
    background: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*ScX2R4ODfokAAAAAAAAAAAAADtOHAQ/original')
      no-repeat center center / 100% 100%;
    cursor: pointer;
  }
  .plus-action:hover {
    background-image: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*tRaoS5XhsuQAAAAAAAAAAAAADtOHAQ/original');
  }

  .plus-action:active,
  .plus-action-selected {
    background-image: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*k9cnSaSmlw4AAAAAAAAAAAAADtOHAQ/original');
  }

  .x6-node-selected .main-area {
    border-color: #3471f9;
  }

  .x6-node-selected .plus-dag {
    visibility: visible;
  }

  .processing-node-menu {
    padding: 2px 0;
    width: 105px;
    background-color: #fff;
    box-shadow: 0 9px 28px 8px rgba(0, 0, 0, 5%), 0 6px 16px 0 rgba(0, 0, 0, 8%),
      0 3px 6px -4px rgba(0, 0, 0, 12%);
    border-radius: 2px;

  }
  .processing-node-menu ul {
    margin: 0;
    padding: 0;
  }
  .processing-node-menu li {
    list-style: none;
  }

  .each-sub-menu {
    padding: 6px 12px;
    width: 100%;
  }

  .each-sub-menu:hover {
    background-color: rgba(0, 0, 0, 4%);
  }

  .each-sub-menu a {
    display: inline-block;
    width: 100%;
    height: 16px;
    font-family: PingFangSC;
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 65%);
  }

  .each-sub-menu span {
    margin-left: 8px;
    vertical-align: top;
  }

  .each-disabled-sub-menu a {
    cursor: not-allowed;
    color: rgba(0, 0, 0, 35%);
  }

  .node-mini-logo {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    vertical-align: top;
  }

  @keyframes running-line {
    to {
      stroke-dashoffset: -1000;
    }
  }
</style>
