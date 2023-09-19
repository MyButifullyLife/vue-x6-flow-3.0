<template>
  <div id="coverCot" style="width: 100vw; height: 100vh; overflow: hidden">
    <section class="section-cot" style="width: 100%; height: 100%">
      <div id="container" @click.stop="hideFn">
        <lineMenu v-if="showContextMenu" ref="lineMenu" @callBack="contextMenuFn" />
        <nodeMenu v-if="nodeMenuShow" ref="nodeMenu" @callBack="nodeMenuCallBack" />
        <header>
<!--          布局-->
          <el-icon class="icon"><Share @click="layoutFn()" /></el-icon>

          <el-icon class="icon"><Menu @click="showDrawerFn()" /></el-icon>
          <el-icon class="icon"><Plus @click="zoomFn(0.2)" /></el-icon>
          <el-icon class="icon"><Minus @click="zoomFn(-0.2)" /></el-icon>
          <el-icon class="icon"><Position @click="centerFn" /></el-icon>
          <el-icon class="icon"><UploadFilled @click="saveFn()" /></el-icon>
          <el-icon class="icon"><Loading @click="loadFn()" /></el-icon>
        </header>
        <div ref="graphContainer" class="graphContainer" />
        <Drawer ref="drawer" @addNode="addNode" />
      </div>
    </section>
    <DialogMysql ref="dialogMysql"></DialogMysql>
    <!--    编辑容器-->
    <div>
      <component
        v-if="currentNode"
        :is="comData[currentNode.data.props.editFile]"
        :graph="graph"
        ref="editComponent"
      />
    </div>
  </div>
</template>

<script>
  import '@antv/x6-vue-shape';
  import lineMenu from './components/lineMenu.vue';
  import nodeMenu from './components/nodeMenu.vue';
  import Drawer from './components/drawer.vue';
  import DialogMysql from './components/dialog/mysql.vue';
  import { initGraph } from './components/graph.js';
  import { DagreLayout } from '@antv/layout'

  // 直接引入所有编辑器
  const modules = import.meta.glob('./components/edit/*.vue', { eager: true });
  import { $Bus } from '@/global.js';
  export default {
    name: 'App',
    components: { lineMenu, Drawer, DialogMysql, nodeMenu },
    data() {
      return {
        comData: {},
        graph: '',
        timer: '',
        isLock: false,
        showContextMenu: false,
        nodeMenuShow: false,
        currentNode: '',
      };
    },
    mounted() {
      const graphContainer = this.$refs.graphContainer;
      this.graph = initGraph(graphContainer);
      // 按钮绑定
      this.keyBindFn();
      this.contextMenu();

      Object.keys(modules).forEach((key) => {
        const name = key.match(/\/([^/]+)\.vue$/)?.[1]; // 提取文件名
        if (name) {
          this.comData[name] = modules[key].default
        }
      });

      $Bus.$Bus.on('nodeHeightChange', (item) => {
        const node = this.getNodeById(item.id)
        console.log(node.size())
        const size = node.size()
        node.resize(size.width, item.height)
      });

    },
    methods: {
      layoutFn(){


        const data = {
          nodes: [],
          edges: [],
        }

        this.graph.toJSON({ diff: true }).cells.forEach((e)=>{
          if(e.shape === 'dag-edge'){
            data.edges.push(e)
          } else {
            data.nodes.push(e)
          }
        })
        const dagreLayout = new DagreLayout({
          type: 'dagre',
          rankdir: 'LR',
          align: 'UR',
          ranksep: 35,
          nodesep: 15,
        })

        const model = dagreLayout.layout(data)

        this.graph.fromJSON(model)
      },
      contextMenu() {
        this.graph.on('edge:contextmenu', ({ e, x, y, edge, view }) => {
          this.showContextMenu = true;
          this.$nextTick(() => {
            this.$refs.lineMenu.initFn(e.offsetX, e.offsetY, {
              type: 'edge',
              item: this.graph.getCellById(edge.id),
            });
          });
        });

        this.graph.on('node:contextmenu', ({ e, x, y, node, view }) => {
          this.nodeMenuShow = true;

          this.$nextTick(() => {
            const p = this.graph.localToPage(x, y);
            this.$refs.nodeMenu.initFn(p.x + 10, p.y + 10, { type: 'node', item: node });
          });
        });

        this.graph.on('node:mouseenter', (node) => {
          this.showPorts(node.node.id, 'visible');
        });
        this.graph.on('node:mouseleave', (node) => {
          this.showPorts(node.node.id, 'hidden');
        });
      },
      showPorts(id, visibliy) {
        const container = this.$refs.graphContainer;
        const ports = container.querySelectorAll('.x6-port-body');
        if (ports && ports.length) {
          ports.forEach((e) => {
            const port = e.getAttribute('port');
            if (new RegExp(id).test(port)) {
              e.style.visibility = visibliy;
            }
          });
        }
      },
      getNodeById(id) {
        return this.graph.getCellById(id);
      },
      hideFn() {
        this.showContextMenu = false;
        this.nodeMenuShow = false;
      },

      zoomFn(num) {
        this.graph.zoom(num);
      },
      centerFn() {
        const num = 1 - this.graph.zoom();
        num > 1 ? this.graph.zoom(num * -1) : this.graph.zoom(num);
        this.graph.centerContent();
      },
      keyBindFn() {
        // copy cut paste
        this.graph.bindKey(['meta+c', 'ctrl+c'], () => {
          const cells = this.graph.getSelectedCells();
          if (cells.length) {
            this.graph.copy(cells);
          }
          return false;
        });
        this.graph.bindKey(['meta+x', 'ctrl+x'], () => {
          const cells = this.graph.getSelectedCells();
          if (cells.length) {
            this.graph.cut(cells);
          }
          return false;
        });
        this.graph.bindKey(['meta+v', 'ctrl+v'], () => {
          if (!this.graph.isClipboardEmpty()) {
            const cells = this.graph.paste({ offset: 32 });
            this.graph.cleanSelection();
            this.graph.select(cells);
          }
          return false;
        });

        // undo redo
        this.graph.bindKey(['meta+z', 'ctrl+z'], () => {
          if (this.graph.history.canUndo()) {
            this.graph.history.undo();
          }
          return false;
        });
        // delete
        this.graph.bindKey(['delete'], () => {
          const select = this.graph.getSelectedCells();
          select?.forEach((item) => {
            if (/edge/.test(item.shape)) {
              this.graph.removeEdge(item.id);
            } else {
              this.graph.removeNode(item.id);
            }
          });
          return false;
        });
      },
      saveFn() {
        localStorage.setItem('x6Json', JSON.stringify(this.graph.toJSON({ diff: true })));
      },
      loadFn() {
        const x6Json = JSON.parse(localStorage.getItem('x6Json'));
      },
      nodeMenuCallBack(type, node) {
        switch (type) {
          case 'edit':
            this.currentNode = node;
            this.$nextTick(() => {
              this.$refs.editComponent.init(this.currentNode);
            });
            break;
        }
        this.nodeMenuShow = false;
      },
      contextMenuFn(type, node) {
        switch (type) {
          case 'remove':
            if (node.type == 'edge') {
              this.graph.removeEdge(node.item.id);
            } else if (node.type == 'node') {
              this.graph.removeNode(node.item.id);
            }
            break;
          case 'source':
            this.$refs.dialogMysql.visible = true;
            this.$refs.dialogMysql.init(node);
            break;
        }

        this.showContextMenu = false;
      },

      showDrawerFn() {
        this.$refs.drawer.visible = !this.$refs.drawer.visible;
      },
      addNode(option) {
        const p = this.graph.pageToLocal(option.x, option.y);
        this.graph.addNode(Object.assign({}, option, p));
      },
    },
  };
</script>
<style lang="less">
  /*链接桩*/
  .x6-port-body {
    visibility: hidden;
  }

  .x6-node-selected .node {
    border-color: #1890ff;
    border-radius: 2px;
    box-shadow: 0 0 0 4px #d4e8fe;
  }

  .x6-node-selected .node.success {
    border-color: #52c41a;
    border-radius: 2px;
    box-shadow: 0 0 0 4px #ccecc0;
  }

  .x6-node-selected .node.failed {
    border-color: #ff4d4f;
    border-radius: 2px;
    box-shadow: 0 0 0 4px #fedcdc;
  }

  .x6-edge:hover path:nth-child(2) {
    stroke: #1890ff;
    stroke-width: 1px;
  }

  .x6-edge-selected path:nth-child(2) {
    stroke: #1890ff;
    stroke-width: 1.5px !important;
  }
</style>

<style lang="less" scoped>
  .graphContainer {
    height: 100vh;
    width: 100vw;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    .icon {
      font-size: 16px;
      cursor: pointer;
      margin-left: 10px;
    }
  }
</style>
