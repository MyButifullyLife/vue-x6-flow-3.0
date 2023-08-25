<template>
  <div id="coverCot" style="width: 100vw; height: 100vh; overflow: hidden">
    <div class="">
      <el-button type="primary" @click="initTree"> 初始化</el-button>
    </div>
    <section class="section-cot" style="width: 100%; height: 100%">
      <div id="container">
        <div id="draw-cot" />
      </div>
    </section>
    <Drawer ref="DrawerRef" @add="addNodeFn" @del="delFn" @edit="editFn"></Drawer>
  </div>
</template>

<script setup lang="ts">

  import { onMounted, ref } from 'vue';
  import Hierarchy from '@antv/hierarchy';
  import { $Bus } from '@/global';
  import {generateUniqueId} from '@/utils'
  import initGraph from './graph';

  let _Graph: any;

  const DrawerRef = ref();

  $Bus.$Bus.on('nodeOpenConfig', (node) => {
    DrawerRef.value.init(node);
  });

  let Tree: graphData;

  interface graphData {
    id: string;
    children: object[];
    type: number;
    data: object;
  }
  const Drawer = defineAsyncComponent(() => import('./drawer.vue'));

  const initTree = () => {
    Tree = {
      id: generateUniqueId(),
      children: [],
      type: 1,
      data: {
        name: '初始化',
        height: 40,
      },
    };

    layoutFn();
  };

  const layoutFn = () => {
    const result = Hierarchy.compactBox(Tree, {
      direction: 'TB',
      getWidth() {
        return 180;
      },
      getHeight(d) {
        return d.data.height ? parseInt(d.data.height) : 40;
      },
      getHGap() {
        return 30;
      },
      getVGap() {
        return 70;
      },
      getSide: () => {
        return 'bottom';
      },
    });
    const model = { nodes: [], edges: [] };

    const traverse = (data) => {
      if (data) {
        model.nodes?.push({
          id: `${data.id}`,
          x: data.x + 700,
          y: data.y + 200,
          shape: 'dag-node',
          data: data.data,
          width: 180,
          height: data.data.data.height || 40,
          ports: {
            groups: {
              bottom: {
                position: 'bottom',
                attrs: {
                  circle: {
                    stroke: 'transparent',
                    strokeWidth: 0,
                    fill: 'transparent',
                  },
                },
              },

              top: {
                position: 'top',
                attrs: {
                  circle: {
                    stroke: 'transparent',
                    strokeWidth: 0,
                    fill: 'transparent',
                  },
                },
              },
            },
            items: [
              {
                id: `bottom-${data.id}`,
                group: 'bottom', // 指定分组名称
              },
              {
                id: `top-${data.id}`,
                group: 'top', // 指定分组名称
              },
            ],
          },
        });
      }

      if (data.children) {
        data.children.forEach((item) => {
          model.edges?.push({
            source: { cell: data.id, port: 'bottom-' + data.id },
            target: { cell: item.id, port: 'top-' + item.id },
            shape: 'dag-edge',
            labels: [
              {
                attrs: {
                  line: {
                    stroke: '#73d13d',
                  },
                  text: {
                    text: item.data.data.lineLabel || '',
                  },
                },
              },
            ],
          });
          traverse(item);
        });
      }
    };
    traverse(result);

    _Graph.fromJSON(model);
  };

  const getTreeObjFn = (tree: any, id: String) => {
    let d: any = '';
    const fn = (list: Object) => {
      if (list.id == id) {
        d = list;
      } else {
        list.children.forEach((e: object) => {
          fn(e);
        });
      }
    };
    if (tree.id === id) {
      d = tree;
    } else {
      tree.children.forEach((e) => {
        fn(e);
      });
    }
    return d;
  };

  const getTreeObjParentFn = (tree: graphData, id: any) => {
    let p = '';
    const fn = (list: object, parent: string | graphData) => {
      if (list.id == id) {
        p = parent;
      } else {
        list.children.forEach((e) => {
          fn(e, list);
        });
      }
    };
    if (tree.id === id) {
      p = '';
    } else {
      tree.children.forEach((e) => {
        fn(e, tree);
      });
    }
    return p;
  };

  const editFn = (node) => {
    // 改变cell data赋值
    // 触发 database 组件的监听
    const treeNode = getTreeObjFn(Tree, node.id);
    treeNode.data = node.data.data;
    let cell = _Graph.getCellById(node.id);
    cell.data = node.data.data;
    // this.layoutFn()
  };

  const delFn = (node) => {
    let parent = getTreeObjParentFn(Tree, node.id);
    if (parent) {
      for (let i = 0; i < parent.children.length; i++) {
        if (parent.children[i].id === node.id) {
          parent.children.splice(i, 1);
          layoutFn();
          break;
        }
      }
    } else {
    }
  };

  const addNodeFn = (node, lineLabel, height) => {
    const treeNode = getTreeObjFn(Tree, node.id);
    treeNode.children.push({
      type: 2,
      id: new Date().getTime() + '',
      data: {
        name: '新增',
        height: height || 40,
        lineLabel: lineLabel,
      },
      children: [],
    });

    layoutFn();
  };

  onMounted(() => {
    _Graph = initGraph();
  });
</script>

<style>
  body {
    box-sizing: border-box;
    margin: 0;
  }

  header {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 50px;
  }

  header i {
    margin: 8px;
    font-size: 30px;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 20px;
  }

  .my-selecting {
    border: 1px solid red;
    display: block;
    z-index: 0;
  }

  @keyframes running-line {
    to {
      stroke-dashoffset: -1000;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
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

  .section-cot {
    display: flex;
  }

  .section-cot #container {
    position: relative;
    flex: 1;
  }

  .section-cot #container #draw-cot {
    width: 100%;
    height: 100%;
  }

  ::-webkit-scrollbar {
    width: 0;
  }
</style>
