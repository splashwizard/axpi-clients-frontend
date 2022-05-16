import Vue from "vue";
// import { VuePlugin } from 'vuera'
import Element from "element-ui";
import App from "./App.vue";
// import './registerServiceWorker'
import router from "./router";
import store from "./store";
import axios from "axios";

Vue.use(Element);
// Vue.use(VuePlugin);

Vue.config.productionTip = false;

window.moment = require("moment");

const BASE_URL = process.env.VUE_APP_API_BASE_URL;
window.API_BASE = `${BASE_URL}/api/clients`;
window.API_COMMON_BASE = `${BASE_URL}/api/common`;
window.IMAGE_STORAGE_BASE = `${BASE_URL}/storage`;
window.API_TOKEN_URL = `${BASE_URL}/api/token`;

// Html 2 canvas (screenshoting analytics)
import VueHtml2Canvas from "vue-html2canvas";
Vue.use(VueHtml2Canvas);

import VueCarousel from "vue-carousel";
Vue.use(VueCarousel);

// Algolia
import InstantSearch from "vue-instantsearch";
Vue.use(InstantSearch);
import "instantsearch.css/themes/satellite.css";

import VueQuillEditor from "vue-quill-editor";

import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor);

// Ant Design
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
Vue.use(Antd);

// Element UI
import "element-ui/lib/theme-chalk/index.css";
import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";
locale.use(lang);
import { Collapse, CollapseItem, Select, Option, Input } from "element-ui";
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);

// Viser
import Viser from "viser-vue";
Vue.use(Viser);

Vue.component("loading-screen", require("./components/LoadingScreen").default);
Vue.component("metric-card", require("./components/Analytics/MetricCard").default);
Vue.component("swooshy-selector", require("./components/SwooshySelector").default);
Vue.component("validated-form-item", require("./components/Validation/ValidatedFormItem").default);
Vue.component("inline-validation-errors", require("./components/Validation/InlineValidationErrors").default);
Vue.component("infobox", require("./components/Infobox").default);

// Custom styles
import "@/assets/scss/main.scss";

// Axios Interceptor
axios.interceptors.request.use(
  (config) => {
    const token = store.getters["auth/apiToken"];
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
