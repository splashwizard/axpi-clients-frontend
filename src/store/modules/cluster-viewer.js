let _ = require("lodash");
// import router from "../../router";

export const state = {
  cluster: null,
  ordersWithMatches: [],
  insights: [],

  activeGraph: "orders",

  selectedOrders: [],
  xOptions: null,
  selectedXOption: null,

  selectedColourByOption: null,

  selectedSizeByOption: null,

  selectedBinByOption: "day",

  startDate: null,
  endDate: null,

  sortField: null,
  sortOrder: null,
  filters: {},

  clusterViewerReloadKey: 1,
};

export const mutations = {
  SET_CLUSTER(state, cluster) {
    state.cluster = cluster;
  },

  SET_ORDERS_WITH_MATCHES(state, ordersWithMatches) {
    state.ordersWithMatches = ordersWithMatches;
  },

  SET_INSIGHTS(state, insights) {
    state.insights = insights;
  },

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

  SELECT_COLOUR_BY_OPTION(state, option) {
    state.selectedColourByOption = option;
  },

  SELECT_SIZE_BY_OPTION(state, option) {
    state.selectedSizeByOption = option;
  },

  INCREMENT_CLUSTER_VIEWER_RELOAD_KEY(state) {
    state.clusterViewerReloadKey += 1;
  },

  SELECT_BIN_BY_OPTION(state, binBy) {
    state.selectedBinByOption = binBy;
  },

  SET_START_DATE(state, startDate) {
    state.startDate = startDate;
  },

  SET_END_DATE(state, endDate) {
    state.endDate = endDate;
  },

  SET_SORT_FIELD(state, sortField) {
    state.sortField = sortField;
  },

  SET_SORT_ORDER(state, sortOrder) {
    state.sortOrder = sortOrder;
  },

  SET_FILTERS(state, filters) {
    state.filters = filters;
  },
};

export const getters = {
  cluster: (state) => {
    return state.cluster;
  },

  ordersWithMatches: (state) => {
    return state.ordersWithMatches;
  },

  ordersWithMatchesFiltered: (state) => {
    // Filter by filters from table
    let ordersWithMatches = state.ordersWithMatches;
    if (state.filters && state.filters["Vendor"] && state.filters["Vendor"].length) {
      ordersWithMatches = _.filter(ordersWithMatches, (o) => {
        return state.filters["Vendor"].includes(o["Vendor"]);
        // return true;
      });
    }

    if (state.filters && state.filters["product_name"] && state.filters["product_name"].length) {
      ordersWithMatches = _.filter(ordersWithMatches, (o) => {
        return state.filters["product_name"].includes(o["product_name"]);
        // return true;
      });
    }

    // Size by filter - we don't want to include points
    // That don't have this property
    if (state.selectedSizeByOption) {
      ordersWithMatches = _.filter(ordersWithMatches, (o) => {
        return (
          o.product_numeric_property_descriptions &&
          o.product_numeric_property_descriptions.includes(state.selectedSizeByOption)
        );
      });
    }

    return ordersWithMatches;
  },

  insights: (state) => {
    return state.insights;
  },

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
    // return state.colourByOptions;
    let options = [{ key: "Vendor", label: "Vendor" }];

    let categoricalPropertyDescriptions = _.map(state.ordersWithMatches, "product_categorical_property_descriptions");
    let flattened = _.flatten(categoricalPropertyDescriptions);
    options.push(
      _.map(flattened, (v) => {
        return {
          key: v,
          label: v,
        };
      })
    );

    return _.uniqBy(_.flatten(options), "label");
  },

  selectedColourByOption: (state) => {
    return state.selectedColourByOption;
  },

  sizeByOptions: (state) => {
    let numericPropertyDescriptions = _.map(state.ordersWithMatches, "product_numeric_property_descriptions");
    let flattened = _.flatten(numericPropertyDescriptions);
    return _.uniq(flattened);
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

  startDate: (state) => {
    return state.startDate;
  },

  endDate: (state) => {
    return state.endDate;
  },

  clusterViewerReloadKey: (state) => {
    return state.clusterViewerReloadKey;
  },

  sortField: (state) => {
    return state.sortField;
  },

  sortOrder: (state) => {
    return state.sortOrder;
  },

  filters: (state) => {
    return state.filters;
  },
};

export const actions = {
  setCluster({ commit }, cluster) {
    commit("SET_CLUSTER", cluster);
  },

  setOrdersWithMatches({ commit }, ordersWithMatches) {
    commit("SET_ORDERS_WITH_MATCHES", ordersWithMatches);
  },

  setInsights({ commit }, insights) {
    commit("SET_INSIGHTS", insights);
  },

  toggleOrderSelected({ commit }, order) {
    commit("TOGGLE_ORDER_SELECTED", order);
  },

  setSelectedOrders({ commit }, orders) {
    commit("SET_SELECTED_ORDERS", orders);
    commit("SET_FILTERS", {});
  },

  setXOptions({ commit }, options) {
    commit("SET_X_OPTIONS", options);
  },

  selectXOption({ commit }, option) {
    commit("SELECT_X_OPTION", option);
  },

  selectColourByOption({ commit }, option) {
    commit("SELECT_COLOUR_BY_OPTION", option);
  },

  selectSizeByOption({ commit }, option) {
    commit("SELECT_SIZE_BY_OPTION", option);
  },

  setActiveGraph({ commit }, activeGraph) {
    commit("SET_ACTIVE_GRAPH", activeGraph);
  },

  selectBinByOption({ commit }, binBy) {
    commit("SELECT_BIN_BY_OPTION", binBy);
  },

  setStartDate({ commit }, startDate) {
    commit("SET_START_DATE", startDate);
  },

  setEndDate({ commit }, endDate) {
    commit("SET_END_DATE", endDate);
  },

  setSortField({ commit }, sortField) {
    commit("SET_SORT_FIELD", sortField);
  },

  setSortOrder({ commit }, sortOrder) {
    commit("SET_SORT_ORDER", sortOrder);
  },

  setFilters({ commit }, filters) {
    commit("SET_FILTERS", filters);
  },

  incrementClusterViewerReloadKey({ commit }) {
    commit("INCREMENT_CLUSTER_VIEWER_RELOAD_KEY");
  },
};
