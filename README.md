npm install 

npm run dev



坑：
// vite.config.js
resolve: {
alias: [
{
find: '@antv/x6',
replacement: '@antv/x6/lib'
},
{
find: '@antv/x6-vue-shape',
replacement: '@antv/x6-vue-shape/lib',
},
]
},
