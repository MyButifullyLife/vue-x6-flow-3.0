const config = [
  {
    type: "start",
    height: 40,
    width:100,
    props: {
      name: "开始",
      editFile: 'start', //编辑文件名，对应edit文件夹下的vue组件
    },
  },
  {
    type: "end",
    height: 40,
    width:100,
    props: {
      name: "结束",
      editFile: 'end', //编辑文件名，对应edit文件夹下的vue组件
    },
  },

  {
    type: "common",
    height: 40,
    width:180,
    props: {
      editFile: 'common', //编辑文件名，对应edit文件夹下的vue组件
      name: "流程节点",
      region: ''
    },
  },
  {
    type: "common",
    height: 40,
    width:180,
    props: {
      editFile: 'common', //编辑文件名，对应edit文件夹下的vue组件
      name: "流程节点2",
      region: ''
    },
  },
];

export default config;
