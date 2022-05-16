import axios from "axios";

let _ = require("lodash");
import router from "../../router";

export const state = {
  isLoading: false,
  serverErrors: [],

  apiToken: null,
  user: null,

  selectedOrganisationalUnit: null,
};

export const mutations = {
  START_LOADING(state) {
    state.isLoading = true;
  },

  STOP_LOADING(state) {
    state.isLoading = false;
  },

  SET_API_TOKEN(state, token) {
    state.apiToken = token;
  },

  SET_USER(state, user) {
    state.user = user;
  },

  SET_ERRORS(state, errors) {
    state.serverErrors = errors;
  },

  SET_ORGANISATIONAL_UNIT(state, orgUnit) {
    state.selectedOrganisationalUnit = orgUnit;
  },
};

export const getters = {
  isLoading: (state) => {
    return state.isLoading;
  },

  apiToken: (state) => {
    return state.apiToken;
  },

  user: (state) => {
    return state.user;
  },

  loggedIn: (state) => {
    return state.apiToken !== null;
  },

  organisationalUnits: (state) => {
    return state.user ? state.user.organisational_units : [];
  },

  selectedOrganisationalUnit: (state) => {
    return state.selectedOrganisationalUnit;
  },

  canEditProducts: (state) => {
    if (state.user && state.user.can_edit_products) {
      return Boolean(state.user.can_edit_products);
    }

    return false;
  },
};

export const actions = {
  attemptLogin({ commit }, params) {
    commit("START_LOADING");
    axios
      .post(window.API_TOKEN_URL, {
        email: params.email,
        password: params.password,
        device_name: "Browser login",
        user_type: "client",
      })
      .then((r) => {
        commit("STOP_LOADING");
        commit("SET_API_TOKEN", r.data.token);
        commit("SET_USER", r.data.user);
        commit("SET_ORGANISATIONAL_UNIT", _.first(r.data.user.organisational_units));
        router.push(params.to ? params.to : "/");
      })
      .catch((e) => {
        commit("STOP_LOADING");
        this._vm.$message.error("Invalid email/password combination");

        let errors;
        if (typeof e.response.data === "object") {
          errors = _.flatten(_.toArray(e.response.data.errors));
        } else {
          errors = ["Something went wrong. Please try again."];
        }
        commit("SET_ERRORS", errors);
      });
  },

  logout({ commit }) {
    commit("SET_API_TOKEN", null);
    commit("SET_USER", null);
    localStorage.removeItem("axpi-frontend-auth");
    router.push("/login");
    this._vm.$message.success("Logged out successfully");
  },

  selectOrganisationalUnit({ commit }, orgUnit) {
    commit("SET_ORGANISATIONAL_UNIT", orgUnit);
  },
};
