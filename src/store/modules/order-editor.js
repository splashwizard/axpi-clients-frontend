import axios from "axios";
import orders from "../../helpers/orders";
import validator from "../../helpers/validator";
import eventBus from "../../event-bus";
let _ = require("lodash");
// import router from "../../router";

export const state = {
  isLoading: false,
  isSaving: false,

  serverErrors: [],

  type: "order",
  order: null,
  wizardStage: 0,

  reloadOrdersKey: 1,

  validationErrors: [],
  isValidating: false,
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

  SET_TYPE(state, type) {
    state.type = type;
  },

  SET_WIZARD_STAGE(state, stage) {
    state.wizardStage = stage;
  },

  INCREMENT_WIZARD_STAGE(state) {
    state.wizardStage += 1;
  },

  DECREMENT_WIZARD_STAGE(state) {
    state.wizardStage -= 1;
  },

  SET_ORDER(state, order) {
    state.order = order;
  },

  INCREMENT_RELOAD_ORDERS_KEY(state) {
    state.reloadOrdersKey += 1;
  },

  START_VALIDATING(state) {
    state.isValidating = true;
  },

  STOP_VALIDATING(state) {
    state.isValidating = false;
  },

  SET_VALIDATION_ERRORS(state, errors) {
    state.validationErrors = errors;
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

  order: (state) => {
    return state.order;
  },

  type: (state) => {
    return state.type;
  },

  wizardStage: (state) => {
    return state.wizardStage;
  },

  reloadOrdersKey: (state) => {
    return state.reloadOrdersKey;
  },

  isValidating: (state) => {
    return state.isValidating;
  },

  validationErrors: (state) => {
    return state.validationErrors;
  },

  validationClean: (state) => {
    return !state.validationErrors || state.validationErrors.length === 0;
  },
};

export const actions = {
  createOrder({ commit, dispatch }) {
    commit("START_LOADING");
    commit("SET_ERRORS", []);
    axios
      .post(window.API_BASE + "/orders/")
      .then((r) => {
        commit("STOP_LOADING");
        commit("INCREMENT_RELOAD_ORDERS_KEY");
        dispatch("loadOrder", r.data.id);
      })
      .catch((e) => {
        commit("STOP_LOADING");
        this._vm.$message.error("Error creating order");

        let errors;
        if (typeof e.response.data === "object") {
          errors = _.flatten(_.toArray(e.response.data.errors));
        } else {
          errors = ["Something went wrong. Please try again."];
        }
        commit("SET_ERRORS", errors);
      });
  },

  createSpecification({ commit, dispatch }) {
    commit("START_LOADING");
    commit("SET_ERRORS", []);
    axios
      .post(window.API_BASE + "/specifications/")
      .then((r) => {
        commit("STOP_LOADING");
        commit("INCREMENT_RELOAD_ORDERS_KEY");
        // commit('SET_ORDER', orders.decodeOrder(r.data));
        dispatch("loadSpecification", r.data.id);
      })
      .catch((e) => {
        commit("STOP_LOADING");
        this._vm.$message.error("Error creating specification");

        let errors;
        if (typeof e.response.data === "object") {
          errors = _.flatten(_.toArray(e.response.data.errors));
        } else {
          errors = ["Something went wrong. Please try again."];
        }
        commit("SET_ERRORS", errors);
      });
  },

  loadOrder({ commit, dispatch, getters }, id) {
    commit("SET_TYPE", "order");
    commit("START_LOADING");
    commit("SET_ERRORS", []);
    commit("SET_VALIDATION_ERRORS", []);
    axios
      .get(window.API_BASE + "/orders/" + id)
      .then((r) => {
        commit("STOP_LOADING");
        commit("SET_ORDER", orders.decodeOrder(r.data));
        commit("SET_WIZARD_STAGE", 0);

        if (getters.order.product_name !== "Untitled") {
          dispatch("validateOrder", id);
        }
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

  validateOrder({ commit }, id) {
    commit("START_VALIDATING");
    commit("SET_VALIDATION_ERRORS", []);
    validator
      .validateOrder(id)
      .then((errors) => {
        commit("STOP_VALIDATING");
        commit("SET_VALIDATION_ERRORS", errors);
      })
      .catch((e) => {
        commit("STOP_VALIDATING");
        this._vm.$message.error("Error validating order");
        console.log(e);
      });
  },

  loadSpecification({ commit }, id) {
    commit("SET_TYPE", "specification");
    commit("START_LOADING");
    commit("SET_ERRORS", []);
    axios
      .get(window.API_BASE + "/specifications/" + id)
      .then((r) => {
        commit("STOP_LOADING");
        commit("SET_ORDER", orders.decodeOrder(r.data));
        commit("SET_WIZARD_STAGE", 0);
      })
      .catch((e) => {
        commit("STOP_LOADING");
        this._vm.$message.error("Error loading specification");
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

  loadOptimisationSpecification({ commit }, params) {
    const { optimisationId, id } = params;

    commit("SET_TYPE", "optimisation-specification");
    commit("START_LOADING");
    commit("SET_ERRORS", []);
    axios
      .get(window.API_BASE + "/optimisations/" + optimisationId + "/specifications/" + id)
      .then((r) => {
        commit("STOP_LOADING");
        commit("SET_ORDER", orders.decodeOrder(r.data));
        commit("SET_WIZARD_STAGE", 0);
      })
      .catch((e) => {
        commit("STOP_LOADING");
        this._vm.$message.error("Error loading specification");
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

  saveOrder({ commit, getters, dispatch }, params) {
    const { order, quitAfterSave } = params;

    let resource;
    if (getters.type === "order") {
      resource = window.API_BASE + "/orders/" + order.id;
    } else if (getters.type === "specification") {
      resource = window.API_BASE + "/specifications/" + order.id;
    } else if (getters.type === "optimisation-specification") {
      resource = window.API_BASE + "/optimisations/" + getters.order.optimisation_id + "/specifications/" + order.id;
    }

    commit("START_SAVING");
    commit("SET_ERRORS", []);
    axios
      .put(resource, orders.encodeOrder(order))
      .then(() => {
        if (getters.type === "specification") {
          eventBus.$emit("specification-updated", {
            id: order.id,
            product_name: order.product_name,
          });
        }
        if (getters.type === "order") {
          eventBus.$emit("order-updated", {
            id: order.id,
            product_name: order.product_name,
          });
        }

        commit("STOP_SAVING");
        if (quitAfterSave === true) {
          commit("SET_ORDER", null);
        } else {
          dispatch("validateOrder", order.id);
        }

        if (getters.type === "order") {
          this._vm.$message.success("Order saved successfully!");
          dispatch("matcher/incrementOrderUpdatedReloadKey", {}, { root: true });
        } else if (getters.type === "specification") {
          this._vm.$message.success("Specification saved successfully!");
        } else if (getters.type === "optimisation-specification") {
          this._vm.$message.success("Specification saved successfully!");
        }

        commit("INCREMENT_RELOAD_ORDERS_KEY");
      })
      .catch((e) => {
        commit("STOP_SAVING");

        if (getters.type === "order") {
          this._vm.$message.error("Error saving order");
        } else if (getters.type === "specification") {
          this._vm.$message.error("Error saving specification");
        } else if (getters.type === "optimisation-specification") {
          this._vm.$message.error("Error saving specification");
        }

        let errors;
        if (typeof e.response.data === "object") {
          errors = _.flatten(_.toArray(e.response.data.errors));
        } else {
          errors = ["Something went wrong. Please try again."];
        }
        commit("SET_ERRORS", errors);
      });
  },

  cancelOrderEdit({ commit }) {
    commit("SET_ORDER", null);
  },

  setType({ commit }, type) {
    commit("SET_TYPE", type);
  },

  setWizardStage({ commit }, stage) {
    commit("SET_WIZARD_STAGE", stage);
  },

  goToNextStage({ commit }) {
    commit("INCREMENT_WIZARD_STAGE");
  },

  goToPreviousStage({ commit }) {
    commit("DECREMENT_WIZARD_STAGE");
  },

  incrementReloadOrdersKey({ commit }) {
    commit("INCREMENT_RELOAD_ORDERS_KEY");
  },
};
