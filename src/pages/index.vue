<template>
  <div id="coverCot" style="width: 100vw; height: 100vh; overflow: hidden">
    <div class="">
      <el-button type="primary" @click="initTree"> 初始化</el-button>
    </div>
    <section class="section-cot" style="width: 100%; height: 100%">

      <div id="container">
        <div id="draw-cot"/>
      </div>
    </section>
    <Drawer ref="DrawerRef" @add="addNodeFn" @del="delFn" @edit="editFn"></Drawer>
  </div>
</template>

<script setup lang='ts'>
import {castArray} from "lodash-es";

import {onMounted, ref, defineComponent, getCurrentInstance} from 'vue'
import {Graph, Path} from '@antv/x6';
import database from './database.vue'
import Hierarchy from '@antv/hierarchy'
import {$Bus} from "@/global";

let _Graph: any;


const DrawerRef = ref()

$Bus.$Bus.on('nodeOpenConfig', (node) => {
  DrawerRef.value.init(node)
})


let Tree: graphData;

interface graphData {
  id: string;
  children: object[];
  type: number;
  data: object;
}
let container: HTMLElement | undefined;
const Drawer = defineAsyncComponent(() => import('./drawer.vue'))

const initGraph = () => {
  Graph.registerNode(
      'dag-node',
      {
        inherit: 'vue-shape',
        width: 180,
        height: 36,
        component: {
          template: `
            <database/>`,
          components: {
            database
          }
        },
        ports: {
          groups: {
            top: {
              position: 'top',
              attrs:
                  {
                    circle: {
                      r: 4,
                      magnet: true,
                      stroke:
                          '#C2C8D5',
                      strokeWidth: 1,
                      fill: '#fff'
                    }
                  }
            },
            bottom: {
              position: 'bottom',
              attrs: {
                circle: {
                  r: 4,
                  magnet:
                      true,
                  stroke: '#C2C8D5',
                  strokeWidth: 1,
                  fill: '#fff'
                }
              }
            }
          }
        }
      },
      true
  )
  Graph.registerEdge(
      'dag-edge',
      {
        inherit: 'edge',
        defaultLabel: {
          markup: [
            {
              tagName: 'rect',
              selector: 'body',
            },
            {
              tagName: 'text',
              selector: 'label',
            },
          ],
          attrs: {
            label: {
              fill: '#000',
              fontSize: 14,
              textAnchor: 'middle',
              textVerticalAnchor: 'middle',
              pointerEvents: 'none',
            },
            body: {
              ref: 'label',
              fill: '#ffd591',
              stroke: '#ffa940',
              strokeWidth: 2,
              rx: 4,
              ry: 4,
              refWidth: '140%',
              refHeight: '140%',
              refX: '-20%',
              refY: '-20%',
            },
          },
          position: {
            distance: 100,
            options: {
              absoluteDistance: true,
              reverseDistance: true,
            },
          },
        },
        attrs: {
          line: {
            stroke: '#C2C8D5',
            strokeWidth: 2,
            targetMarker: {
              name: 'block',
              width: 12,
              height: 8
            }
          }
        }
      },
      true
  )
  Graph.registerConnector(
      'algo-connector',
      (s, e) => {
        const offset = 4
        const deltaY = Math.abs(e.y - s.y)
        const control = Math.floor((deltaY / 3) * 2)

        const v1 = {x: s.x, y: s.y + offset + control}
        const v2 = {x: e.x, y: e.y - offset - control}

        return Path.normalize(
            `M ${s.x} ${s.y}
           L ${s.x} ${s.y + offset}
           C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
           L ${e.x} ${e.y}
          `
        )
      },
      true
  )
  _Graph = new Graph({
    grid: {
      size: 10,
      visible: true,
      type: 'dot', // 'dot' | 'fixedDot' | 'mesh'
      args: {
        color: '#a05410', // 网格线/点颜色
        thickness: 1 // 网格线宽度/网格点大小
      }
    },
    background: {
      color: '#fffbe6' // 设置画布背景颜色
    },
    container: container,
    panning: {
      enabled: true,
      eventTypes: ['leftMouseDown', 'mouseWheel']
    },
    mousewheel: {
      enabled: true,
      modifiers: 'ctrl',
      factor: 1.1,
      maxScale: 1.5,
      minScale: 0.5
    },
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#fff',
            stroke: '#31d0c6',
            strokeWidth: 4
          }
        }
      }
    },
    connecting: {
      snap: true,
      allowBlank: false,
      allowLoop: false,
      highlight: true,
      connector: 'algo-connector',
      connectionPoint: 'anchor',
      anchor: 'center',
      validateMagnet({magnet}) {
        // return magnet.getAttribute('port-group') !== 'top'

        // 限制连线配置
        return true
      },
      createEdge() {

      }
    },
    selecting: {
      enabled: true,
      multiple: true,
      rubberEdge: true,
      rubberNode: true,
      modifiers: 'shift',
      rubberband: true
    },
    keyboard: true,
    clipboard: true,
    history: true
  })

}

const initTree = () => {

  Tree = {
    id: new Date().getTime() + '',
    children: [],
    type: 1,
    data: {
      name: '初始化',
      height: 40
    }
  }


  layoutFn()
}

const layoutFn = () => {
  const result = Hierarchy.compactBox(Tree, {
    direction: 'TB',
    getWidth() {
      return 180
    },
    getHeight(d) {
      return d.data.height ? parseInt(d.data.height) : 40
    },
    getHGap() {
      return 30
    },
    getVGap() {
      return 70
    },
    getSide: () => {
      return 'bottom'
    },
  })
  const model = {nodes: [], edges: []}

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
              position: "bottom",
              attrs: {
                circle: {
                  stroke: "transparent",
                  strokeWidth: 0,
                  fill: "transparent",
                },
              },
            },

            top: {
              position: "top",
              attrs: {
                circle: {
                  stroke: "transparent",
                  strokeWidth: 0,
                  fill: "transparent",
                },
              },

            },
          },
          items: [
            {
              id: `bottom-${data.id}`,
              group: "bottom", // 指定分组名称
            },
            {
              id: `top-${data.id}`,
              group: "top", // 指定分组名称
            },
          ],
        },
      })
    }

    if (data.children) {
      data.children.forEach((item) => {
        model.edges?.push({
          source: {cell: data.id, port: 'bottom-' + data.id},
          target: {cell: item.id, port: 'top-' + item.id},
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

        })
        traverse(item)
      })
    }
  }
  traverse(result)

  _Graph.fromJSON(model)

  console.log(Tree)
}

const getTreeObjFn = (tree: any, id: String) => {
  let d: any = ''
  const fn = (list: Object) => {
    if (list.id == id) {
      d = list
    } else {
      list.children.forEach((e: object) => {
        fn(e)
      })
    }
  }
  if (tree.id === id) {
    d = tree
  } else {
    tree.children.forEach((e) => {
      fn(e)
    })
  }
  return d
}

const getTreeObjParentFn= (tree, id)=> {
  let p = ''
  const fn = (list, parent) => {
    if (list.id == id) {
      p = parent
    } else {
      list.children.forEach((e) => {
        fn(e, list)
      })
    }
  }
  if (tree.id === id) {
    p = ''
  } else {
    tree.children.forEach((e) => {
      fn(e, tree)
    })
  }
  return p
}

const  editFn = (node) =>{
  // 改变cell data赋值
  // 触发 database 组件的监听
  const treeNode =  getTreeObjFn(Tree, node.id)
  treeNode.data = node.data.data
  let cell =  _Graph.getCellById(node.id)
  cell.data = node.data.data
  // this.layoutFn()
}

const delFn = (node) => {
  let parent = getTreeObjParentFn(Tree, node.id)
  if (parent) {
    for (let i = 0; i < parent.children.length; i++) {
      if (parent.children[i].id === node.id) {
        parent.children.splice(i, 1)
        layoutFn()
        break
      }
    }

  } else {
  }
}

const addNodeFn = (node, lineLabel, height) => {
  const treeNode = getTreeObjFn(Tree, node.id)
  treeNode.children.push({
    type: 2,
    id: new Date().getTime() + '',
    data: {
      name: '新增',
      height: height || 40,
      lineLabel: lineLabel,
    },
    children: []
  })

  layoutFn()
}

onMounted
(() => {
  container = document.getElementById('container') as HTMLElement | undefined
  initGraph()
})
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
