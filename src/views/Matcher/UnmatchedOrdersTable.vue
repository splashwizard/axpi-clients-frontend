<template>
  <div>
    <loading-screen :is-loading="isSaving"></loading-screen>
    <a-table class="axpi-table"
             :columns="columns"
             :row-key="record => record.id"
             :data-source="dataToShow"
             :pagination="pagination"
             :loading="loading||searchQueryIsDirty"
             @change="handleTableChange"
    >
      <div slot="cost" slot-scope="cost">
        {{ formatCost({cost_currency: 'USD', cost: cost}) }}
      </div>
      <div slot="actions" class="table-actions" slot-scope="actions, row">
        <a-button type="default" @click="selectErpOrder(row)">Match</a-button>
      </div>
      <div slot="dropdown" class="table-actions" slot-scope="actions, record">
        <a-dropdown :trigger="['click']">
          <a-button type="link" icon="ellipsis" @click.prevent="e => e.preventDefault()"></a-button>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="#" class="text-danger" @click="archive(record)">Archive</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </a-table>
  </div>
</template>

<script>
import axios from 'axios';
import eventBus from "../../event-bus";

const _ = require('lodash');
import Orders from "../../mixins/Orders";
import {mapActions} from 'vuex';

const columns = [
  {
    title: 'Name',
    dataIndex: 'PO Li Description',
    sorter: true
  },
  {
    title: 'Cost',
    dataIndex: 'CHF_FLOAT',
    scopedSlots: {customRender: 'cost'},
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
    title: '',
    scopedSlots: {customRender: 'actions'},
    width: 10
  },
  {
    title: '',
    scopedSlots: {customRender: 'dropdown'},
    width: 10
  }
];

export default {
  props: ['reloadKey'],
  name: "UnmatchedOrdersTable",
  mixins: [Orders],
  data() {
    return {
      data: [],
      pagination: {},
      searchQueryIsDirty: false,
      loading: false,
      columns,
      isSaving: false,
      archived: []
    }
  },
  mounted() {
    this.fetch();
    eventBus.$on('order-matched', (params) => {
      let {erp_order_id, matches} = params;
      this.data = _.reject(this.data, d => {
        if (d['_id'] === erp_order_id && matches.length > 0) {
          return true;
        }
        return false;
      });
      if (this.data.length === 0) {
       this.fetch();
      }
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
  computed: {
    dataToShow() {
      let vm = this;
      return _.filter(this.data, d => {
        return !vm.archived.includes(d['_id']);
      });
    }
  },
  methods: {
    ...mapActions('matcher', {
      selectErpOrder: 'selectErpOrder'
    }),

    archive(order) {
      let vm = this;
      vm.isSaving = true;
      axios.post(window.API_BASE + '/matcher/archive-order', {
        erp_order_id: order['_id']
      }).then(() => {
        vm.archived.push(order['_id']);
        vm.isSaving = false;
        vm.$message.success('Order archived successfully');
      }).catch(e => {
        console.log(e);
        vm.$message.error('Error archiving order');
        vm.isSaving = false;
      });
    },

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
      axios.post(window.API_BASE + '/matcher/get-unmatched-erp-orders', this.determineSearchParams(params)).then(r => {
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
    }
  }
}
</script>

<style scoped>

</style>