<template>
  <div>
    <a-skeleton v-if="isLoading" active />

    <!-- Addresses loaded - select address -->
    <div v-if="!isLoading && mode === 'select'">
      <a-radio-group v-model="selectedAddressId" @change="onAddressSelected">
        <a-radio v-for="address in addresses" :style="radioStyle" :value="address.id" :key="address.id">
          {{ formatAddress(address) }}
        </a-radio>
      </a-radio-group>

      <a-alert message="No addresses" v-if="addresses.length === 0" banner />

      <div class="bottom-actions">
        <a-button @click.prevent="startCreatingNewAddress" icon="plus">New Address</a-button>
      </div>
    </div>
    <!-- / Addresses loaded - select address -->

    <!-- Address loaded - create new address -->
    <div v-if="!isLoading && mode === 'create'">
      <a-form layout="vertical" @submit="attemptSaveAddress" :form="form">
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
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="isSaving">Save</a-button>
            <a-button @click="cancelCreatingNewAddress">Cancel</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
    <!-- / Address loaded - create new address -->
  </div>
</template>

<script>
import axios from "axios";
import Addresses from "../../mixins/Addresses";
import Countries from "../../mixins/Countries";

export default {
  name: "AddressSelector",
  props: ["initialAddressId", "resource"],
  mixins: [Addresses, Countries],
  data() {
    return {
      isLoading: false,
      isSaving: false,
      addresses: [],
      selectedAddressId: this.initialAddressId,
      mode: "select", // select or create

      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },

      form: this.$form.createForm(this, { name: "new_address_form" }),
    };
  },
  created() {
    this.loadAddresses();
  },
  methods: {
    loadAddresses() {
      let vm = this;

      vm.isLoading = true;
      axios
        .get(window.API_BASE + "/" + this.resource)
        .then((r) => {
          vm.isLoading = false;
          vm.addresses = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error loading addresses");
        });
    },

    onAddressSelected() {
      this.$emit("address-id-changed", this.selectedAddressId);
    },

    startCreatingNewAddress() {
      this.mode = "create";
    },

    attemptSaveAddress(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.saveAddress(values);
        }
      });
    },

    saveAddress(values) {
      let vm = this;
      vm.isSaving = true;
      axios
        .post(window.API_BASE + "/" + this.resource, values)
        .then((r) => {
          vm.isSaving = false;
          vm.selectedAddressId = r.data.id;
          vm.$emit("address-id-changed", r.data.id);
          vm.form.resetFields();
          vm.loadAddresses();
          vm.mode = "select";
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error saving address");
          vm.isSaving = false;
        });
    },

    cancelCreatingNewAddress() {
      this.form.resetFields();
      this.mode = "select";
    },
  },
};
</script>

<style scoped>
.bottom-actions {
  margin-top: 20px;
}
</style>
