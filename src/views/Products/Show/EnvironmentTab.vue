<template>
  <div class="environment-tab">
    <a-table
      :expandIconAsCell="false"
      :expand-icon="getExpandIcon"
      :expand-icon-column-index="4"
      class="axpi-table"
      :columns="columns"
      :data-source="tableData"
      :pagination="false"
    >
      <template slot="icon" slot-scope="icon, row">
        <a-icon class="section-icon" v-if="row.section == 'Lifespan'" type="clock-circle"></a-icon>
        <a-icon class="section-icon" v-if="row.section == 'Materials'" type="copy"></a-icon>
        <a-icon class="section-icon" v-if="row.section == 'Transport'" type="car"></a-icon>
        <a-icon class="section-icon" v-if="row.section == 'Certifications'" type="safety-certificate"></a-icon>
      </template>
      <template slot="section" slot-scope="section">
        <span class="section-title">{{ section }}</span>
      </template>
      <a-table
        slot="expandedRowRender"
        slot-scope="row"
        v-if="row.innerTableColumns"
        :columns="row.innerTableColumns"
        :data-source="row.innerTableData"
        :pagination="false"
        :loading="row.isLoading"
      >
        <template slot="from_address" slot-scope="from_address">
          {{ from_address ? formatAddress(from_address) : "-" }}
        </template>
        <template slot="to_address" slot-scope="to_address">
          {{ to_address ? formatAddress(to_address) : "-" }}
        </template>
        <template slot="recyclable" slot-scope="recyclable">
          <a-tag color="blue" v-if="recyclable == null">Unknown</a-tag>
          <a-tag color="green" v-if="recyclable == true">Yes</a-tag>
          <a-tag color="red" v-if="recyclable == false">No</a-tag>
        </template>
        <template slot="tags" slot-scope="tags, innerRow">
          <a-tag color="#000" v-if="isMaterialBanned(innerRow.material)">Banned</a-tag>
        </template>
        <template slot="actions" slot-scope="actions, innerRow">
          <div class="actions">
            <delete-property-button
              v-if="view === 'edit'"
              @material-deleted="handleMaterialDeleted"
              @certification-deleted="handleCertificationDeleted"
              @transportation-deleted="handleTransportationDeleted"
              :product-id="productId"
              :type="row.section"
              :id="innerRow.id"
            ></delete-property-button>
          </div>
        </template>
      </a-table>

      <template slot="measure" slot-scope="measure, record">
        <a-spin v-if="record.isLoading"></a-spin>
        <span v-if="record.section === 'Materials' && !record.isLoading">
          <a-tag v-if="totalMaterialCo2e" color="blue">{{ totalMaterialCo2e }}kg CO2e</a-tag>
          <a-tag v-if="totalMaterialWater" color="blue">{{ totalMaterialWater }}L Water</a-tag>
        </span>
        <span v-if="record.section === 'Transport' && !record.isLoading">
          <a-tag v-if="totalTransportCo2e" color="blue">{{ totalTransportCo2e }}kg CO2e</a-tag>
        </span>
        <span v-if="record.section === 'Certifications' && !record.isLoading">
          <a-tag v-for="(certification, i) in record.innerTableData" :key="i" color="blue">
            {{ certification.name }}
          </a-tag>
        </span>
        <span
          v-if="record.section === 'Lifespan' && !record.isLoading && record.innerTableData && record.innerTableData[0]"
        >
          <a-tag color="blue">
            {{ record.innerTableData[0].lifespan_formatted }}
          </a-tag>
          <a-tag color="blue">
            {{ record.innerTableData[0].usage }}
          </a-tag>
        </span>
        <span v-if="record.section === 'Lifespan' && !record.isLoading && !record.innerTableData.length">
          <a-tag color="red"> Unknown </a-tag>
        </span>
      </template>

      <template slot="tags" slot-scope="tags, record">
        <a-tag color="#000" v-if="hasBannedMaterials && record.section === 'Materials'">Has Banned Materials</a-tag>
      </template>

      <template slot="actions" slot-scope="actions, record">
        <div v-if="record.actionButton && view === 'edit'" class="actions">
          <a-button class="action-button" type="primary" icon="plus" @click.prevent="record.actionButtonClicked"
            >{{ record.actionButton }}
          </a-button>
        </div>
      </template>
    </a-table>

    <add-material-modal
      :product-id="productId"
      :visible="addMaterialModalVisible"
      :is-loading-material-options="isLoadingMaterialOptions"
      :material-options="materialOptions"
      :is-loading-aspect-options="isLoadingAspectOptions"
      :aspect-options="aspectOptions"
      @material-added="handleMaterialAdded"
      @close-modal="closeAddMaterialModal"
    ></add-material-modal>

    <add-transportation-modal
      :product-id="productId"
      :visible="addTransportationModalVisible"
      :transportation-options="transportOptions"
      :is-loading-transportation-options="isLoadingTransportOptions"
      @transportation-added="handleTransportationAdded"
      @close-modal="closeAddTransportationModal"
    ></add-transportation-modal>

    <add-certification-modal
      :product-id="productId"
      :visible="addCertificationModalVisible"
      :is-loading-certification-options="isLoadingCertificationOptions"
      :certification-options="certificationOptions"
      @certification-added="handleCertificationAdded"
      @close-modal="closeAddCertificationModal"
    ></add-certification-modal>
  </div>
</template>

<script>
import axios from "axios";
import Addresses from "../../../mixins/Addresses";
import { mapGetters } from "vuex";
import AddMaterialModal from "./EnvironmentTab/AddMaterialModal";
import AddCertificationModal from "./EnvironmentTab/AddCertificationModal";
import DeletePropertyButton from "./EnvironmentTab/DeletePropertyButton";
import AddTransportationModal from "./EnvironmentTab/AddTransportationModal";
import eventBus from "../../../event-bus";

const _ = require("lodash");

const columns = [
  {
    title: "",
    width: 20,
    scopedSlots: { customRender: "icon" },
  },
  {
    title: "Section",
    dataIndex: "section",
    width: 245,
    scopedSlots: { customRender: "section" },
  },
  {
    title: "Measure",
    dataIndex: "measure",
    scopedSlots: { customRender: "measure" },
  },
  {
    title: "",
    scopedSlots: { customRender: "tags" },
  },
  {
    title: "",
    dataIndex: "actions",
    scopedSlots: { customRender: "actions" },
  },
];

export default {
  name: "EnvironmentTab",
  components: { DeletePropertyButton, AddMaterialModal, AddCertificationModal, AddTransportationModal },
  mixins: [Addresses],
  data() {
    return {
      columns,

      isLoadingMaterials: false,
      materials: [],
      addMaterialModalVisible: false,

      isLoadingCertifications: false,
      certifications: [],
      addCertificationModalVisible: false,

      isLoadingTransportations: false,
      transportations: [],
      addTransportationModalVisible: false,

      isLoadingMaterialOptions: false,
      materialOptions: [],

      isLoadingProductLifespans: false,
      productLifespans: [],

      isLoadingAspectOptions: false,
      aspectOptions: [],

      isLoadingCertificationOptions: false,
      certificationOptions: [],

      isLoadingTransportOptions: false,
      transportOptions: [],
    };
  },
  created() {
    this.loadAspectOptions();
    this.loadMaterialOptions();
    this.loadCertificationOptions();
    this.loadTransportOptions();
    this.loadMaterials();
    this.loadCertifications();
    this.loadTransportations();
    this.loadProductLifespans();
  },
  computed: {
    ...mapGetters("productViewer", {
      product: "product",
      view: "view",
    }),

    totalMaterialCo2e() {
      return Math.round(_.sum(_.map(this.materials, "co2e")) * 100) / 100;
    },

    totalMaterialWater() {
      return Math.round(_.sum(_.map(this.materials, "water")) * 100) / 100;
    },

    totalTransportCo2e() {
      return Math.round(_.sum(_.map(this.transportations, "co2e")) * 100) / 100;
    },

    productId() {
      return this.product["_id"];
    },

    materialsTableData() {
      return _.map(this.materials, (material) => {
        let materialOption = _.find(this.materialOptions, { name: material.material });
        return {
          weight_formatted:
            material.weight && material.weight_unit ? material.weight + " " + material.weight_unit : "-",
          co2e_formatted: material.co2e ? Math.round(material.co2e * 100) / 100 + " kg" : "-",
          water_formatted: material.water ? Math.round(material.water * 100) / 100 + " kg" : "-",
          recyclable: materialOption ? materialOption.recyclable : null,
          recycled_content_percentage: materialOption ? materialOption.recycled_content_percentage + "%" : 0 + "%",
          ...material,
        };
      });
    },

    certificationsTableData() {
      return _.map(this.certifications, (certification) => {
        return certification;
      });
    },

    transportationsTableData() {
      return _.map(this.transportations, (transportation) => {
        return {
          co2e_formatted: transportation.co2e ? Math.round(transportation.co2e * 100) / 100 + " kg" : "-",
          ...transportation,
        };
      });
    },

    lifespansTableData() {
      return _.map(this.productLifespans, (lifespan) => {
        return {
          lifespan_formatted: lifespan.lifespan + " " + lifespan.lifespan_unit,
          ...lifespan,
        };
      });
    },

    tableData() {
      return [
        {
          section: "Materials",
          measure: "?",
          actionButton: "Add Material",
          actionButtonClicked: () => {
            this.openAddMaterialModal();
          },
          innerTableColumns: [
            {
              title: "Aspect",
              dataIndex: "aspect",
            },
            {
              title: "Material",
              dataIndex: "material",
            },
            {
              title: "Weight",
              dataIndex: "weight_formatted",
            },
            {
              title: "CO2e",
              dataIndex: "co2e_formatted",
            },
            {
              title: "Water",
              dataIndex: "water_formatted",
            },
            {
              title: "Recyclable",
              dataIndex: "recyclable",
              scopedSlots: { customRender: "recyclable" },
            },
            {
              title: "Recycled Content",
              dataIndex: "recycled_content_percentage",
            },
            {
              scopedSlots: { customRender: "tags" },
              width: 100,
            },
            {
              scopedSlots: { customRender: "actions" },
            },
          ],
          innerTableData: this.materialsTableData,
          isLoading: this.isLoadingMaterials || this.isLoadingAspectOptions || this.isLoadingMaterialOptions,
        },
        // {
        //   section: 'Efficiency',
        //   measure: '?',
        //   actionButtonClicked: () => {
        //     this.openAddCertificationModal()
        //   },
        //   innerTableColumns: [
        //     {
        //       title: 'Name',
        //       dataIndex: 'name'
        //     }
        //   ],
        //   innerTableData: this.certificationsTableData,
        //   isLoading: this.isLoadingCertifications
        // },
        {
          section: "Transport",
          measure: "?",
          actionButton: "Add Transport",
          actionButtonClicked: () => {
            this.openAddTransportationModal();
          },
          innerTableData: this.transportationsTableData,
          innerTableColumns: [
            {
              title: "Method",
              dataIndex: "method",
            },
            {
              title: "From",
              dataIndex: "from_address",
              scopedSlots: { customRender: "from_address" },
            },
            {
              title: "To",
              dataIndex: "to_address",
              scopedSlots: { customRender: "to_address" },
            },
            {
              title: "CO2e",
              dataIndex: "co2e_formatted",
            },
            {
              scopedSlots: { customRender: "actions" },
            },
          ],
          isLoading: this.isLoadingTransportations,
        },
        {
          section: "Certifications",
          measure: this.certificationsTableData
            ? this.certificationsTableData.length +
              " " +
              (this.certificationsTableData.length === 1 ? "certification" : "certifications")
            : "-",
          actionButton: "Add Certification",
          actionButtonClicked: () => {
            this.openAddCertificationModal();
          },
          innerTableColumns: [
            {
              title: "Name",
              dataIndex: "name",
            },
            {
              scopedSlots: { customRender: "actions" },
            },
          ],
          innerTableData: this.certificationsTableData,
          isLoading: this.isLoadingCertifications || this.isLoadingCertificationOptions,
        },
        {
          section: "Lifespan",
          measure: "",
          actionButton: "",
          actionButtonClicked: () => {},
          innerTableColumns: [
            {
              title: "Lifespan",
              dataIndex: "lifespan_formatted",
            },
            {
              title: "Usage",
              dataIndex: "usage",
            },
            {
              scopedSlots: { customRender: "actions" },
            },
          ],
          innerTableData: this.lifespansTableData,
          isLoading: this.isLoadingProductLifespans,
        },
        // {
        //   section: 'Features',
        //   measure: '?',
        //   actionButton: 'Add Feature'
        // }
      ];
    },

    hasBannedMaterials() {
      let hasBannedMaterials = false;

      _.each(this.materials, (material) => {
        let m = _.find(this.materialOptions, { name: material.material });
        if (m && m.banned) {
          hasBannedMaterials = true;
        }
      });

      return hasBannedMaterials;
    },
  },
  methods: {
    loadAspectOptions() {
      let vm = this;
      vm.isLoadingAspectOptions = true;
      axios
        .get(window.API_COMMON_BASE + "/aspects")
        .then((r) => {
          vm.isLoadingAspectOptions = false;
          vm.aspectOptions = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error loading aspect options");
        });
    },

    loadMaterialOptions() {
      let vm = this;
      vm.isLoadingMaterialOptions = true;
      axios
        .get(window.API_COMMON_BASE + "/materials")
        .then((r) => {
          vm.isLoadingMaterialOptions = false;
          vm.materialOptions = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error loading material dropdown options");
        });
    },

    loadCertificationOptions() {
      let vm = this;
      vm.isLoadingCertificationOptions = true;
      axios
        .get(window.API_COMMON_BASE + "/certifications")
        .then((r) => {
          vm.isLoadingCertificationOptions = false;
          vm.certificationOptions = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error loading certification options");
        });
    },

    loadTransportOptions() {
      let vm = this;
      vm.isLoadingTransportOptions = true;
      axios
        .get(window.API_COMMON_BASE + "/transportation-methods")
        .then((r) => {
          vm.isLoadingTransportOptions = false;
          vm.transportOptions = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error loading certification options");
        });
    },

    loadMaterials() {
      let vm = this;
      vm.isLoadingMaterials = true;
      axios
        .get(window.API_BASE + "/products/" + this.productId + "/esg/materials")
        .then((r) => {
          vm.isLoadingMaterials = false;
          vm.materials = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error loading materials");
        });
    },

    openAddMaterialModal() {
      this.addMaterialModalVisible = true;
    },

    closeAddMaterialModal() {
      this.addMaterialModalVisible = false;
    },

    handleMaterialAdded() {
      this.addMaterialModalVisible = false;
      eventBus.$emit("product-materials-updated");
      this.loadMaterials();
    },

    handleMaterialDeleted() {
      eventBus.$emit("product-materials-updated");
      this.loadMaterials();
    },

    loadCertifications() {
      let vm = this;
      vm.isLoadingCertifications = true;
      axios
        .get(window.API_BASE + "/products/" + this.productId + "/esg/certifications")
        .then((r) => {
          vm.isLoadingCertifications = false;
          vm.certifications = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error loading certifications");
        });
    },

    openAddCertificationModal() {
      this.addCertificationModalVisible = true;
    },

    closeAddCertificationModal() {
      this.addCertificationModalVisible = false;
    },

    handleCertificationAdded() {
      this.addCertificationModalVisible = false;
      this.loadCertifications();
    },

    handleCertificationDeleted() {
      this.loadCertifications();
    },

    loadTransportations() {
      let vm = this;
      vm.isLoadingTransportations = true;
      axios
        .get(window.API_BASE + "/products/" + this.productId + "/esg/transportations")
        .then((r) => {
          vm.isLoadingTransportations = false;
          vm.transportations = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error loading transportations");
        });
    },

    loadProductLifespans() {
      let vm = this;
      vm.isLoadingProductLifespans = true;
      axios
        .get(window.API_BASE + "/products/" + this.productId + "/esg/lifespans")
        .then((r) => {
          vm.isLoadingProductLifespans = false;
          vm.productLifespans = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error loading product lifespan");
        });
    },

    openAddTransportationModal() {
      this.addTransportationModalVisible = true;
    },

    closeAddTransportationModal() {
      this.addTransportationModalVisible = false;
    },

    handleTransportationAdded() {
      this.addTransportationModalVisible = false;
      this.loadTransportations();
    },

    handleTransportationDeleted() {
      this.loadTransportations();
    },

    isMaterialBanned(material) {
      if (this.materialOptions) {
        let m = _.find(this.materialOptions, { name: material });
        return m ? m.banned : false;
      }
      return false;
    },

    getExpandIcon({ expanded, record, onExpand }) {
      return record.section !== "Lifespan" ? (
        <a-button
          style="font-weight: 500; padding-left: 0; padding-right; 0;"
          type="link"
          {...{
            on: {
              click: onExpand.bind(this, [expanded, record]),
            },
          }}
        >
          <span>{expanded ? "Hide" : "Expand"}</span>
          <a-icon style="font-size: 10px; font-weight: 500;" type={expanded ? "up" : "down"}></a-icon>
        </a-button>
      ) : (
        <a-button style="opacity: 0; cursor: default;"></a-button>
      );
    },
  },
};
</script>

<style lang="scss">
.environment-tab {
  tr.ant-table-expanded-row td > .ant-table-wrapper {
    margin: -5px 0 10px 0 !important;
  }

  .section-icon {
    //margin-right: 10px;
    //color: #1890ff;
  }

  .section-title {
    font-weight: 500;
  }

  .ant-table-row.ant-table-row-level-0 td:last-child {
    text-align: right;
  }

  .actions {
    text-align: right;
    display: inline-block;

    .action-button {
      max-width: 170px;
      min-width: 170px;
      width: 170px;
    }
  }
}
</style>
