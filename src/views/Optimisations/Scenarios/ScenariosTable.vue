<template>
  <a-table :columns="columns" :data-source="data" class="axpi-table">
    <div slot="actions" class="table-actions">
      <a-button style="margin-right: 5px;" @click.prevent="reviewScenario">Review</a-button>
      <a-dropdown :trigger="['click']">
        <a-button icon="ellipsis" @click.prevent="e => e.preventDefault()"></a-button>
        <a-menu slot="overlay">
          <a-menu-item>
            <a href="#">Edit</a>
          </a-menu-item>
          <a-menu-item>
            <a href="#">Duplicate</a>
          </a-menu-item>
          <a-menu-item>
            <a href="#"
               class="text-danger">Delete</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </a-table>
</template>

<script>
const columns = [
  {
    dataIndex: 'name',
    title: 'Name',
    key: 'name',
  },
  {
    dataIndex: 'expectedCost',
    title: 'Expected Cost',
    key: 'expectedCost',
  },
  {
    dataIndex: 'expectedCo2e',
    title: 'Expected CO2e',
    key: 'expectedCo2e',
  },
  {
    dataIndex: 'suppliersPerItem',
    title: 'Suppliers Per Item',
    key: 'suppliersPerItem',
  },
  {
    dataIndex: 'actions',
    title: '',
    key: 'actions',
    scopedSlots: {customRender: 'actions'}
  }
];

const data = [
  {
    key: 1,
    name: 'Test Name',
    expectedCost: 123,
    expectedCo2e: 1230000,
    suppliersPerItem: 2
  }
];

export default {
  name: "ScenariosTable",
  props: ['optimisation'],
  data() {
    return {
      columns,
      data
    }
  },
  methods: {
    reviewScenario() {
      this.$router.push('/optimisations/' + this.optimisation.id + '/scenarios/1/review');
    }
  }
}
</script>

<style scoped>
.table-actions {
  text-align: right;
}
</style>