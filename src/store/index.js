import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

// Vuex Storage
import VuexPersist from 'vuex-persist';
import localForage from 'localforage';

const vuexAuthStorage = new VuexPersist({
    key: 'axpi-frontend-auth',
    storage: localForage,
    modules: ['auth']
})

export default new Vuex.Store({
    modules,
    plugins: [vuexAuthStorage.plugin],
    // Enable strict mode in development to get a warning
    // when mutating state outside of a mutation.
    // https://vuex.vuejs.org/guide/strict.html
    strict: process.env.NODE_ENV !== 'production',
})
