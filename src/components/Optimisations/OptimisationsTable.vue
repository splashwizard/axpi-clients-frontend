<template>
  <a-table
      class="axpi-table"
      :columns="columns"
      :row-key="record => record.id"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
  >
    <template slot="name" slot-scope="text, record">
      <router-link :to="getOptimisationLink(record)">
        {{ text }}
      </router-link>
    </template>
    <template slot="items">
      2
    </template>
    <template slot="truprice">
      £1000
    </template>
    <template slot="created-at" slot-scope="text">
      {{ formatDate(text) }}
    </template>
  </a-table>
</template>
<script>
import axios from 'axios';
import Dates from "../../mixins/Dates";

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    scopedSlots: {
      customRender: 'name'
    }
  },
  {
    title: 'Scenarios',
    dataIndex: 'scenarios',
    sorter: true,
    scopedSlots: {
      customRender: 'scenarios'
    }
  },
  {
    title: 'Items',
    dataIndex: 'items',
    sorter: true,
    scopedSlots: {
      customRender: 'items'
    }
  },
  {
    title: 'Truprice',
    dataIndex: 'truprice',
    sorter: true,
    scopedSlots: {
      customRender: 'truprice'
    }
  },
  {
    title: 'Date Created',
    dataIndex: 'created_at',
    sorter: true,
    scopedSlots: {
      customRender: 'created-at'
    }
  }
];

export default {
  data() {
    return {
      data: [],
      pagination: {},
      loading: false,
      columns,
    };
  },
  mixins: [Dates],
  mounted() {
    this.fetch();
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      const pager = {...this.pagination};
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        results_per_page: pagination.pageSize,
        page: pagination.current,
        sort_field: sorter.field,
        sort_order: sorter.order,
        ...filters,
      });
    },

    fetch(params = {}) {
      console.log('params:', params);
      this.loading = true;
      axios.post(window.API_BASE + '/optimisations/search', {
        results_per_page: 10,
        ...params
      }).then(r => {
        const pagination = {...this.pagination};
        // Read total count from server
        pagination.total = r.data.total;
        this.loading = false;
        this.data = r.data.data;
        this.pagination = pagination;
      }).catch(e => {
        console.log(e);
        this.$message.error('Error loading optimisations');
      });
    },

    getOptimisationLink(optimisation) {
      return '/optimisations/' + optimisation.id;
    }
  },
};
</script>
