<template>
  <a-modal
      @ok="attemptSaveTransportation"
      title="Add Transportation"
      v-model="showModal"
      :confirm-loading="isSaving">

    <!-- Is loading -->
    <div class="loader" v-if="isLoadingAddresses">
      <a-spin></a-spin>
    </div>
    <!-- / Is loading -->

    <!-- Loaded -->
    <div v-if="!isLoadingAddresses">
      <a-form layout="vertical">
        <a-form-item label="Method">
          <a-select v-model="form.method" show-search size="large">
            <a-select-option v-for="method in methodOptions" :value="method" :key="method">
              {{ method }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="From">
          <a-select v-model="form.from_address_id" show-search size="large">
            <a-select-option v-for="address in addresses" :value="address.id" :key="getKey('address', address.id)">
              {{ formatAddress(address) }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="To">
          <a-select v-model="form.to_address_id" show-search size="large">
            <a-select-option v-for="address in addresses" :value="address.id" :key="getKey('to-address', address.id)">
              {{ formatAddress(address) }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </div>
    <!-- / Loaded -->

  </a-modal>
</template>

<script>
import axios from "axios";
import Addresses from "../../../../mixins/Addresses";

const METHOD_OPTIONS = ['Air Freight', 'Truck'];

export default {
  name: "AddTransportationModal",
  props: ['visible', 'productId'],
  mixins: [Addresses],
  data() {
    return {
      form: {
        from_address_id: null,
        to_address_id: null,
        method: null
      },
      isSaving: false,

      isLoadingAddresses: false,
      addresses: [],

      methodOptions: METHOD_OPTIONS
    }
  },

  computed: {
    showModal: {
      get() {
        return this.visible;
      },
      set(val) {
        if (!val) {
          this.closeModal();
        }
      }
    }
  },

  created() {
    this.loadAddresses();
  },

  methods: {
    closeModal() {
      this.$emit('close-modal');
    },

    loadAddresses() {
      let vm = this;
      vm.isLoadingAddresses = true;
      axios.get(window.API_BASE + '/addresses').then(r => {
        vm.isLoadingAddresses = false;
        vm.addresses = r.data;
      }).catch(e => {
        console.log(e);
        vm.isLoadingAddresses = false;
        vm.$message.error('Error loading addresses');
      });
    },

    resetForm() {
      this.form = {
        from_address_id: null,
        to_address_id: null,
        method: null
      };
    },

    attemptSaveTransportation() {
      let vm = this;
      vm.isSaving = true;

      axios.post(window.API_BASE + '/products/' + this.productId + '/esg/transportations', this.form).then(() => {
        vm.isSaving = false;
        vm.resetForm();
        vm.$emit('transportation-added');
      }).catch(e => {
        console.log(e);
        vm.isSaving = false;
        vm.$message.error('Error saving transportation');
      });
    },

    getKey(type, id) {
      return type + '-' + id;
    }
  }
}
</script>

<style scoped>

</style>