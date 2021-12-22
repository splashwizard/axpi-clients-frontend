import axios from 'axios';

const _ = require('lodash');

export const state = {
    searchResults: [],
    basket: [],
    isLoading: false,
    isEnriching: false,
    searchQuery: '',
    tablePagination: {},
    enriched: [],
    displayMode: 'prices',

    selectedAddress: null
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

    START_ENRICHING(state) {
        state.isEnriching = true;
    },

    STOP_ENRICHING(state) {
        state.isEnriching = false;
    },

    SET_TABLE_PAGINATION(state, pagination) {
        state.tablePagination = pagination;
    },

    SET_BASKET(state, basket) {
        state.basket = basket;
    },

    SET_SEARCH_QUERY(state, query) {
        state.searchQuery = query;
    },

    ADD_PRODUCT_TO_BASKET(state, params) {
        let {product, quantity, prices, selectedPrice} = params;

        let id = product['id'];
        if (!id) {
            id = product['_id'];
        }

        state.basket.push({
            itemType: 'product',
            id: id,
            name: product.name,
            product: product,
            quantity: quantity,
            prices: prices,
            selectedPrice: selectedPrice,
            selectedPriceId: selectedPrice.id
        });
    },

    ADD_PAST_ORDER_TO_BASKET(state, order) {
        let id = order['id'];
        if (!id) {
            id = order['_id'];
        }

        state.basket.push({
            itemType: 'order',
            id: id,
            name: order['product_name'],
            order: order,
            quantity: 1
        });
    },

    ADD_SPECIFICATION_TO_BASKET(state, spec) {
        let id = spec['id'];
        if (!id) {
            id = spec['_id'];
        }

        state.basket.push({
            itemType: 'specification',
            id: id,
            name: spec['product_name'],
            specification: spec,
            quantity: 1
        });
    },

    UPDATE_SPECIFICATION_IN_BASKET(state, spec) {
        let id = spec['id'];
        if (!id) {
            id = spec['_id'];
        }

        state.basket = _.map(state.basket, item => {
            if (
                item.itemType === 'specification'
                && item.id === id
            ) {
                item['name'] = spec.product_name;
                item['specification']['product_name'] = spec.product_name;
                return item;
            }
            return item;
        });
    },

    INCREMENT_PRODUCT_QUANTITY(state, params) {
       let {product, selectedPriceId} = params;

        let id = product['id'];
        if (!id) {
            id = product['_id'];
        }

        let p = _.find(state.basket, item => {
            return (
                item.itemType === 'product'
                && item.id === id
                && item.selectedPriceId === selectedPriceId
            );
        });
        p.quantity++;
    },

    DECREMENT_PRODUCT_QUANTITY(state, params) {
       let {product, selectedPriceId} = params;

        let id = product['id'];
        if (!id) {
            id = product['_id'];
        }

        let p = _.find(state.basket, item => {
            return (
                item.itemType === 'product'
                && item.id === id
                && item.selectedPriceId === selectedPriceId
            );
        });
        p.quantity--;
        if (p.quantity < 1) {
            state.basket = _.without(state.basket, p);
        }
    },

    SET_PRODUCT_QUANTITY(state, params) {
        let {id, selectedPriceId, quantity} = params;

        let p = _.find(state.basket, item => {
            return (
                item.itemType === 'product'
                && item.id === id
                && item.selectedPriceId === selectedPriceId
            );
        });
        p.quantity = quantity;
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

    SET_PAST_ORDER_QUANTITY(state, params) {
        let {id, quantity} = params;
        let p = _.find(state.basket, item => {
            return (
                item.itemType === 'order'
                && item.id === id
            );
        });
        p.quantity = quantity;
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

    SET_SPECIFICATION_QUANTITY(state, params) {
        let {id, quantity} = params;
        let p = _.find(state.basket, item => {
            return (
                item.itemType === 'specification'
                && item.id === id
            );
        });
        p.quantity = quantity;
        if (p.quantity < 1) {
            state.basket = _.without(state.basket, p);
        }
    },

    SET_ENRICHED(state, enriched) {
        state.enriched = enriched;
    },

    SET_DISPLAY_MODE(state, displayMode) {
        state.displayMode = displayMode;
    },

    SET_SELECTED_ADDRESS(state, address) {
        state.selectedAddress = address;
    },

    UPDATE_BASKET_SELECTED_PRICE(state, params) {
        let {selectedPrice, basketItem} = params;
        state.basket = _.map(state.basket, item => {
            if (
                basketItem.itemType === item.itemType
                && basketItem.id === item.id
                && basketItem.selectedPriceId === item.selectedPriceId
            ) {
               return {
                   ...item,
                   selectedPrice: selectedPrice,
                   selectedPriceId: selectedPrice.id
               }
            }
            return item;
        });

        // Merge similar matching prices

    }
};

export const getters = {
    searchResults: (state) => {
        return state.searchResults;
    },
    isLoading: (state) => {
        return state.isLoading;
    },
    isEnriching: (state) => {
        return state.isEnriching;
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
    },
    selectedAddress: (state) => {
        return state.selectedAddress;
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

    addProductToBasket({commit}, params) {
        commit('ADD_PRODUCT_TO_BASKET', params);
    },

    incrementProductQuantity({commit}, product) {
        commit('INCREMENT_PRODUCT_QUANTITY', product);
    },

    decrementProductQuantity({commit}, product) {
        commit('DECREMENT_PRODUCT_QUANTITY', product);
    },

    setProductQuantity({commit}, params) {
        commit('SET_PRODUCT_QUANTITY', params);
    },

    incrementPastOrderQuantity({commit}, product) {
        commit('INCREMENT_PAST_ORDER_QUANTITY', product);
    },

    decrementPastOrderQuantity({commit}, product) {
        commit('DECREMENT_PAST_ORDER_QUANTITY', product);
    },

    setPastOrderQuantity({commit}, params) {
        commit('SET_PAST_ORDER_QUANTITY', params);
    },

    incrementSpecificationQuantity({commit}, product) {
        commit('INCREMENT_SPECIFICATION_QUANTITY', product);
    },

    decrementSpecificationQuantity({commit}, product) {
        commit('DECREMENT_SPECIFICATION_QUANTITY', product);
    },

    setSpecificationQuantity({commit}, params) {
        commit('SET_SPECIFICATION_QUANTITY', params);
    },

    enrich({commit, getters}) {
        let vm = this;
        commit('START_ENRICHING');
        let ids = _.map(getters.searchResults.data, '_id');
        if (ids.length) {
            if (ids[0]['$oid']) {
                ids = _.map(ids, '$oid');
            }
        }
        axios.post(window.API_BASE + '/products/enrich-many', {
            ids: ids
        }).then(r => {
            commit('STOP_ENRICHING');
            commit('SET_ENRICHED', r.data);
        }).catch(e => {
            console.log(e);
            commit('STOP_ENRICHING');
            vm._vm.$message.error('Error enriching product data');
        });
    },

    setDisplayMode({commit}, displayMode) {
        commit('SET_DISPLAY_MODE', displayMode);
    },

    selectAddress({commit}, address) {
        commit('SET_SELECTED_ADDRESS', address);
    },

    updateBasketSelectedPrice({commit}, params) {
        commit('UPDATE_BASKET_SELECTED_PRICE', params);
    },

    setBasket({commit}, basket) {
        commit('SET_BASKET', basket);
    }
};