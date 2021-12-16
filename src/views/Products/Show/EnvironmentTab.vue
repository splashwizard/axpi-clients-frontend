<template>
  <div class="environment-tab">
    <a-table class="axpi-table" :columns="columns" :data-source="tableData" :pagination="false">
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
          {{ from_address ? formatAddress(from_address) : '-' }}
        </template>
        <template slot="to_address" slot-scope="to_address">
          {{ to_address ? formatAddress(to_address) : '-' }}
        </template>
        <template slot="actions" slot-scope="actions, innerRow">
          <div class="actions">
            <delete-property-button
                @material-deleted="handleMaterialDeleted"
                @certification-deleted="handleCertificationDeleted"
                @transportation-deleted="handleTransportationDeleted"
                :product-id="productId" :type="row.section" :id="innerRow.id"></delete-property-button>
          </div>
        </template>
      </a-table>

      <template slot="actions" slot-scope="actions, record">
        <div v-if="record.actionButton" class="actions">
          <a-button class="action-button" type="primary" icon="plus" @click.prevent="record.actionButtonClicked">{{
              record.actionButton
            }}
          </a-button>
        </div>
      </template>
    </a-table>

    <add-material-modal :product-id="productId"
                        :visible="addMaterialModalVisible"
                        @material-added="handleMaterialAdded"
                        @close-modal="closeAddMaterialModal"></add-material-modal>

    <add-transportation-modal :product-id="productId"
                        :visible="addTransportationModalVisible"
                        @transportation-added="handleTransportationAdded"
                        @close-modal="closeAddTransportationModal"></add-transportation-modal>


    <add-certification-modal :product-id="productId"
                             :visible="addCertificationModalVisible"
                             @certification-added="handleCertificationAdded"
                             @close-modal="closeAddCertificationModal"></add-certification-modal>
  </div>
</template>

<script>
import axios from 'axios';
import Addresses from "../../../mixins/Addresses";
import {mapGetters} from 'vuex';
import AddMaterialModal from "./EnvironmentTab/AddMaterialModal";
import AddCertificationModal from "./EnvironmentTab/AddCertificationModal";
import DeletePropertyButton from "./EnvironmentTab/DeletePropertyButton";
import AddTransportationModal from "./EnvironmentTab/AddTransportationModal";
const _ = require('lodash');

const columns = [
  {
    title: 'Section',
    dataIndex: 'section'
  },
  {
    title: 'Measure',
    dataIndex: 'measure'
  },
  {
    title: '',
    dataIndex: 'actions',
    scopedSlots: {customRender: 'actions'}
  }
];

export default {
  name: "EnvironmentTab",
  components: {DeletePropertyButton, AddMaterialModal, AddCertificationModal, AddTransportationModal},
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
      addTransportationModalVisible: false
    }
  },
  created() {
    this.loadMaterials();
    this.loadCertifications();
    this.loadTransportations();
  },
  computed: {
    ...mapGetters('productViewer', {
      product: 'product'
    }),

    productId() {
      return this.product['_id'];
    },

    materialsTableData() {
      return _.map(this.materials, material => {
        return {
          weight_formatted: (material.weight && material.weight_unit) ? (material.weight + ' ' + material.weight_unit) : '-',
          ...material
        };
      });
    },

    certificationsTableData() {
      return _.map(this.certifications, certification => {
        return certification;
      });
    },

    transportationsTableData() {
      return _.map(this.transportations, transportation => {
        return transportation;
      });
    },

    tableData() {
      return [
        {
          section: 'Materials',
          measure: '?',
          actionButton: 'Add Material',
          actionButtonClicked: () => {
            this.openAddMaterialModal()
          },
          innerTableColumns: [
            {
              title: 'Aspect',
              dataIndex: 'aspect'
            },
            {
              title: 'Material',
              dataIndex: 'material'
            },
            {
              title: 'Weight',
              dataIndex: 'weight_formatted'
            },
            {
              title: 'CO2e',
              dataIndex: 'CO2e'
            },
            {
              title: 'Water',
              dataIndex: 'water'
            },
            {
              scopedSlots: {customRender: 'actions'}
            }
          ],
          innerTableData: this.materialsTableData,
          isLoading: this.isLoadingMaterials
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
          section: 'Transport',
          measure: '?',
          actionButton: 'Add Transport',
          actionButtonClicked: () => {
            this.openAddTransportationModal()
          },
          innerTableData: this.transportationsTableData,
          innerTableColumns: [
            {
              title: 'Method',
              dataIndex: 'method'
            },
            {
              title: 'From',
              dataIndex: 'from_address',
              scopedSlots: {customRender: 'from_address'}
            },
            {
              title: 'To',
              dataIndex: 'to_address',
              scopedSlots: {customRender: 'to_address'}
            },
            {
              scopedSlots: {customRender: 'actions'}
            }
          ],
          isLoading: this.isLoadingTransportations
        },
        {
          section: 'Certifications',
          measure: this.certificationsTableData ? this.certificationsTableData.length + ' ' + (this.certificationsTableData.length === 1 ? 'certification' : 'certifications') : '-',
          actionButton: 'Add Certification',
          actionButtonClicked: () => {
            this.openAddCertificationModal()
          },
          innerTableColumns: [
            {
              title: 'Name',
              dataIndex: 'name'
            },
            {
              scopedSlots: {customRender: 'actions'}
            }
          ],
          innerTableData: this.certificationsTableData,
          isLoading: this.isLoadingCertifications
        },
        // {
        //   section: 'Features',
        //   measure: '?',
        //   actionButton: 'Add Feature'
        // }
      ];
    }
  },
  methods: {
    loadMaterials() {
      let vm = this;
      vm.isLoadingMaterials = true;
      axios.get(window.API_BASE + '/products/' + this.productId + '/esg/materials').then(r => {
        vm.isLoadingMaterials = false;
        vm.materials = r.data;
      }).catch(e => {
        console.log(e);
        vm.$message.error('Error loading materials');
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
      this.loadMaterials();
    },

    handleMaterialDeleted() {
      this.loadMaterials();
    },

    loadCertifications() {
      let vm = this;
      vm.isLoadingCertifications = true;
      axios.get(window.API_BASE + '/products/' + this.productId + '/esg/certifications').then(r => {
        vm.isLoadingCertifications = false;
        vm.certifications = r.data;
      }).catch(e => {
        console.log(e);
        vm.$message.error('Error loading certifications');
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
      axios.get(window.API_BASE + '/products/' + this.productId + '/esg/transportations').then(r => {
        vm.isLoadingTransportations = false;
        vm.transportations = r.data;
      }).catch(e => {
        console.log(e);
        vm.$message.error('Error loading transportations');
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
    }
  }
}
</script>

<style scoped lang="scss">
.environment-tab {
  tr.ant-table-expanded-row td > .ant-table-wrapper {
    margin: -5px 0 10px 0 !important;
  }
}

.actions {
  text-align: right;

  .action-button {
    width: 100%;
    max-width: 170px;
  }
}
</style>