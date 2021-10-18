import axios from 'axios';

let _ = require('lodash');
// import router from "../../router";

export const state = {
    isLoading: false,
    product: null,
    serverErrors: []
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
    }
};

export const getters = {
    isLoading: (state) => {
        return state.isLoading;
    },

    product: (state) => {
        return state.product;
    },

    serverErrors: (state) => {
        return state.serverErrors;
    }
};

export const actions = {
    loadProduct({commit}, id) {
        commit('START_LOADING');
        commit('SET_ERRORS', []);
        axios.get(window.API_BASE + '/products/' + id).then(r => {
            commit('STOP_LOADING');
            commit('SET_PRODUCT', r.data);
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
    }
};
