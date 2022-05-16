import axios from "axios";

let _ = require("lodash");
// import router from "../../router";

export const state = {
  isLoading: false,
  product: null,
  serverErrors: [],

  documents: [],
  isLoadingDocuments: false,

  details: [],
  isLoadingDetails: false,

  prices: [],
  isLoadingPrices: false,

  stocks: [],
  isLoadingStocks: false,

  selectedPrice: null,

  view: "view", // view or edit
};

export const mutations = {
  START_LOADING(state) {
    state.isLoading = true;
  },

  STOP_LOADING(state) {
    state.isLoading = false;
  },

  SET_PRODUCT(state, product) {
    state.product = product;
  },

  SET_ERRORS(state, errors) {
    state.serverErrors = errors;
  },

  SET_DOCUMENTS(state, documents) {
    state.documents = documents;
  },

  START_LOADING_DOCUMENTS(state) {
    state.isLoadingDocuments = true;
  },

  STOP_LOADING_DOCUMENTS(state) {
    state.isLoadingDocuments = false;
  },

  SET_DETAILS(state, details) {
    state.details = details;
  },

  START_LOADING_DETAILS(state) {
    state.isLoadingDetails = true;
  },

  STOP_LOADING_DETAILS(state) {
    state.isLoadingDetails = false;
  },

  SET_VIEW(state, view) {
    state.view = view;
  },

  START_LOADING_PRICES(state) {
    state.isLoadingPrices = true;
  },

  STOP_LOADING_PRICES(state) {
    state.isLoadingPrices = false;
  },

  SET_PRICES(state, prices) {
    state.prices = prices;
  },

  START_LOADING_STOCKS(state) {
    state.isLoadingStocks = true;
  },

  STOP_LOADING_STOCKS(state) {
    state.isLoaadingStocks = false;
  },

  SET_STOCKS(state, stocks) {
    state.stocks = stocks;
  },

  SET_SELECTED_PRICE(state, price) {
    state.selectedPrice = price;
  },
};

export const getters = {
  isLoading: (state) => {
    return state.isLoading;
  },

  isLoadingDocuments: (state) => {
    return state.isLoadingDocuments;
  },

  isLoadingDetails: (state) => {
    return state.isLoadingDetails;
  },

  isLoadingPrices: (state) => {
    return state.isLoadingPrices;
  },

  isLoadingStocks: (state) => {
    return state.isLoadingStocks;
  },

  product: (state) => {
    if (state.product) {
      return state.product["product"];
    }
    return null;
  },

  productVendorMapping: (state) => {
    if (state.product) {
      return state.product["product_vendor_mapping"];
    }
    return null;
  },

  vendors: (state) => {
    let vendors = [];
    if (state.product && state.product["product"]) {
      vendors.push(state.product["product"]["vendor"]);
    }
    if (state.product && state.product["product_vendor_mapping"]) {
      vendors.push(state.product["product_vendor_mapping"]["vendors"]["names"]);
    }
    return _.uniq(_.flatten(vendors));
  },

  serverErrors: (state) => {
    return state.serverErrors;
  },

  documents: (state) => {
    return state.documents;
  },

  details: (state) => {
    return state.details;
  },

  view: (state) => {
    return state.view;
  },

  prices: (state) => {
    return state.prices;
  },

  stocks: (state) => {
    return state.stocks;
  },

  selectedPrice: (state) => {
    return state.selectedPrice;
  },

  stockForSelectedPrice: (state) => {
    if (!state.selectedPrice) {
      return null;
    }
    let stock = _.find(state.stocks, {
      supplier_id: state.selectedPrice.supplier_id,
    });
    return stock;
  },
};

export const actions = {
  loadProduct({ commit, dispatch }, id) {
    commit("START_LOADING");
    commit("SET_ERRORS", []);
    commit("SET_DOCUMENTS", []);
    commit("SET_DETAILS", []);
    commit("SET_PRICES", []);
    commit("SET_STOCKS", []);
    commit("SET_SELECTED_PRICE", null);
    commit("SET_VIEW", "view");
    commit("SET_PRODUCT", null);
    axios
      .get(window.API_BASE + "/products/" + id)
      .then((r) => {
        commit("STOP_LOADING");
        commit("SET_PRODUCT", r.data);
        dispatch("loadDocuments");
        dispatch("loadDetails");
        dispatch("loadPrices");
        dispatch("loadStocks");
      })
      .catch((e) => {
        commit("STOP_LOADING");
        this._vm.$message.error("Error loading order");
        console.log(e);

        let errors;
        if (e.response && e.response.data && typeof e.response.data === "object") {
          errors = _.flatten(_.toArray(e.response.data.errors));
        } else {
          errors = ["Something went wrong. Please try again."];
        }
        commit("SET_ERRORS", errors);
      });
  },

  loadPrices({ commit, getters }) {
    let product = getters.product;
    let productId = product["id"] ? product["id"] : product["_id"];

    commit("START_LOADING_PRICES");
    axios
      .get(window.API_BASE + "/products/" + productId + "/prices")
      .then((r) => {
        let prices = r.data;
        commit("STOP_LOADING_PRICES");
        commit("SET_PRICES", prices);

        let cheapestPrice = _.first(_.orderBy(prices, "price"));
        if (cheapestPrice) {
          commit("SET_SELECTED_PRICE", cheapestPrice);
        }
      })
      .catch((e) => {
        commit("STOP_LOADING_PRICES");
        this._vm.$message.error("Error loading prices");
        console.log(e);
      });
  },

  loadStocks({ commit, getters }) {
    let product = getters.product;
    let productId = product["id"] ? product["id"] : product["_id"];

    commit("START_LOADING_STOCKS");
    axios
      .get(window.API_BASE + "/products/" + productId + "/stocks")
      .then((r) => {
        let stocks = r.data;
        commit("STOP_LOADING_STOCKS");
        commit("SET_STOCKS", stocks);
      })
      .catch((e) => {
        commit("STOP_LOADING_STOCKS");
        this._vm.$message.error("Error loading stocks");
        console.log(e);
      });
  },

  loadDocuments({ commit, getters }) {
    let product = getters.product;
    let productCode = product["productCode"];

    commit("START_LOADING_DOCUMENTS");
    axios
      .get(window.API_BASE + "/products/" + productCode + "/documents")
      .then((r) => {
        commit("STOP_LOADING_DOCUMENTS");
        commit("SET_DOCUMENTS", r.data);
      })
      .catch((e) => {
        commit("STOP_LOADING_DOCUMENTS");
        this._vm.$message.error("Error loading documents");
        console.log(e);
      });
  },

  loadDetails({ commit, getters }) {
    let product = getters.product;

    commit("START_LOADING_DETAILS");
    commit("SET_DETAILS", []);
    axios
      .get(window.API_BASE + "/products/" + product["_id"] + "/details")
      .then((r) => {
        commit("STOP_LOADING_DETAILS");
        commit("SET_DETAILS", r.data);
      })
      .catch((e) => {
        commit("STOP_LOADING_DETAILS");
        this._vm.$message.error("Error loading details");
        console.log(e);
      });
  },

  setView({ commit }, view) {
    commit("SET_VIEW", view);
  },

  selectPrice({ commit }, price) {
    commit("SET_SELECTED_PRICE", price);
  },
};
