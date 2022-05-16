import axios from "axios";
import eventBus from "../../event-bus";

let _ = require("lodash");
// import router from "../../router";

export const state = {
  isLoading: false,
  serverErrors: [],
  selectedErpOrder: null,

  isLoadingSuggestedMatches: false,
  suggestedMatches: [],

  selectedMatches: [],
  isSaving: false,

  reloadKey: 1,

  matchSelectedReloadKey: 1,
  sidebarReloadKey: 1,

  orderUpdatedReloadKey: 1,
};

export const mutations = {
  START_LOADING(state) {
    state.isLoading = true;
  },

  STOP_LOADING(state) {
    state.isLoading = false;
  },

  SET_ERRORS(state, errors) {
    state.serverErrors = errors;
  },

  SET_SELECTED_ERP_ORDER(state, order) {
    state.selectedErpOrder = order;
  },

  START_LOADING_SUGGESTED_MATCHES(state) {
    state.isLoadingSuggestedMatches = true;
  },

  STOP_LOADING_SUGGESTED_MATCHES(state) {
    state.isLoadingSuggestedMatches = false;
  },

  SET_SUGGESTED_MATCHES(state, matches) {
    state.suggestedMatches = matches;
  },

  TOGGLE_MATCH_SELECTED(state, match) {
    state.selectedMatches = _.xor(state.selectedMatches, [match]);
  },

  START_SAVING(state) {
    state.isSaving = true;
  },

  STOP_SAVING(state) {
    state.isSaving = false;
  },

  INCREMENT_RELOAD_KEY(state) {
    state.reloadKey += 1;
  },

  INCREMENT_MATCH_SELECTED_RELOAD_KEY(state) {
    state.matchSelectedReloadKey += 1;
  },

  SET_SELECTED_MATCHES(state, matches) {
    state.selectedMatches = matches;
  },

  INCREMENT_SIDEBAR_RELOAD_KEY(state) {
    state.sidebarReloadKey += 1;
  },

  INCREMENT_ORDER_UPDATED_RELOAD_KEY(state) {
    state.orderUpdatedReloadKey += 1;
  },
};

export const getters = {
  isLoading: (state) => {
    return state.isLoading;
  },

  selectedErpOrder: (state) => {
    return state.selectedErpOrder;
  },

  selectedMatches: (state) => {
    return state.selectedMatches;
  },

  matchesSelectedManually: (state) => {
    let idsOfSuggestedMatches = _.map(state.suggestedMatches, "_id");
    return _.difference(state.selectedMatches, idsOfSuggestedMatches);
  },

  matchesSelectedFromSuggestions: (state) => {
    let idsOfSuggestedMatches = _.map(state.suggestedMatches, "_id");
    return _.intersection(state.selectedMatches, idsOfSuggestedMatches);
  },

  isLoadingSuggestedMatches: (state) => {
    return state.isLoadingSuggestedMatches;
  },

  suggestedMatches: (state) => {
    return state.suggestedMatches;
  },

  isSaving: (state) => {
    return state.isSaving;
  },

  reloadKey: (state) => {
    return state.reloadKey;
  },

  matchSelectedReloadKey: (state) => {
    return state.matchSelectedReloadKey;
  },

  sidebarReloadKey: (state) => {
    return state.sidebarReloadKey;
  },

  orderUpdatedReloadKey: (state) => {
    return state.orderUpdatedReloadKey;
  },
};

export const actions = {
  selectErpOrder({ commit, dispatch }, order) {
    commit("SET_SELECTED_ERP_ORDER", order);
    commit("INCREMENT_SIDEBAR_RELOAD_KEY");
    if (order.matches && order.matches.length) {
      commit("SET_SELECTED_MATCHES", order.matches);
    } else {
      commit("SET_SELECTED_MATCHES", []);
    }
    dispatch("loadSuggestedMatches");
  },

  loadSuggestedMatches({ commit, getters }) {
    commit("SET_SUGGESTED_MATCHES", []);
    commit("START_LOADING_SUGGESTED_MATCHES");
    axios
      .post(window.API_BASE + "/matcher/suggest-matches", {
        order_id: getters.selectedErpOrder["id"],
      })
      .then((r) => {
        commit("STOP_LOADING_SUGGESTED_MATCHES");
        commit("SET_SUGGESTED_MATCHES", r.data);
      })
      .catch((e) => {
        console.log(e);
        commit("STOP_LOADING_SUGGESTED_MATCHES");
        commit("SET_SUGGESTED_MATCHES", []);

        this._vm.$message.error("Error loading suggested matches");

        let errors;
        if (typeof e.response.data === "object") {
          errors = _.flatten(_.toArray(e.response.data.errors));
        } else {
          errors = ["Something went wrong. Please try again."];
        }
        commit("SET_ERRORS", errors);
      });
  },

  setSelectedMatches({ commit }, matches) {
    commit("SET_SELECTED_MATCHES", matches);
    commit("INCREMENT_MATCH_SELECTED_RELOAD_KEY");
  },

  toggleMatchSelected({ commit }, match) {
    commit("TOGGLE_MATCH_SELECTED", match);
    commit("INCREMENT_MATCH_SELECTED_RELOAD_KEY");
  },

  incrementOrderUpdatedReloadKey({ commit }) {
    commit("INCREMENT_ORDER_UPDATED_RELOAD_KEY");
  },

  saveMatches({ commit, getters }) {
    commit("START_SAVING");
    let params = {
      order_id: getters.selectedErpOrder["id"],
      matches: getters.selectedMatches,
      matches_selected_from_suggestion: getters.matchesSelectedFromSuggestions,
      matches_selected_manually: getters.matchesSelectedManually,
    };
    axios
      .post(window.API_BASE + "/matcher/save-matches", params)
      .then(() => {
        commit("STOP_SAVING");
        commit("INCREMENT_RELOAD_KEY");
        this._vm.$message.success("Match saved successfully");
        eventBus.$emit("order-matched", params);
        commit("SET_SELECTED_ERP_ORDER", null);
      })
      .catch((e) => {
        console.log(e);
        commit("STOP_SAVING");

        this._vm.$message.error("Error saving matches");

        let errors;
        if (typeof e.response.data === "object") {
          errors = _.flatten(_.toArray(e.response.data.errors));
        } else {
          errors = ["Something went wrong. Please try again."];
        }
        commit("SET_ERRORS", errors);
      });
  },
};
