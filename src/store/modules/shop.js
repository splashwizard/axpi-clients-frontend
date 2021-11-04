import axios from 'axios';

const _ = require('lodash');

export const state = {
    searchResults: [],
    basket: [],
    isLoading: false,
    searchQuery: '',
    pagination: {},
    enriched: []
};

export const mutations = {
    SET_SEARCH_RESULTS(state, results) {
        state.searchResults = results;
    },

    START_LOADING(state) {
        state.isLoading = true;
    },

    STOP_LOADING(state) {
        state.isLoading = false;
    },

    SET_PAGINATION(state, pagination) {
        state.pagination = pagination;
    },

    SET_BASKET(state) {
        state.basket = [];
    },

    SET_SEARCH_QUERY(state, query) {
        state.searchQuery = query;
    },

    ADD_PRODUCT_TO_BASKET(state, product) {
        state.basket.push({
            itemType: 'product',
            id: product['_id'],
            product: product,
            quantity: 1
        });
    },

    INCREMENT_PRODUCT_QUANTITY(state, product) {
        let p = _.find(state.basket, item => {
            return (
                item.itemType === 'product'
                && item.id === product['_id']
            );
        });
        p.quantity++;
    },

    DECREMENT_PRODUCT_QUANTITY(state, product) {
        let p = _.find(state.basket, item => {
            return (
                item.itemType === 'product'
                && item.id === product['_id']
            );
        });
        p.quantity--;
        if (p.quantity < 1) {
            state.basket = _.without(state.basket, p);
        }
    },

    SET_ENRICHED(state, enriched) {
        state.enriched = enriched;
    }
};

export const getters = {
    searchResults: (state) => {
        return state.searchResults;
    },
    isLoading: (state) => {
        return state.isLoading;
    },
    basket: (state) => {
        return state.basket;
    },
    searchQuery: (state) => {
        return state.searchQuery;
    },
    pagination: (state) => {
        return state.pagination;
    },
    enriched: (state) => {
        return state.enriched;
    }
};

export const actions = {
    search({commit, getters, dispatch}, params) {
        commit('START_LOADING');
        axios.post(window.API_BASE + '/products/search', {
            q: getters.searchQuery,
            results_per_page: 10,
            page: 1,
            ...params
        }).then(r => {
            commit('SET_SEARCH_RESULTS', r.data);
            const pagination = {...getters.pagination};
            pagination.total = r.data.total;
            commit('SET_PAGINATION', pagination);
            commit('STOP_LOADING');
            if (r.data.data.length) {
                dispatch('enrich');
            }
        }).catch(e => {
            console.log(e);
            this._vm.$message.error('Error searching products');
        });
    },

    setSearchQuery({commit}, query) {
        commit('SET_SEARCH_QUERY', query);
    },

    setPagination({commit}, pagination) {
        commit('SET_PAGINATION', pagination);
    },

    addProductToBasket({commit}, product) {
        commit('ADD_PRODUCT_TO_BASKET', product);
    },

    incrementProductQuantity({commit}, product) {
        commit('INCREMENT_PRODUCT_QUANTITY', product);
    },

    decrementProductQuantity({commit}, product) {
        commit('DECREMENT_PRODUCT_QUANTITY', product);
    },

    enrich({commit, getters}) {
        let vm = this;
        commit('START_LOADING');
        axios.post(window.API_BASE + '/products/enrich-many', {
            ids: _.map(getters.searchResults.data, '_id')
        }).then(r => {
            commit('STOP_LOADING');
            commit('SET_ENRICHED', r.data);
        }).catch(e => {
            console.log(e);
            commit('STOP_LOADING');
            vm._vm.$message.error('Error enriching product data');
        });
    }
};