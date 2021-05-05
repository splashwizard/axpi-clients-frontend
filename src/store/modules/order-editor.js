import axios from 'axios';
import orders from "../../helpers/orders";

let _ = require('lodash');
// import router from "../../router";

export const state = {
    isLoading: false,
    isSaving: false,

    serverErrors: [],

    order: null,
    wizardStage: 0,

    reloadOrdersKey: 1
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
    }
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

    wizardStage: (state) => {
        return state.wizardStage;
    },

    reloadOrdersKey: (state) => {
        return state.reloadOrdersKey;
    }
};

export const actions = {
    createOrder({commit, dispatch}) {
       commit('START_LOADING');
        commit('SET_ERRORS', []);
        axios.post(window.API_BASE + '/orders/').then(r => {
           commit('STOP_LOADING');
            commit('INCREMENT_RELOAD_ORDERS_KEY');
            // commit('SET_ORDER', orders.decodeOrder(r.data));
           dispatch('loadOrder', r.data.id);
       }).catch(e => {
           commit('STOP_LOADING');
           this._vm.$message.error('Error creating order');

           let errors;
           if (typeof e.response.data === 'object') {
               errors = _.flatten(_.toArray(e.response.data.errors));
           } else {
               errors = ['Something went wrong. Please try again.'];
           }
           commit('SET_ERRORS', errors);
       });
    },

    loadOrder({commit}, id) {
        commit('START_LOADING');
        commit('SET_ERRORS', []);
        axios.get(window.API_BASE + '/orders/' + id).then(r => {
            commit('STOP_LOADING');
            commit('SET_ORDER', orders.decodeOrder(r.data));
           commit('SET_WIZARD_STAGE', 0);
        }).catch(e => {
            commit('STOP_LOADING');
            this._vm.$message.error('Error loading order');
            console.log(e);

            let errors;
            if (e.response && e.response.data && typeof e.response.data === 'object') {
                errors = _.flatten(_.toArray(e.response.data.errors));
            } else {
                errors = ['Something went wrong. Please try again.'];
            }
            commit('SET_ERRORS', errors);
        });
    },

    saveOrder({commit}, params) {
        const {order, quitAfterSave} = params;

        commit('START_SAVING');
        commit('SET_ERRORS', []);
        axios.put(window.API_BASE + '/orders/' + order.id, orders.encodeOrder(order)).then(() => {
            commit('STOP_SAVING');
            if (quitAfterSave === true) {
                commit('SET_ORDER', null)
            }
            this._vm.$message.success('Order saved successfully!');
            commit('INCREMENT_RELOAD_ORDERS_KEY');
        }).catch(e => {
            commit('STOP_SAVING');
            this._vm.$message.error('Error saving order');

            let errors;
            if (typeof e.response.data === 'object') {
                errors = _.flatten(_.toArray(e.response.data.errors));
            } else {
                errors = ['Something went wrong. Please try again.'];
            }
            commit('SET_ERRORS', errors);
        });
    },

    cancelOrderEdit({commit}) {
        commit('SET_ORDER', null);
    },

    setWizardStage({commit}, stage) {
        commit('SET_WIZARD_STAGE', stage);
    },

    goToNextStage({commit}) {
        commit('INCREMENT_WIZARD_STAGE');
    },

    goToPreviousStage({commit}) {
        commit('DECREMENT_WIZARD_STAGE');
    },

    incrementReloadOrdersKey({commit}) {
        commit('INCREMENT_RELOAD_ORDERS_KEY');
    }
};
