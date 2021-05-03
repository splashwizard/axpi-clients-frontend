<template>
  <div>
    <a-button type="primary" icon="plus" @click.prevent="showMethodSelectorModal">Add Specification</a-button>

    <a-modal title="Add Specification" :visible="methodSelectorModalVisible" @cancel="handleMethodSelectorCancel"
             :footer="false">

      <div class="icon-selector">
        <a href="#" @click.prevent="selectMethod('past-order')">
          <div class="icon">
            <a-icon type="dropbox" style="font-size: 30px; color: #97BBF1;"></a-icon>
          </div>
          <div class="caption">
            Past Order
          </div>
        </a>
        <a href="#" @click.prevent="selectMethod('saved')">
          <div class="icon">
            <a-icon type="heart" style="font-size: 30px; color: #97BBF1;"></a-icon>
          </div>
          <div class="caption">
            Saved
          </div>
        </a>
        <a href="#" @click.prevent="selectMethod('create-new')">
          <div class="icon">
            <a-icon type="plus" style="font-size: 30px; color: #97BBF1;"></a-icon>
          </div>
          <div class="caption">
            Create New
          </div>
        </a>
      </div>

    </a-modal>

    <a-modal :width="700"
        title="Add Specification"
        :visible="savedSpecModalVisible"
        @cancel="handleSavedSpecCancel"
        :footer="false">

      <!--      <div class="loading-screen" v-if="isLoading">-->
      <!--        <a-spin/>-->
      <!--      </div>-->
      <loading-screen :is-loading="isSaving"></loading-screen>

      <a-table class="axpi-table"
               :row-selection="specificationRowSelection"
               :columns="specificationColumns"
               :row-key="record => record.id"
               :data-source="specifications"
               :pagination="specificationPagination"
               :loading="isLoadingSpecifications">
        <div slot="type" slot-scope="type">
          {{ formatType(type) }}
        </div>
        <div slot="date" slot-scope="date">
          {{ displayTimeAgo(date) }}
        </div>
        <!--        <div slot="actions" slot-scope="name, record" class="table-actions">-->
        <!--          <a-button @click.prevent="addSpecificationToOptimisation(record)">Add</a-button>-->
        <!--        </div>-->
      </a-table>

      <div>
        <div class="actions text-right">
          <a-button type="primary" icon="plus" :disabled="selectedSpecificationIds.length == 0"
                    @click="addSpecifications">Add Specifications
          </a-button>
        </div>
      </div>

    </a-modal>
  </div>
</template>

<script>
import axios from 'axios';
import Orders from "../../mixins/Orders";
import Dates from "../../mixins/Dates";

const _ = require('lodash');

const SPECIFICATION_COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'product_name',
    sorter: true,
    scopedSlots: {customRender: 'name'}
  },
  {
    title: 'Type',
    dataIndex: 'product_type',
    sorter: true,
    scopedSlots: {customRender: 'type'}
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    sorter: true,
    scopedSlots: {customRender: 'quantity'}
  },
  {
    title: 'Last Updated',
    dataIndex: 'updated_at',
    sorter: true,
    scopedSlots: {customRender: 'date'}
  },
  // {
  //   title: '',
  //   scopedSlots: {customRender: 'actions'},
  //   width: 10
  // }
];

export default {
  name: "AddSpecificationToOptimisationButtonAndModal",
  props: ['optimisation'],
  mixins: [Orders, Dates],
  data() {
    return {
      methodSelectorModalVisible: false,

      savedSpecModalVisible: false,
      serverErrors: [],

      specifications: [],
      specificationPagination: {},
      isLoadingSpecifications: false,
      specificationColumns: SPECIFICATION_COLUMNS,
      selectedSpecificationIds: [],
      isSaving: false
    }
  },
  computed: {
    isLoading() {
      return this.isLoadingSpecifications;
    },

    specificationRowSelection() {
      return {
        onChange: (selectedRowKeys) => {
          this.selectedSpecificationIds = selectedRowKeys;
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
          },
        }),
      }
    },
  },
  methods: {
    showMethodSelectorModal() {
      this.methodSelectorModalVisible = true;
    },

    handleMethodSelectorCancel() {
      this.methodSelectorModalVisible = false;
    },

    showSavedSpecModal() {
      this.savedSpecModalVisible = true;
      this.loadSpecifications();
    },

    handleSavedSpecCancel() {
      this.savedSpecModalVisible = false;
    },

    loadSpecifications(params = {}) {
      let vm = this;
      vm.isLoadingSpecifications = true;
      axios.post(window.API_BASE + '/specifications/search', {
        results_per_page: 10,
        ...params
      }).then(r => {
        const pagination = {...this.specificationPagination};
        // Read total count from server
        pagination.total = r.data.total;
        this.isLoadingSpecifications = false;
        this.specifications = r.data.data;
        this.specificationPagination = pagination;
      }).catch(e => {
        vm.$message.error('Error loading specifications');
        vm.isLoadingSpecifications = false;
        let errors;
        if (typeof e.response.data === 'object') {
          errors = _.flatten(_.toArray(e.response.data.errors));
        } else {
          errors = ['Something went wrong. Please try again.'];
        }
        vm.serverErrors = errors;
      });
    },

    addSpecificationToOptimisation(specification) {
      let vm = this;
      vm.isSaving = true;
      axios.post(window.API_BASE + '/optimisations/' + this.optimisation.id + '/create-from-specification', {
        specification_id: specification.id
      }).then(() => {
        vm.isSaving = false;
        vm.$message.success('Specification added successfully');
        vm.$emit('refresh-optimisation');
      }).catch(e => {
        console.log(e);
        vm.isSaving = false;
        vm.$message.error('Error adding specification');
      });
    },

    selectMethod(method) {
      this.methodSelectorModalVisible = false;
      if (method === 'saved') {
        this.showSavedSpecModal();
      }
    },

    addSpecifications() {
      if (this.selectedSpecificationIds.length == 0) {
        return false
      }
      let vm = this;
      vm.isSaving = true;
      axios.post(window.API_BASE + '/optimisations/' + this.optimisation.id + '/create-from-specifications', {
        specification_ids: vm.selectedSpecificationIds
      }).then(() => {
        vm.isSaving = false;
        vm.$message.success('Specifications added successfully');
        vm.$emit('refresh-optimisation');
      }).catch(e => {
        console.log(e);
        vm.isSaving = false;
        vm.$message.error('Error adding specifications');
      });
    }
  }
}
</script>

<style scoped>
.loading-screen {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 70px;
}

.method-selector {
  margin-bottom: 15px;
}

.icon-selector a {
  flex: 1;
}

.icon-selector .icon {
  margin-left: auto;
  margin-right: auto;
}

.icon-selector .caption {
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.icon-selector a:hover .icon {
  background: #5D9CF4 !important;
}
</style>