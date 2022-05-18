import axios from "axios";
import moment from "moment";

// const list = [
//     {"id":"list-1","name":"Android","lastEdited":"2020-03-02","numberOfItems":"11","visible":true, items: []},
//     {"id":"list-2","name":"Mac","lastEdited":"2020-03-02","numberOfItems":"11","visible":false,"visibleDropdown":false, items: []},
//     {"id":"list-3","name":"iPhone","lastEdited":"2020-03-02","numberOfItems":"11","visible":true, items: []}
// ]

export const state = {
  list: [],
  loading: false,
  isLoaded: false,
};

export const mutations = {
  SET_LOADING_DATA(state, data) {
    state.list = data;
    state.loading = false;
    state.isLoaded = true;
  },

  START_LOADING(state) {
    state.loading = true;
  },

  STOP_LOADING(state) {
    state.loading = false;
  },

  DISABLE_RULE(state, { key, checked }) {
    const disablingIdx = state.list.findIndex((item) => item.key === key);
    state.list = state.list.map((item, index) =>
      index === disablingIdx
        ? {
            ...item,
            disabled: checked,
          }
        : item
    );
  },

  DELETE_RULE(state, delete_key) {
    state.list = state.list.filter((rule) => rule.key !== delete_key);
  },
};

export const getters = {
  list: (state) => {
    return state.list;
  },
  loading: (state) => {
    return state.loading;
  },
  isLoaded: (state) => {
    return state.isLoaded;
  },
};

export const actions = {
  load({ commit }) {
    commit("START_LOADING");
    axios
      .get(`${window.API_BASE}/rules`)
      .then((res) => {
        const rules = res.data.data.map((override) => {
          const { id, rule, includes, excludes, is_enable } = override;
          let query_conditions = [
            {
              query: {
                option: rule.match,
                keyword: rule.query,
              },
              filters: [],
            },
          ];
          let pinnedItems = includes.map((include) => ({
            id: include.id,
            position: include.position,
            title: include.name,
          }));
          let hiddenItems = excludes.map((exclude) => ({
            id: exclude.id,
            title: exclude.name,
          }));
          return {
            conditions: {
              query_conditions: query_conditions,
              period: override.start_date ? [moment(override.start_date), moment(override.end_date)] : [],
            },
            consequences: {
              filterResults: [],
              boostCategories: [],
              buryCategories: [],
              pinnedItems: pinnedItems,
              hiddenItems: hiddenItems,
            },
            key: id,
            disabled: !is_enable,
            timestamp: "2022-04-27T09:05:32.318Z",
          };
        });
        commit("SET_LOADING_DATA", rules);
      })
      .catch(() => {
        this._vm.$message.error("Error fetching rules");
        commit("STOP_LOADING");
      });
  },
  disableRule: ({ commit }, payload) => {
    commit("DISABLE_RULE", payload);
  },
  deleteRule: ({ commit }, key) => {
    commit("DELETE_RULE", key);
  },
};
