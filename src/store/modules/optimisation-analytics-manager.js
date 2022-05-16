import axios from "axios";

let _ = require("lodash");

export const state = {
  isLoadingFilters: false,
  serverErrors: [],

  filters: null,

  filterBySupplier: false,
  filterBySpecification: false,

  selectedSupplier: null,
  selectedSpecification: null,
};

export const mutations = {
  START_LOADING_FILTERS(state) {
    state.isLoadingFilters = true;
  },

  STOP_LOADING_FILTERS(state) {
    state.isLoadingFilters = false;
  },

  SET_ERRORS(state, errors) {
    state.serverErrors = errors;
  },

  CLEAR_ERRORS(state) {
    state.serverErrors = [];
  },

  SET_FILTERS(state, filters) {
    state.filters = filters;
  },

  SET_FILTER_BY_SUPPLIER(state, filterBySupplier) {
    state.filterBySupplier = filterBySupplier;
  },

  SET_FILTER_BY_SPECIFICATION(state, filterBySpecification) {
    state.filterBySpecification = filterBySpecification;
  },

  SET_SELECTED_SUPPLIER(state, supplier) {
    state.selectedSupplier = supplier;
  },

  SET_SELECTED_SPECIFICATION(state, specification) {
    state.selectedSpecification = specification;
  },
};

export const getters = {
  isLoadingFilters: (state) => {
    return state.isLoadingFilters;
  },

  filters: (state) => {
    return state.filters;
  },

  filterBySupplier: (state) => {
    return state.filterBySupplier;
  },

  filterBySpecification: (state) => {
    return state.filterBySpecification;
  },

  suppliers: (state) => {
    return state.filters ? state.filters.suppliers : [];
  },

  optimisationSpecifications: (state) => {
    return state.filters ? state.filters.optimisation_specifications : [];
  },

  selectedSupplier: (state) => {
    return state.selectedSupplier;
  },

  selectedSpecification: (state) => {
    return state.selectedSpecification;
  },
};

export const actions = {
  loadFilters({ commit }, optimisationId) {
    commit("START_LOADING_FILTERS");
    commit("CLEAR_ERRORS");
    axios
      .get(window.API_BASE + "/optimisations/" + optimisationId + "/get-filters")
      .then((r) => {
        commit("STOP_LOADING_FILTERS");
        commit("SET_FILTERS", r.data);
      })
      .catch((e) => {
        commit("STOP_LOADING_FILTERS");
        this._vm.$message.error("Error loading filters");

        let errors;
        if (typeof e.response.data === "object") {
          errors = _.flatten(_.toArray(e.response.data.errors));
        } else {
          errors = ["Something went wrong. Please try again."];
        }
        commit("SET_ERRORS", errors);
      });
  },

  setFilterBySupplier({ commit }, filterBySupplier) {
    commit("SET_FILTER_BY_SUPPLIER", filterBySupplier);
  },

  setFilterBySpecification({ commit }, filterBySpecification) {
    commit("SET_FILTER_BY_SPECIFICATION", filterBySpecification);
  },

  setSelectedSupplier({ commit }, supplier) {
    commit("SET_SELECTED_SUPPLIER", supplier);
  },

  setSelectedSpecification({ commit }, specification) {
    commit("SET_SELECTED_SPECIFICATION", specification);
  },
};
