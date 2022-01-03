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
            quantity: order.quantity ? order.quantity : 1,
            isLoadingPrices: true,
            prices: []
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
        p.isLoadingPrices = true;
    },

    DECREMENT_PAST_ORDER_QUANTITY(state, order) {
        let p = _.find(state.basket, item => {
            return (
                item.itemType === 'order'
                && item.id === order['id']
            );
        });
        p.quantity--;
        p.isLoadingPrices = true;
        if (p.quantity < 1) {
            state.basket = _.without(state.basket, p);
        }
    },

    ADD_TRUEPRICES_TO_ORDER(state, params) {
        let {order, prices} = params;
        let p = _.find(state.basket, item => {
            return (
                item.itemType === 'order'
                && item.id === order['id']
            );
        });
        p.isLoadingPrices = false;
        p.prices = prices;
        if (prices.length) {
            p.selectedPrice = _.first(prices);
            p.selectedPriceId = p.selectedPrice.id;
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
        p.isLoadingPrices = true;
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

    ADD_TRUEPRICES_TO_SPECIFICATION(state, params) {
        let {specification, prices} = params;
        let p = _.find(state.basket, item => {
            return (
                item.itemType === 'specification'
                && item.id === specification['id']
            );
        });
        p.isLoadingPrices = false;
        p.prices = prices;
        if (prices.length) {
            p.selectedPrice = _.first(prices);
            p.selectedPriceId = p.selectedPrice.id;
        }
    },

    ADD_CO2E_TO_PRODUCT(state, params) {
        let {co2e, product} = params;
        let p = _.find(state.basket, item => {
            return (
                item.itemType === 'product'
                && item.id === product['_id']
            )
        });
        p.isLoadingCo2e = false;
        p.co2e = co2e;
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

        // TODO: Merge similar matching prices
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

    addPastOrderToBasket({commit, dispatch}, order) {
        commit('ADD_PAST_ORDER_TO_BASKET', order);
        dispatch('loadTruepricesForOrder', {order: order, quantity: order.quantity});
    },

    loadTruepricesForOrder({commit}, params) {
        let {order, quantity} = params;
        axios.post(window.API_BASE + '/orders/' + order.id + '/get-prices', {
            quantity: quantity
        }).then(r => {
            commit('ADD_TRUEPRICES_TO_ORDER', {
                order: order,
                prices: r.data
            });
        }).catch(e => {
            console.log(e);
            commit('ADD_TRUEPRICES_TO_ORDER', {
                order: order,
                prices: []
            });
            // this._vm.$message.error('Error loading prices for order');
        });
    },

    addSpecificationToBasket({commit, dispatch}, spec) {
        commit('ADD_SPECIFICATION_TO_BASKET', spec);
        dispatch('loadTruepricesForSpecification', spec);
    },

    loadTruepricesForSpecification({commit}, spec) {
        axios.get(window.API_BASE + '/specifications/' + spec.id + '/prices').then(r => {
            commit('ADD_TRUEPRICES_TO_SPECIFICATION', {
                specification: spec,
                prices: r.data
            });
        }).catch(e => {
            console.log(e);
            // this._vm.$message.error('Error loading prices for specification');
        });
    },

    updateSpecificationInBasket({commit}, spec) {
        commit('UPDATE_SPECIFICATION_IN_BASKET', spec);
    },

    addProductToBasket({commit}, params) {
        commit('ADD_PRODUCT_TO_BASKET', params);
        // dispatch('loadCo2eForProduct', params['product']);
    },

    // loadCo2eForProduct({commit}, product) {
    //     let id = product['id'];
    //     if (!id) {
    //         id = product['_id'];
    //     }
    //     axios.get(window.API_BASE + '/products/' + id + '/esg/materials/co2e').then(r => {
    //        commit('ADD_CO2E_TO_PRODUCT', {
    //            product: product,
    //            co2e: r.data
    //        });
    //     }).catch(e => {
    //         console.log(e);
    //     });
    // },

    incrementProductQuantity({commit}, product) {
        commit('INCREMENT_PRODUCT_QUANTITY', product);
    },

    decrementProductQuantity({commit}, product) {
        commit('DECREMENT_PRODUCT_QUANTITY', product);
    },

    setProductQuantity({commit}, params) {
        commit('SET_PRODUCT_QUANTITY', params);
    },

    incrementPastOrderQuantity({commit, getters, dispatch}, product) {
        commit('INCREMENT_PAST_ORDER_QUANTITY', product);

        let p = _.find(getters.basket, item => {
            return (
                item.itemType === 'order'
                && item.id === product.id
            );
        });
        if (p) {
            dispatch('loadTruepricesForOrder', {order: p.order, quantity: p.quantity});
        }
    },

    decrementPastOrderQuantity({commit, getters, dispatch}, product) {
        commit('DECREMENT_PAST_ORDER_QUANTITY', product);
        let p = _.find(getters.basket, item => {
            return (
                item.itemType === 'order'
                && item.id === product.id
            );
        });
        if (p) {
            dispatch('loadTruepricesForOrder', {order: p.order, quantity: p.quantity});
        }
    },

    setPastOrderQuantity({commit, getters, dispatch}, params) {
        commit('SET_PAST_ORDER_QUANTITY', params);
        let p = _.find(getters.basket, item => {
            return (
                item.itemType === 'order'
                && item.id === params.id
            );
        });
        if (p) {
            dispatch('loadTruepricesForOrder', {order: p.order, quantity: p.quantity});
        }
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