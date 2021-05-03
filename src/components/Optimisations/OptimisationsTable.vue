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
    <template slot="scenarios" slot-scope="scenarios, optimisation">
      <span v-if="optimisation.name === 'Customer C Campaign'">5</span>
      <span v-if="optimisation.name === 'Drug B USA Campaign'">3</span>
    </template>
    <template slot="items" slot-scope="items, optimisation">
      <span v-if="optimisation.name == 'Customer C Campaign'">8</span>
      <span v-if="optimisation.name == 'Drug B USA Campaign'">21</span>
    </template>
    <template slot="expectedCost" slot-scope="expectedCost,optimisation">
      <span v-if="optimisation.name == 'Customer C Campaign'">
        $11,137 - $14,839
      </span>
      <span v-if="optimisation.name == 'Drug B USA Campaign'">
        $28,726 - $35,031
      </span>
    </template>
    <template slot="co2e" slot-scope="co2e,optimisation">
      <span v-if="optimisation.name == 'Customer C Campaign'">
        2,818kg - 3,614kg
      </span>
      <span v-if="optimisation.name == 'Drug B USA Campaign'">
        7,183kg - 10,097kg
      </span>
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
    title: 'Expected Cost',
    dataIndex: 'expectedCost',
    sorter: true,
    scopedSlots: {
      customRender: 'expectedCost'
    }
  },
  {
    title: 'CO2e',
    dataIndex: 'co2e',
    sorter: true,
    scopedSlots: {
      customRender: 'co2e'
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
