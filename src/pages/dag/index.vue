<template>
  <div id="coverCot" style="width: 100vw; height: 100vh; overflow: hidden">
    <div id="container" style="width: 100vw; height: 100vh; overflow: hidden"> </div>
  </div>
</template>

<script>
  import { Graph, Node, Path, Edge, Platform, StringExt } from '@antv/x6';
  import nodedag from './components/node.vue';
  import dataJson from './data.json';
  import { $Bus } from '@/global.js';

  const NodeType = {
    INPUT: 'INPUT', // 数据输入
    FILTER: 'FILTER', // 数据过滤
    JOIN: 'JOIN', // 数据连接
    UNION: 'UNION', // 数据合并
    AGG: 'AGG', // 数据聚合
    OUTPUT: 'OUTPUT', // 数据输出
  };
  // 节点状态列表
  const nodeStatusList = [
    {
      id: 'node-0',
      status: 'success',
    },
    {
      id: 'node-1',
      status: 'success',
    },
    {
      id: 'node-2',
      status: 'success',
    },
    {
      id: 'node-3',
      status: 'success',
    },
    {
      id: 'node-4',
      status: 'error',
      statusMsg: '错误信息示例',
    },
  ];

  // 边状态列表
  const edgeStatusList = [
    {
      id: 'edge-0',
      status: 'success',
    },
    {
      id: 'edge-1',
      status: 'success',
    },
    {
      id: 'edge-2',
      status: 'success',
    },
    {
      id: 'edge-3',
      status: 'success',
    },
  ];

  // 加工类型列表
  const PROCESSING_TYPE_LIST = [
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
  ];
  // 直接引入所有编辑器
  export default {
    name: 'Dag',
    provide() {
      return {};
    },
    data() {
      return {
        graph: '',
      };
    },
    mounted() {
      this.registerFn();
      this.init();

      $Bus.$Bus.on('createNode', (obj) => {
        this.createDownstream(obj.type, obj.node);
      });
    },
    methods: {
      createDownstream(type, node) {
        const graph = this.graph;
        if (graph) {
          // 获取下游节点的初始位置信息
          const position = this.getDownstreamNodePosition(node, graph);
          // 创建下游节点
          const newNode = this.createNode(type, graph, position);
          const source = node.id;
          const target = newNode.id;
          // 创建该节点出发到下游节点的边
          this.createEdge(source, target, graph);
        }
      },
      registerFn() {
        const _this = this;
        Graph.registerNode(
          'data-processing-dag-node',
          {
            inherit: 'vue-shape',
            width: 230,
            height: 36,
            component: {
              template: `<nodedag />`,
              components: {
                nodedag,
              },
            },
            ports: {
              groups: {
                in: {
                  position: 'left',
                  attrs: {
                    circle: {
                      r: 4,
                      magnet: true,
                      stroke: 'transparent',
                      strokeWidth: 1,
                      fill: 'transparent',
                    },
                  },
                },

                out: {
                  position: {
                    name: 'right',
                    args: {
                      dx: -30,
                    },
                  },

                  attrs: {
                    circle: {
                      r: 4,
                      magnet: true,
                      stroke: 'transparent',
                      strokeWidth: 1,
                      fill: 'transparent',
                    },
                  },
                },
              },
            },
          },
          true
        );

        // 注册连线
        Graph.registerConnector(
          'curveConnector',
          (sourcePoint, targetPoint) => {
            const hgap = Math.abs(targetPoint.x - sourcePoint.x);
            const path = new Path();
            path.appendSegment(Path.createSegment('M', sourcePoint.x - 4, sourcePoint.y));
            path.appendSegment(Path.createSegment('L', sourcePoint.x + 12, sourcePoint.y));
            // 水平三阶贝塞尔曲线
            path.appendSegment(
              Path.createSegment(
                'C',
                sourcePoint.x < targetPoint.x ? sourcePoint.x + hgap / 2 : sourcePoint.x - hgap / 2,
                sourcePoint.y,
                sourcePoint.x < targetPoint.x ? targetPoint.x - hgap / 2 : targetPoint.x + hgap / 2,
                targetPoint.y,
                targetPoint.x - 6,
                targetPoint.y
              )
            );
            path.appendSegment(Path.createSegment('L', targetPoint.x + 2, targetPoint.y));

            return path.serialize();
          },
          true
        );

        Edge.config({
          markup: [
            {
              tagName: 'path',
              selector: 'wrap',
              attrs: {
                fill: 'none',
                cursor: 'pointer',
                stroke: 'transparent',
                strokeLinecap: 'round',
              },
            },
            {
              tagName: 'path',
              selector: 'line',
              attrs: {
                fill: 'none',
                pointerEvents: 'none',
              },
            },
          ],
          connector: { name: 'curveConnector' },
          attrs: {
            wrap: {
              connection: true,
              strokeWidth: 10,
              strokeLinejoin: 'round',
            },
            line: {
              connection: true,
              stroke: '#A2B1C3',
              strokeWidth: 1,
              targetMarker: {
                name: 'classic',
                size: 6,
              },
            },
          },
        });

        Graph.registerEdge('data-processing-curve', Edge, true);

        this.graph = new Graph({
          container: document.getElementById('container'),
          panning: {
            enabled: true,
            eventTypes: ['leftMouseDown', 'mouseWheel'],
          },
          mousewheel: {
            enabled: true,
            modifiers: 'ctrl',
            factor: 1.1,
            maxScale: 1.5,
            minScale: 0.5,
          },
          background: {
            color: '#e1f5ed', // 设置画布背景颜色
          },
          highlighting: {
            magnetAdsorbed: {
              name: 'stroke',
              args: {
                attrs: {
                  fill: '#fff',
                  stroke: '#31d0c6',
                  strokeWidth: 4,
                },
              },
            },
          },
          connecting: {
            snap: true,
            allowBlank: false,
            allowLoop: false,
            highlight: true,
            sourceAnchor: {
              name: 'left',
              args: {
                dx: Platform.IS_SAFARI ? 4 : 8,
              },
            },
            targetAnchor: {
              name: 'right',
              args: {
                dx: Platform.IS_SAFARI ? 4 : -8,
              },
            },
            createEdge() {
              return _this.graph.createEdge({
                shape: 'data-processing-curve',
                attrs: {
                  line: {
                    strokeDasharray: '5 5',
                  },
                },
                zIndex: -1,
              });
            },
            // 连接桩校验
            validateConnection({ sourceMagnet, targetMagnet }) {
              // 只能从输出链接桩创建连接
              if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
                return false;
              }
              // 只能连接到输入链接桩
              if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in') {
                return false;
              }
              return true;
            },
          },
        });
      },
      getDownstreamNodePosition(node, graph, dx = 250, dy = 100) {
        // 找出画布中以该起始节点为起点的相关边的终点id集合
        const downstreamNodeIdList = [];
        graph.getEdges().forEach((edge) => {
          const originEdge = edge.toJSON()?.data;
          if (originEdge && originEdge.source === node.id) {
            downstreamNodeIdList.push(originEdge.target);
          }
        });
        // 获取起点的位置信息
        const position = node.getPosition();
        let minX = Infinity;
        let maxY = -Infinity;
        graph.getNodes().forEach((graphNode) => {
          if (downstreamNodeIdList.indexOf(graphNode.id) > -1) {
            const nodePosition = graphNode.getPosition();
            // 找到所有节点中最左侧的节点的x坐标
            if (nodePosition.x < minX) {
              minX = nodePosition.x;
            }
            // 找到所有节点中最x下方的节点的y坐标
            if (nodePosition.y > maxY) {
              maxY = nodePosition.y;
            }
          }
        });

        return {
          x: minX !== Infinity ? minX : position.x + dx,
          y: maxY !== -Infinity ? maxY + dy : position.y,
        };
      },
      getPortsByType(type, nodeId) {
        let ports = [];
        switch (type) {
          case NodeType.INPUT:
            ports = [
              {
                id: `${nodeId}-out`,
                group: 'out',
              },
            ];
            break;
          case NodeType.OUTPUT:
            ports = [
              {
                id: `${nodeId}-in`,
                group: 'in',
              },
            ];
            break;
          default:
            ports = [
              {
                id: `${nodeId}-in`,
                group: 'in',
              },
              {
                id: `${nodeId}-out`,
                group: 'out',
              },
            ];
            break;
        }
        return ports;
      },
      createNode(type, graph, position) {
        if (!graph) {
          return {};
        }
        let newNode = {};
        const sameTypeNodes = graph.getNodes().filter((item) => item.getData()?.type === type);
        const typeName = PROCESSING_TYPE_LIST?.find((item) => item.type === type)?.name;
        const id = StringExt.uuid();
        const node = {
          id,
          shape: 'data-processing-dag-node',
          x: position?.x,
          y: position?.y,
          ports: this.getPortsByType(type, id),
          data: {
            name: `${typeName}_${sameTypeNodes.length + 1}`,
            type,
          },
        };
        newNode = graph.addNode(node);
        return newNode;
      },
      createEdge(source, target, graph) {
        const edge = {
          id: StringExt.uuid(),
          shape: 'data-processing-curve',
          source: {
            cell: source,
            port: `${source}-out`,
          },
          target: {
            cell: target,
            port: `${target}-in`,
          },
          zIndex: -1,
          data: {
            source,
            target,
          },
        };
        if (graph) {
          graph.addEdge(edge);
        }
      },
      showNodeStatus() {
        nodeStatusList.forEach((item) => {
          const { id, status, statusMsg } = item;
          const node = this.graph.getCellById(id);
          const data = node.getData();
          node.setData({
            ...data,
            status,
            statusMsg,
          });
        });
      },
      excuteAnimate() {
        this.graph.getEdges().forEach((edge) => {
          edge.attr({
            line: {
              stroke: '#3471F9',
            },
          });
          edge.attr('line/strokeDasharray', 5);
          edge.attr('line/style/animation', 'running-line 30s infinite linear');
        });
      },
      stopAnimate() {
        this.graph.getEdges().forEach((edge) => {
          edge.attr('line/strokeDasharray', 0);
          edge.attr('line/style/animation', '');
        });
        edgeStatusList.forEach((item) => {
          const { id, status } = item;
          const edge = this.graph.getCellById(id);
          if (status === 'success') {
            edge.attr('line/stroke', '#52c41a');
          }
          if (status === 'error') {
            edge.attr('line/stroke', '#ff4d4f');
          }
        });
        // 默认选中一个节点
        // this.graph.select('node-2')
      },
      init() {
        this.graph.fromJSON(dataJson);
        const zoomOptions = {
          padding: {
            left: 10,
            right: 10,
          },
        };
        this.graph.zoomToFit(zoomOptions);
        setTimeout(() => {
          this.excuteAnimate();
        }, 2000);
        setTimeout(() => {
          this.showNodeStatus();
          this.stopAnimate();
        }, 3000);
      },
    },
  };
</script>
