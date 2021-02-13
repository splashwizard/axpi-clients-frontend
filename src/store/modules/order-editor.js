import axios from 'axios';

let _ = require('lodash');
// import router from "../../router";

export const state = {
    isLoading: false,
    isSaving: false,

    serverErrors: [],

    order: null,
    wizardStage: 0
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

    SET_ORDER(state, order) {
        state.order = order;
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
    }
};

export const actions = {
    loadOrder({commit}, id) {
        commit('START_LOADING');
        axios.get(window.API_BASE + '/orders/' + id).then(r => {
            commit('STOP_LOADING');
            commit('SET_ORDER', r.data);
        }).catch(e => {
            commit('STOP_LOADING');
            this._vm.$message.error('Error loading order');

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
    }
};
