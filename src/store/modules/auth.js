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
    success({ commit }, message) {
        commit('success', message);
    },
    error({ commit }, message) {
        commit('error', message);
    },
    clear({ commit }) {
        commit('clear');
    }
};
