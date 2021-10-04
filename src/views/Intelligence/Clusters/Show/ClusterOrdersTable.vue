<template>
  <a-table class="axpi-table"
           :columns="columns"
           :row-key="record => record.id"
           :data-source="data"
           :loading="loading"
  >
  </a-table>
</template>
<script>
import axios from 'axios';

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
  }
];

export default {
  props: ['clusterId'],
  data() {
    return {
      data: [],
      loading: false,
      columns,
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    fetch(params = {}) {
      console.log('params:', params);
      this.loading = true;
      axios.get(window.API_BASE + '/intelligence/clusters/' + this.clusterId + '/orders').then(r => {
        this.loading = false;
        this.data = r.data;
      }).catch(e => {
        console.log(e);
        this.$message.error('Error loading orders');
      });
    },
  },
};
</script>
