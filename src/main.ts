import App from './App.vue';
import { createApp } from 'vue'
import router from '@/router';
import store from '@/store';
import '@/styles/index.less';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const app = createApp(App);
import '@antv/x6-vue-shape'



app.use(router);
app.use(store);
app.use(ElementPlus)


app.mount('#app');
