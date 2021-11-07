import axios from 'axios';

const _ = require('lodash');

export const state = {
    searchResults: [],
    basket: [],
    isLoading: false,
    searchQuery: '',
    tablePagination: {},
    enriched: [],
    displayMode: 'specs'
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

    SET_TABLE_PAGINATION(state, pagination) {
        state.tablePagination = pagination;
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
            name: product.name,
            product: product,
            quantity: 1
        });
    },

    ADD_PAST_ORDER_TO_BASKET(state, order) {
       state.basket.push({
           itemType: 'order',
           id: order['id'],
           name: order['product_name'],
           order: order,
           quantity: 1
       });
    },

    ADD_SPECIFICATION_TO_BASKET(state, spec) {
        state.basket.push({
            itemType: 'specification',
            id: spec['id'],
            name: spec['product_name'],
            specification: spec,
            quantity: 1
        });
    },

    UPDATE_SPECIFICATION_IN_BASKET(state, spec) {
        state.basket = _.map(state.basket, item => {
            if (
                item.itemType === 'specification'
                && item.id === spec.id
            ) {
                item['name'] = spec.product_name;
                item['specification']['product_name'] = spec.product_name;
                return item;
            }
            return item;
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

    INCREMENT_PAST_ORDER_QUANTITY(state, order) {
        let p = _.find(state.basket, item => {
            return (
                item.itemType === 'order'
                && item.id === order['id']
            );
        });
        p.quantity++;
    },

    DECREMENT_PAST_ORDER_QUANTITY(state, order) {
        let p = _.find(state.basket, item => {
            return (
                item.itemType === 'order'
                && item.id === order['id']
            );
        });
        p.quantity--;
        if (p.quantity < 1) {
            state.basket = _.without(state.basket, p);
        }
    },

    INCREMENT_SPECIFICATION_QUANTITY(state, spec) {
        let p = _.find(state.basket, item => {
            return (
                item.itemType === 'specification'
                && item.id === spec['id']
            );
        });
        p.quantity++;
    },

    DECREMENT_SPECIFICATION_QUANTITY(state, spec) {
        let p = _.find(state.basket, item => {
            return (
                item.itemType === 'specification'
                && item.id === spec['id']
            );
        });
        p.quantity--;
        if (p.quantity < 1) {
            state.basket = _.without(state.basket, p);
        }
    },

    SET_ENRICHED(state, enriched) {
        state.enriched = enriched;
    },

    SET_DISPLAY_MODE(state, displayMode) {
        state.displayMode = displayMode;
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
    tablePagination: (state) => {
        return state.tablePagination;
    },
    enriched: (state) => {
        return state.enriched;
    },
    displayMode: (state) => {
        return state.displayMode;
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
            commit('SET_TABLE_PAGINATION', pagination);
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

    setTablePagination({commit}, pagination) {
        commit('SET_TABLE_PAGINATION', pagination);
    },

    addPastOrderToBasket({commit}, order) {
        commit('ADD_PAST_ORDER_TO_BASKET', order);
    },

    addSpecificationToBasket({commit}, spec) {
        commit('ADD_SPECIFICATION_TO_BASKET', spec);
    },

    updateSpecificationInBasket({commit}, spec) {
       commit('UPDATE_SPECIFICATION_IN_BASKET', spec);
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

    incrementPastOrderQuantity({commit}, product) {
        commit('INCREMENT_PAST_ORDER_QUANTITY', product);
    },

    decrementPastOrderQuantity({commit}, product) {
        commit('DECREMENT_PAST_ORDER_QUANTITY', product);
    },

    incrementSpecificationQuantity({commit}, product) {
        commit('INCREMENT_SPECIFICATION_QUANTITY', product);
    },

    decrementSpecificationQuantity({commit}, product) {
        commit('DECREMENT_SPECIFICATION_QUANTITY', product);
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
    },

    setDisplayMode({commit}, displayMode) {
        commit('SET_DISPLAY_MODE', displayMode);
    }
};