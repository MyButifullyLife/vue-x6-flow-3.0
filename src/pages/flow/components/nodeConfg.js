
import  {generateUniqueId} from '@/utils/index.ts'

const nodeConfig = (item, x, y) => {
  const time = generateUniqueId();
  let config = {
    x: x,
    y: y,
    id: time,
    width: item.width || 180,
    height: item.height || 40,
    shape: 'dag-node',
    data: JSON.parse(JSON.stringify(item)),
  };
  const circle = {
    r: 8,
    magnet: true,
    stroke: '#dfe5f2',
    strokeWidth: 1,
    fill: 'transparent',
  }
  
  config.ports =  {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle
        },
      },
      bottom: {
        position: 'bottom',
        attrs: {
          circle
        },
      },
      left: {
        position: 'left',
        attrs: {
          circle
        },
      },
      right: {
        position: 'right',
        attrs: {
         circle
        },
      },
    },
    items: [
      {
        id: `left-${time}`,
        group: 'left', // 指定分组名称
      },
      {
        id: `right-${time}`,
        group: 'right', // 指定分组名称
      },
      {
        id: `bottom-${time}`,
        group: 'bottom', // 指定分组名称
      },
      {
        id: `top-${time}`,
        group: 'top', // 指定分组名称
      },
    ],
  }
  // switch (item.type) {
  //   case 'common':
  //     config.ports= {
  //       groups: {
  //         left: {
  //           position: 'left',
  //           attrs: {
  //             circle: {
  //               r: 4,
  //               magnet: true,
  //               stroke: '#C2C8D5',
  //               strokeWidth: 1,
  //               fill: '#fff',
  //             },
  //           },
  //         },
  //         right: {
  //           position: 'right',
  //           attrs: {
  //             circle: {
  //               r: 4,
  //               magnet: true,
  //               stroke: '#C2C8D5',
  //               strokeWidth: 1,
  //               fill: '#fff',
  //             },
  //           },
  //         },
  //       },
  //       items: [
  //         {
  //           id: `left-${time}`,
  //           group: 'left', // 指定分组名称
  //         },
  //         {
  //           id: `right-${time}`,
  //           group: 'right', // 指定分组名称
  //         },
  //       ],
  //     }
  //     break;
  //   case 'start':
  //     config.ports=  {
  //     groups: {
  //       right: {
  //         position: 'right',
  //         attrs: {
  //           circle: {
  //             r: 4,
  //             magnet: true,
  //             stroke: '#C2C8D5',
  //             strokeWidth: 1,
  //             fill: '#fff',
  //           },
  //         },
  //       },
  //     },
  //     items: [
  //       {
  //         id: `right-${time}`,
  //         group: 'right', // 指定分组名称
  //       },
  //     ],
  //   }
  //     break;
  //   case 'end':
  //     config.ports ={
  //       groups: {
  //         left: {
  //           position: 'left',
  //           attrs: {
  //             circle: {
  //               r: 4,
  //               magnet: true,
  //               stroke: '#C2C8D5',
  //               strokeWidth: 1,
  //               fill: '#fff',
  //             },
  //           },
  //         },
  //       },
  //       items: [
  //         {
  //           id: `left-${time}`,
  //           group: 'left', // 指定分组名称
  //         },
  //       ],
  //     }
  //     break;
  // }
  return config;
};
export default nodeConfig;
