<template>
  <div>
    <a-table class="axpi-table"
             :columns="columns"
             :row-key="record => record.id"
             :data-source="data"
             :pagination="pagination"
             :loading="loading||searchQueryIsDirty"
             @change="handleTableChange"
    >
      <div slot="status" slot-scope="status, row">
        <a-badge :count="getStatus(row)" :number-style="getStatusBadgeStyle(row)"></a-badge>
      </div>
      <div slot="actions" class="table-actions" slot-scope="actions, row">
        <a-button v-if="!hasMatches(row)" type="default" @click="selectErpOrder(row)">Match</a-button>
        <a-button block v-if="hasMatches(row)" type="primary" @click="selectErpOrder(row)">Edit</a-button>
      </div>
    </a-table>
  </div>
</template>

<script>
import axios from 'axios';

const _ = require('lodash');
import {mapActions} from 'vuex';
import eventBus from "../../event-bus";

const columns = [
  {
    title: 'Name',
    dataIndex: 'PO Li Description',
    sorter: true
  },
  {
    title: 'PO Number',
    dataIndex: 'PO Number',
    sorter: true
  },
  // {
  //   title: 'Manufacturer',
  //   dataIndex: 'Manufacturer',
  //   sorter: true
  // },
  {
    title: 'Vendor',
    dataIndex: 'Vendor',
    sorter: true
  },
  {
    title: 'Vendor Product ID',
    dataIndex: 'Vendor Product ID',
    sorter: true
  },
  {
    title: 'Status',
    scopedSlots: {customRender: 'status'}
  },
  {
    title: '',
    scopedSlots: {customRender: 'actions'},
    width: 10
  }
];

export default {
  props: ['reloadKey'],
  name: "AllOrdersTable",
  data() {
    return {
      data: [],
      pagination: {},
      searchQueryIsDirty: false,
      loading: false,
      columns
    }
  },
  mounted() {
    this.fetch();
    eventBus.$on('order-matched', (params) => {
      let {erp_order_id, matches, matches_selected_from_suggestion, matches_selected_manually} = params;
      this.data = _.map(this.data, d => {
        if (d['_id'] === erp_order_id) {
          return {
            ...d,
            matches,
            matches_selected_from_suggestion,
            matches_selected_manually
          };
        }
        return d;
      });
    });
  },
  beforeDestroy() {
    eventBus.$off('order-matched');
  },
  watch: {
    reloadKey() {
      // this.fetch();
    }
  },
  methods: {
    ...mapActions('matcher', {
      selectErpOrder: 'selectErpOrder'
    }),

    handleTableChange(pagination, filters, sorter) {
      const pager = {...this.pagination};
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        results_per_page: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },

    determineSearchParams(params) {
      let search = {
        results_per_page: 10
      };

      return {
        ...search,
        ...params
      };
    },

    fetch: _.debounce(function (params = {}) {
      this.loading = true;
      axios.post(window.API_BASE + '/matcher/get-all-erp-orders', this.determineSearchParams(params)).then(r => {
        const pagination = {...this.pagination};
        // Read total count from server
        pagination.total = r.data.total;
        this.loading = false;
        this.data = r.data.data;
        this.pagination = pagination;
        this.searchQueryIsDirty = false;
      }).catch(e => {
        console.log(e);
        this.$message.error('Error loading orders');
      });
    }, 500),

    handleRecordSelected(order) {
      console.log('Order selected');
      console.log(order);
    },

    hasMatches(order) {
      if (order.matches && order.matches.length > 0) {
        return true;
      }
      return false;
    },

    getStatus(order) {
      if (this.hasMatches(order)) {
        return 'Matched';
      }
      return 'Unmatched';
    },

    getStatusBadgeStyle(order) {
      if (this.hasMatches(order)) {
        return {
          backgroundColor: '#46b98e'
        }
      }
      return {
        backgroundColor: '#4dc8f2'
      }
    }
  }
}
</script>

<style scoped>

</style>