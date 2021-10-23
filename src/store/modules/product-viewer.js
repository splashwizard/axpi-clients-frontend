import axios from 'axios';

let _ = require('lodash');
// import router from "../../router";

export const state = {
    isLoading: false,
    product: null,
    serverErrors: [],

    documents: [],
    isLoadingDocuments: false
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
    },

    SET_DOCUMENTS(state, documents) {
        state.documents = documents;
    },

    START_LOADING_DOCUMENTS(state) {
        state.isLoadingDocuments = true;
    },

    STOP_LOADING_DOCUMENTS(state) {
        state.isLoadingDocuments = false;
    }
};

export const getters = {
    isLoading: (state) => {
        return state.isLoading;
    },

    product: (state) => {
        if (state.product) {
            return state.product['product'];
        }
        return null;
    },

    productVendorMapping: (state) => {
        if (state.product) {
            return state.product['product_vendor_mapping'];
        }
        return null;
    },

    vendors: (state) => {
        let vendors = [];
        if (state.product && state.product['product']) {
           vendors.push(state.product['product']['vendor']);
        }
        if (state.product && state.product['product_vendor_mapping']) {
            vendors.push(state.product['product_vendor_mapping']['vendors']['names']);
        }
        return _.uniq(_.flatten(vendors));
    },

    serverErrors: (state) => {
        return state.serverErrors;
    },

    documents: (state) => {
        return state.documents;
    }
};

export const actions = {
    loadProduct({commit, dispatch}, id) {
        commit('START_LOADING');
        commit('SET_ERRORS', []);
        commit('SET_DOCUMENTS', []);
        axios.get(window.API_BASE + '/products/' + id).then(r => {
            commit('STOP_LOADING');
            commit('SET_PRODUCT', r.data);
            dispatch('loadDocuments');
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

    loadDocuments({commit, getters}) {
        let product = getters.product;
        let productCode = product['productCode'];

        commit('START_LOADING_DOCUMENTS');
        axios.get(window.API_BASE + '/products/' + productCode + '/documents').then(r => {
            commit('STOP_LOADING_DOCUMENTS');
            commit('SET_DOCUMENTS', r.data);
        }).catch(e => {
            commit('STOP_LOADING_DOCUMENTS');
            this._vm.$message.error('Error loading documents');
            console.log(e);
        });
    }
};
