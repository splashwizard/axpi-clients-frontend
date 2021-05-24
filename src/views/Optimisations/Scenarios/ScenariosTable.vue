<template>
  <a-table :columns="columns" :data-source="data" class="axpi-table scenarios-table">
    <div slot="expectedCost" slot-scope="cost">
      {{ formatCost({cost: cost/100, cost_currency: 'USD'}) }}
    </div>
    <div slot="expectedCo2e" slot-scope="emission">
      {{ emission }} kg
    </div>
    <div slot="itemsAllocated">
      <div class="bullet-chart">
        <div class="left">
          <a-progress :percent="100" :show-info="false"/>
        </div>
        <div class="right">
          3/3
        </div>
      </div>
    </div>
    <div slot="actions" class="table-actions" slot-scope="actions, record">
      <a-button style="margin-right: 5px;" @click.prevent="reviewScenario(record.id)">Review</a-button>
      <a-dropdown :trigger="['click']">
        <a-button icon="ellipsis" type="link" @click.prevent="e => e.preventDefault()"></a-button>
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
    title: 'Scenario',
    key: 'name',
  },
  {
    dataIndex: 'expected_cost',
    title: 'Expected Cost',
    key: 'expectedCost',
    scopedSlots: {customRender: 'expectedCost'}
  },
  {
    dataIndex: 'co2e',
    title: 'CO2e',
    key: 'expectedCo2e',
    scopedSlots: {customRender: 'expectedCo2e'}
  },
  {
    dataIndex: 'itemsAllocated',
    title: 'Items Allocated',
    key: 'itemsAllocated',
    scopedSlots: {customRender: 'itemsAllocated'}
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
  props: ['optimisation', 'scenarios'],
  data() {
    return {
      columns
    }
  },
  methods: {
    reviewScenario(scenarioId) {
      this.$router.push('/optimisations/' + this.optimisation.id + '/scenarios/' + scenarioId + '/review');
    }
  },
  computed: {
    data() {
      const data = [
          ...this.scenarios,
        // {
        //   key: 1,
        //   name: 'Best Price',
        //   expected_cost: '5219',
        //   co2e: 1503,
        //   itemsAllocated: '3/3'
        // },
        // {
        //   key: 2,
        //   name: 'Environmentally Friendly',
        //   expected_cost: '6377',
        //   co2e: 1377,
        //   itemsAllocated: '3/3'
        // }
      ];

      if (this.$route.query.saved) {
        data.push({
          key: 3,
          name: 'Balanced',
          expected_cost: '5385',
          co2e: 1398,
          itemsAllocated: '3/3'
        });
      }

      return data;
    }
  },
  mixins: [Orders]
}
</script>

<style lang="scss">
.scenarios-table {
  .table-actions {
    text-align: right;
  }

  .bullet-chart {
    display: flex;

    .left {
      flex: 1;
    }

    .right {
      padding-left: 20px;
      flex-shrink: 1;
    }
  }
}
</style>