let _ = require('lodash');
// import router from "../../router";

export const state = {
    activeGraph: 'orders',

    selectedOrders: [],
    xOptions: null,
    selectedXOption: null,

    colourByOptions: null,
    selectedColourByOption: null,

    sizeByOptions: null,
    selectedSizeByOption: null,

    selectedBinByOption: 'day',

    clusterViewerReloadKey: 1
};

export const mutations = {
   SET_ACTIVE_GRAPH(state, activeGraph) {
       state.activeGraph = activeGraph;
   },

    SET_SELECTED_ORDERS(state, orders) {
        state.selectedOrders = orders;
    },

    TOGGLE_ORDER_SELECTED(state, order) {
        state.selectedOrders = _.xor(state.selectedOrders, [order]);
    },

    SET_X_OPTIONS(state, xOptions) {
        state.xOptions = xOptions;
    },

    SELECT_X_OPTION(state, xOption) {
        state.selectedXOption = xOption;
    },

    SET_COLOUR_BY_OPTIONS(state, options) {
        state.colourByOptions = options;
    },

    SELECT_COLOUR_BY_OPTION(state, option) {
        state.selectedColourByOption = option;
    },

    SET_SIZE_BY_OPTIONS(state, options) {
        state.sizeByOptions = options;
    },

    SELECT_SIZE_BY_OPTION(state, option) {
        state.selectedSizeByOption = option;
    },

    INCREMENT_CLUSTER_VIEWER_RELOAD_KEY(state) {
        state.clusterViewerReloadKey += 1;
    },

    SELECT_BIN_BY_OPTION(state, binBy) {
        state.selectedBinByOption = binBy;
    }
};

export const getters = {
    selectedOrders: (state) => {
        return state.selectedOrders;
    },

    xOptions: (state) => {
        return state.xOptions;
    },

    selectedXOption: (state) => {
        return state.selectedXOption;
    },

    colourByOptions: (state) => {
        return state.colourByOptions;
    },

    selectedColourByOption: (state) => {
        return state.selectedColourByOption;
    },

    sizeByOptions: (state) => {
        return state.sizeByOptions;
    },

    selectedSizeByOption: (state) => {
        return state.selectedSizeByOption;
    },

    activeGraph: (state) => {
        return state.activeGraph;
    },

    selectedBinByOption: (state) => {
        return state.selectedBinByOption;
    },

    clusterViewerReloadKey: (state) => {
        return state.clusterViewerReloadKey;
    }
};

export const actions = {
    toggleOrderSelected({commit}, order) {
        commit('TOGGLE_ORDER_SELECTED', order);
    },

    setSelectedOrders({commit}, orders) {
        commit('SET_SELECTED_ORDERS', orders);
    },

    setXOptions({commit}, options) {
        commit('SET_X_OPTIONS', options);
    },

    selectXOption({commit}, option) {
        commit('SELECT_X_OPTION', option);
    },

    setColourByOptions({commit}, options) {
        commit('SET_COLOUR_BY_OPTIONS', options);
    },

    selectColourByOption({commit}, option) {
        commit('SELECT_COLOUR_BY_OPTION', option);
    },

    setSizeByOptions({commit}, options) {
        commit('SET_SIZE_BY_OPTIONS', options);
    },

    selectSizeByOption({commit}, option) {
        commit('SELECT_SIZE_BY_OPTION', option);
    },

    setActiveGraph({commit}, activeGraph) {
        commit('SET_ACTIVE_GRAPH', activeGraph);
    },

    selectBinByOption({commit}, binBy) {
        commit('SELECT_BIN_BY_OPTION', binBy);
    },

    incrementClusterViewerReloadKey({commit}) {
        commit('INCREMENT_CLUSTER_VIEWER_RELOAD_KEY');
    }
};
