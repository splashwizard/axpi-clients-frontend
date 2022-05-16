<template>
  <a-modal
    centered
    @ok="attemptSaveTransportation"
    :footer="false"
    title="Add Transportation"
    v-model="showModal"
    :confirm-loading="isSaving"
  >
    <!-- Is loading -->
    <div class="loader" v-if="isLoadingAddresses">
      <a-spin></a-spin>
    </div>
    <!-- / Is loading -->

    <!-- Loaded -->
    <div v-if="!isLoadingAddresses">
      <a-form layout="vertical" v-if="screen === 'main'">
        <a-form-item label="Method">
          <a-select v-model="form.method" :disabled="isLoadingTransportationOptions" show-search size="large">
            <a-select-option v-for="method in transportationDropdownOptions" :value="method" :key="method">
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
          <a @click.prevent="newFromAddress" href="#" style="margin-top: 6px; display: block">+ New address</a>
        </a-form-item>

        <a-form-item label="To">
          <a-select v-model="form.to_address_id" show-search size="large">
            <a-select-option v-for="address in addresses" :value="address.id" :key="getKey('to-address', address.id)">
              {{ formatAddress(address) }}
            </a-select-option>
          </a-select>
          <a @click.prevent="newToAddress" href="#" style="margin-top: 6px; display: block">+ New address</a>
        </a-form-item>

        <a-form-item style="padding-bottom: 0; margin-bottom: 0">
          <a-button type="primary" @click.prevent="attemptSaveTransportation">Save Transportation</a-button>
        </a-form-item>
      </a-form>

      <a-form layout="vertical" v-if="screen === 'create'" @submit="attemptSaveAddress" :form="newAddressForm">
        <a-form-item label="Address Line One">
          <a-input
            v-decorator="['address_line_one', { rules: [{ required: true, message: 'Address line one is required' }] }]"
          />
        </a-form-item>
        <a-form-item label="Address Line Two">
          <a-input v-decorator="['address_line_two']" />
        </a-form-item>
        <a-form-item label="City">
          <a-input v-decorator="['city', { rules: [{ required: true, message: 'City is required' }] }]" />
        </a-form-item>
        <a-form-item label="Province">
          <a-input v-decorator="['province', { rules: [{ required: true, message: 'Province is required' }] }]" />
        </a-form-item>
        <a-form-item label="Postcode">
          <a-input v-decorator="['postal_code', { rules: [{ required: true, message: 'Postcode is required' }] }]" />
        </a-form-item>
        <a-form-item label="Country">
          <a-select
            show-search
            v-decorator="['country', { rules: [{ required: true, message: 'Country is required' }] }]"
          >
            <a-select-option :key="i" v-for="(country, i) in countries" :value="country">
              {{ country }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item style="padding-bottom: 0; margin-bottom: 0">
          <a-space>
            <a-button type="primary" html-type="submit" :loading="isSaving">Save</a-button>
            <a-button @click="cancelCreatingNewAddress">Cancel</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
    <!-- / Loaded -->
  </a-modal>
</template>

<script>
import axios from "axios";
import Addresses from "../../../../mixins/Addresses";
const _ = require("lodash");
const METHOD_OPTIONS = ["Air Freight", "Truck"];
import Countries from "../../../../mixins/Countries";

export default {
  name: "AddTransportationModal",
  props: ["visible", "productId", "isLoadingTransportationOptions", "transportationOptions"],
  mixins: [Addresses, Countries],
  data() {
    return {
      form: {
        from_address_id: null,
        to_address_id: null,
        method: null,
      },
      isSaving: false,

      isLoadingAddresses: false,
      addresses: [],

      methodOptions: METHOD_OPTIONS,

      screen: "main", // main or create
      newAddressFor: null,
      newAddressForm: this.$form.createForm(this, { name: "new_address_form" }),
    };
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
      },
    },

    transportationDropdownOptions() {
      if (this.transportationOptions) {
        return _.map(this.transportationOptions, "name");
      }
      return [];
    },
  },

  created() {
    this.loadAddresses();
  },

  methods: {
    closeModal() {
      this.$emit("close-modal");
    },

    loadAddresses() {
      let vm = this;
      vm.isLoadingAddresses = true;
      axios
        .get(window.API_BASE + "/addresses")
        .then((r) => {
          vm.isLoadingAddresses = false;
          vm.addresses = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoadingAddresses = false;
          vm.$message.error("Error loading addresses");
        });
    },

    resetForm() {
      this.form = {
        from_address_id: null,
        to_address_id: null,
        method: null,
      };
    },

    attemptSaveTransportation() {
      let vm = this;
      vm.isSaving = true;

      axios
        .post(window.API_BASE + "/products/" + this.productId + "/esg/transportations", this.form)
        .then(() => {
          vm.isSaving = false;
          vm.resetForm();
          vm.$emit("transportation-added");
        })
        .catch((e) => {
          console.log(e);
          vm.isSaving = false;
          vm.$message.error("Error saving transportation");
        });
    },

    getKey(type, id) {
      return type + "-" + id;
    },

    newToAddress() {
      this.screen = "create";
      this.newAddressFor = "to";
    },

    newFromAddress() {
      this.screen = "create";
      this.newAddressFor = "from";
    },

    cancelCreatingNewAddress() {
      this.screen = "main";
    },

    attemptSaveAddress(e) {
      e.preventDefault();
      this.newAddressForm.validateFields((err, values) => {
        if (!err) {
          this.saveAddress(values);
        }
      });
    },

    saveAddress(values) {
      let vm = this;
      vm.isSaving = true;
      axios
        .post(window.API_BASE + "/addresses", values)
        .then((r) => {
          vm.isSaving = false;
          vm.newAddressForm.resetFields();
          vm.loadAddresses();
          if (this.newAddressFor == "to") {
            this.form.to_address_id = r.data.id;
          }
          if (this.newAddressFor == "from") {
            this.form.from_address_id = r.data.id;
          }
          vm.screen = "main";
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error saving address");
          vm.isSaving = false;
        });
    },
  },
};
</script>

<style scoped></style>
