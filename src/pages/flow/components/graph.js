
import start from './nodeTheme/start.vue';
import end from './nodeTheme/end.vue';
import common from './nodeTheme/common.vue';
import { Graph, Path } from '@antv/x6';


const registerFn = ()=>{
  
  
  Graph.registerNode(
  'dag-node',
  {
    inherit: 'vue-shape',
    width: 180,
    height: 36,
    component: {
      template: `<start />`,
      components: {
        start,
      },
    },
  },
  true
  );
  
  
  Graph.registerNode(
  'dag-node',
  {
    inherit: 'vue-shape',
    width: 180,
    height: 36,
    component: {
      template: `<end />`,
      components: {
        end,
      },
    },
  },
  true
  );
  
  
  
  
  Graph.registerNode(
  'dag-node',
  {
    inherit: 'vue-shape',
    width: 180,
    height: 36,
    component: {
      template: `<common />`,
      components: {
        common,
      },
    },
  },
  true
  );
  
  Graph.registerEdge(
  'dag-edge',
  {
    inherit: 'edge',
    vertices: '',
    router: 'manhattan',
    connector: 'normal',
    data: {},
    attrs: {
      line: {
        stroke: '#dfe5f2',
        strokeWidth: 2,
        targetMarker: {
          name: 'block',
          width: 12,
          height: 8,
        },
      },
    },
  },
  true
  );
  Graph.registerConnector(
  'algo-connector',
  (s, e) => {
    const offset = 4;
    const deltaY = Math.abs(e.y - s.y);
    const control = Math.floor((deltaY / 3) * 2);
    
    const v1 = { x: s.x, y: s.y + offset + control };
    const v2 = { x: e.x, y: e.y - offset - control };
    
    return Path.normalize(
    `M ${s.x} ${s.y}
           L ${s.x} ${s.y + offset}
           C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
           L ${e.x} ${e.y}
          `
    );
  },
  true
  );
  
}

export  function  initGraph(container) {
  registerFn()
  const graph = new Graph({
    grid: {
      size: 10,
      visible: true,
      type: 'dot', // 'dot' | 'fixedDot' | 'mesh'
      args: {
        color: '#d6d6d6', // 网格线/点颜色
        thickness: 1, // 网格线宽度/网格点大小
      },
    },
    background: {
      color: 'rgba(225,245,247,.2)', // 设置画布背景颜色
    },
    container: container,
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
      connector: 'algo-connector',
      connectionPoint: 'anchor',
      anchor: 'center',
      validateMagnet() {
        // return magnet.getAttribute('port-group') !== 'top'
        
        // 限制连线配置
        return true;
      },
      createEdge() {
        return graph.createEdge({
          shape: 'dag-edge',
        });
      },
    },
    selecting: {
      enabled: true,
      multiple: true,
      rubberEdge: true,
      rubberNode: true,
      modifiers: 'shift',
      rubberband: true,
    },
    keyboard: true,
    clipboard: true,
    history: true,
  });
  
 
  
  // graph.on('edge:connected', ({ edge }) => {
  //   const source = graph.getCellById(edge.source.cell);
  //   const target = graph.getCellById(edge.target.cell);
  //   edge.attr({
  //     line: {
  //       strokeDasharray: '',
  //     },
  //   });
  // });
  //
  return graph
}
