import axios from "axios";

let _ = require("lodash");
// import router from "../../router";

export const state = {
  isLoading: false,
  isSaving: false,

  serverErrors: [],

  optimisation: null,
};

export const mutations = {
  START_LOADING(state) {
    state.isLoading = true;
  },

  STOP_LOADING(state) {
    state.isLoading = false;
  },

  START_SAVING(state) {
    state.isSaving = true;
  },

  STOP_SAVING(state) {
    state.isSaving = false;
  },

  SET_ERRORS(state, errors) {
    state.serverErrors = errors;
  },

  SET_OPTIMISATION(state, optimisation) {
    state.optimisation = optimisation;
  },
};

export const getters = {
  isLoading: (state) => {
    return state.isLoading;
  },

  isSaving: (state) => {
    return state.isSaving;
  },

  serverErrors: (state) => {
    return state.serverErrors;
  },

  optimisation: (state) => {
    return state.optimisation;
  },

  wizardStage: (state) => {
    return state.wizardStage;
  },
};

export const actions = {
  loadOptimisation({ commit }, id) {
    commit("START_LOADING");
    commit("SET_OPTIMISATION", null);
    axios
      .get(window.API_BASE + "/optimisations/" + id)
      .then((r) => {
        commit("STOP_LOADING");
        commit("SET_OPTIMISATION", r.data);
      })
      .catch((e) => {
        commit("STOP_LOADING");
        this._vm.$message.error("Error loading optimisation");

        let errors;
        if (typeof e.response.data === "object") {
          errors = _.flatten(_.toArray(e.response.data.errors));
        } else {
          errors = ["Something went wrong. Please try again."];
        }
        commit("SET_ERRORS", errors);
      });
  },

  cancelOptimisationEdit({ commit }) {
    commit("SET_OPTIMISATION", null);
  },
};
