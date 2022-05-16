import axios from "axios";

let _ = require("lodash");

export const state = {
  isLoading: false,
  isSaving: false,

  serverErrors: [],

  project: null,
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

  SET_PROJECT(state, project) {
    state.project = project;
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

  project: (state) => {
    return state.project;
  },
};

export const actions = {
  loadProject({ commit }, id) {
    commit("START_LOADING");
    commit("SET_PROJECT", null);
    axios
      .get(window.API_BASE + "/projects/" + id)
      .then((r) => {
        commit("STOP_LOADING");
        commit("SET_PROJECT", r.data);
      })
      .catch((e) => {
        commit("STOP_LOADING");
        this._vm.$message.error("Error loading project");

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
