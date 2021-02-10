import axios from 'axios';
let _ = require('lodash');
import router from "../../router";

export const state = {
    isLoading: false,
    serverErrors: [],

    apiToken: null,
    user: null
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
    }
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
};

export const actions = {
   attemptLogin({commit}, params) {
      commit('START_LOADING');
        axios.post(window.API_TOKEN_URL, {
           'email': params.email,
           'password': params.password,
           'device_name': 'Browser login'
        }).then(r => {
            commit('STOP_LOADING');
            commit('SET_API_TOKEN', r.data.token);
            commit('SET_USER', r.data.user);
            router.push(params.to ? params.to : '/');
        }).catch(e => {
           commit('STOP_LOADING');
            this._vm.$message.error('Invalid email/password combination');

            let errors;
            if (typeof e.response.data === 'object') {
                errors = _.flatten(_.toArray(e.response.data.errors));
            } else {
                errors = ['Something went wrong. Please try again.'];
            }
            commit('SET_ERRORS', errors);
        });
   }
};
