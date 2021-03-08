import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from 'axios';

Vue.config.productionTip = false

window.API_BASE = 'http://axpi-api.test/api/clients';
window.API_TOKEN_URL = 'http://axpi-api.test/api/token';

// window.API_BASE = 'https://api.axiomdata.io/api/clients';
// window.API_TOKEN_URL = 'https://api.axiomdata.io/api/token';

// Ant Design
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);

// Element UI
import 'element-ui/lib/theme-chalk/index.css';
import {Collapse, CollapseItem} from "element-ui";
Vue.use(Collapse);
Vue.use(CollapseItem);

// Custom styles
import '@/assets/scss/main.scss';

// Axios Interceptor
axios.interceptors.request.use(
    config => {
      const token = store.getters['auth/apiToken'];
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
      return config;
    },
    error => {
      Promise.reject(error)
    });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
