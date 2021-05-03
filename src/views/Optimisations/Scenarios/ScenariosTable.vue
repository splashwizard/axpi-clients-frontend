<template>
  <a-table :columns="columns" :data-source="data" class="axpi-table">
    <div slot="expectedCost" slot-scope="cost, item">
      {{ formatCost({cost: cost, cost_currency: 'USD'}) }}
    </div>
    <div slot="expectedCo2e" slot-scope="emission">
      {{ emission }} kg
    </div>
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
import Orders from "../../../mixins/Orders";

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
    scopedSlots: {customRender: 'expectedCost'}
  },
  {
    dataIndex: 'expectedCo2e',
    title: 'Expected CO2e',
    key: 'expectedCo2e',
    scopedSlots: {customRender: 'expectedCo2e'}
  },
  {
    dataIndex: 'itemsAllocated',
    title: 'Items Allocated',
    key: 'itemsAllocated',
  },
  {
    dataIndex: 'actions',
    title: '',
    key: 'actions',
    scopedSlots: {customRender: 'actions'}
  }
];

export default {
  name: "ScenariosTable",
  props: ['optimisation'],
  data() {
    return {
      columns
    }
  },
  methods: {
    reviewScenario() {
      this.$router.push('/optimisations/' + this.optimisation.id + '/scenarios/1/review');
    }
  },
  computed: {
    data() {
      const data = [
        {
          key: 1,
          name: 'Best Price',
          expectedCost: '5219',
          expectedCo2e: 1503,
          itemsAllocated: '3/3'
        },
        {
          key: 2,
          name: 'Environmentally Friendly',
          expectedCost: '6377',
          expectedCo2e: 1377,
          itemsAllocated: '3/3'
        }
      ];

      if (this.$route.query.saved) {
        data.push({
          key: 3,
          name: 'Balanced',
          expectedCost: '5385',
          expectedCo2e: 1398,
          itemsAllocated: '3/3'
        });
      }

      return data;
    }
  },
  mixins: [Orders]
}
</script>

<style scoped>
.table-actions {
  text-align: right;
}
</style>