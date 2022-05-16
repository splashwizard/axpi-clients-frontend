import Vue from "vue";
import Vuex from "vuex";

import modules from "./modules";

Vue.use(Vuex);

// Vuex Storage
import VuexPersist from "vuex-persist";
// import localForage from 'localforage';

const vuexStorage = new VuexPersist({
  key: "axpi-frontend-auth",
  storage: window.localStorage,
  modules: ["auth", "shop"],
});

export default new Vuex.Store({
  modules,
  plugins: [vuexStorage.plugin],
  // Enable strict mode in development to get a warning
  // when mutating state outside of a mutation.
  // https://vuex.vuejs.org/guide/strict.html
  strict: process.env.NODE_ENV !== "production",
});
