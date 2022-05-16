<template>
  <div>
    <loading-screen :is-loading="isDeleting || isDuplicating"></loading-screen>
    <edit-scenario-modal
      v-if="editScenarioId"
      :optimisation-id="optimisation.id"
      @scenario-updated="handleScenarioUpdated"
      :scenario-id="editScenarioId"
    ></edit-scenario-modal>
    <a-table :columns="columns" :data-source="data" class="axpi-table scenarios-table">
      <div slot="name" slot-scope="name, row">
        <span v-if="!row.description">{{ name }}</span>
        <a-tooltip v-if="row.description">
          <template slot="title">
            {{ row.description }}
          </template>
          <span class="name-with-description">{{ name }}</span>
        </a-tooltip>
      </div>
      <div slot="expectedCost" slot-scope="cost">
        {{ formatCost({ cost: cost / 100, cost_currency: "USD" }) }}
      </div>
      <div slot="expectedCo2e" slot-scope="emission">{{ emission }} kg</div>
      <div slot="items_allocated" slot-scope="items_allocated">
        <div class="bullet-chart">
          <div class="left">
            <a-progress
              :percent="(items_allocated / optimisation.optimisation_specification_count) * 100"
              :show-info="false"
            />
          </div>
          <div class="right">{{ items_allocated }}/{{ optimisation.optimisation_specification_count }}</div>
        </div>
      </div>
      <div slot="tags" slot-scope="tags">
        <a-badge
          v-for="(tag, i) in decodeTags(tags)"
          :key="i"
          :count="tag"
          :number-style="getTagBadgeStyle(tag)"
        ></a-badge>
        <span v-if="decodeTags(tags).length == 0">-</span>
      </div>
      <div slot="actions" class="table-actions" slot-scope="actions, record">
        <a-button v-if="record.optimised" style="margin-right: 5px" @click.prevent="reviewScenario(record.id)"
          >Review
        </a-button>
        <a-button type="primary" v-if="!record.optimised" style="margin-right: 5px" @click.prevent="optimise"
          >Optimise
        </a-button>
        <a-dropdown :trigger="['click']">
          <a-button icon="ellipsis" type="link" @click.prevent="(e) => e.preventDefault()"></a-button>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="#" @click.prevent="editScenario(record.id)">Edit</a>
            </a-menu-item>
            <a-menu-item>
              <a href="#" @click.prevent="duplicateScenario(record.id)">Duplicate</a>
            </a-menu-item>
            <a-menu-item>
              <a href="#" @click.prevent="deleteScenario(record.id)" class="text-danger">Delete</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </a-table>
  </div>
</template>

<script>
import Orders from "../../../mixins/Orders";
import axios from "axios";
import EditScenarioModal from "./EditScenarioModal";

const columns = [
  {
    dataIndex: "name",
    title: "Scenario",
    key: "name",
    scopedSlots: { customRender: "name" },
  },
  {
    dataIndex: "expected_cost",
    title: "Expected Cost",
    key: "expectedCost",
    scopedSlots: { customRender: "expectedCost" },
  },
  {
    dataIndex: "co2e",
    title: "CO2e",
    key: "expectedCo2e",
    scopedSlots: { customRender: "expectedCo2e" },
  },
  {
    dataIndex: "maximum_number_of_suppliers",
    title: "Max Suppliers",
    key: "maximum_number_of_suppliers",
  },
  {
    dataIndex: "items_allocated",
    title: "Items Allocated",
    key: "items_allocated",
    scopedSlots: { customRender: "items_allocated" },
  },
  {
    dataIndex: "tags",
    title: "Tags",
    key: "tags",
    scopedSlots: { customRender: "tags" },
  },
  {
    dataIndex: "actions",
    title: "",
    key: "actions",
    scopedSlots: { customRender: "actions" },
  },
];

export default {
  name: "ScenariosTable",
  components: { EditScenarioModal },
  props: ["optimisation", "scenarios"],
  data() {
    return {
      columns,
      isDeleting: false,
      isDuplicating: false,
      editScenarioId: null,
    };
  },
  methods: {
    reviewScenario(scenarioId) {
      this.$router.push("/optimisations/" + this.optimisation.id + "/scenarios/" + scenarioId + "/review");
    },

    editScenario(scenarioId) {
      this.editScenarioId = null;
      this.$nextTick(() => {
        this.editScenarioId = scenarioId;
      });
    },

    handleScenarioUpdated() {
      this.editScenarioId = null;
      this.$emit("scenario-updated");
    },

    deleteScenario(scenarioId) {
      let vm = this;
      vm.isDeleting = true;
      axios
        .delete(window.API_BASE + "/optimisations/" + this.optimisation.id + "/scenarios/" + scenarioId)
        .then(() => {
          vm.isDeleting = false;
          vm.$message.success("Scenario deleted successfully");
          vm.$emit("scenario-deleted");
        })
        .catch((e) => {
          console.log(e);
          vm.isDeleting = false;
          vm.$message.error("Error deleting scenario");
        });
    },

    duplicateScenario(scenarioId) {
      let vm = this;
      vm.isDuplicating = true;
      axios
        .post(window.API_BASE + "/optimisations/" + this.optimisation.id + "/scenarios/" + scenarioId + "/duplicate")
        .then(() => {
          vm.isDuplicating = false;
          vm.$message.success("Scenario duplicated successfully");
          vm.$emit("scenario-duplicated");
        })
        .catch((e) => {
          console.log(e);
          vm.isDuplicating = false;
          vm.$message.error("Error duplicating scenario");
        });
    },

    getTagBadgeStyle() {
      return {
        backgroundColor: this.getStatusColor(0),
      };
    },

    decodeTags(tags) {
      let tagsDecoded = [];
      if (tags) {
        try {
          tagsDecoded = JSON.parse(tags);
        } catch ($e) {
          tagsDecoded = [];
        }
      }
      return tagsDecoded;
    },

    optimise() {
      // alert('optimise');
      this.$router.push("/optimisations/" + this.optimisation.id + "?optimise_on_load=1");
    },
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

      // if (this.$route.query.saved) {
      //   data.push({
      //     key: 3,
      //     name: 'Balanced',
      //     expected_cost: '5385',
      //     co2e: 1398,
      //     itemsAllocated: '3/3'
      //   });
      // }

      return data;
    },
  },
  mixins: [Orders],
};
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

.name-with-description:hover {
  cursor: pointer !important;
}
</style>
