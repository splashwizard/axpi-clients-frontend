<template>
  <div>
    <loading-screen :is-loading="isSaving"></loading-screen>
    <a-row :gutter="70">
      <a-col :span="12">
        <a-form layout="vertical">
          <a-form-item label="Quantity">
            <a-input size="large" v-model="location.quantity" />
          </a-form-item>

          <a-form-item label="Shipping Address">
            <a-select v-model="location.address_id" show-search size="large" @change="forceRefresh">
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0" />
                <div
                  style="padding: 4px 8px; cursor: pointer"
                  @mousedown="(e) => e.preventDefault()"
                  @click="startCreatingNewAddress"
                >
                  <a-icon type="plus" />
                  Add address
                </div>
              </div>
              <a-select-option v-for="address in addresses" :value="address.id" :key="address.id">
                {{ formatAddress(address) }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="Ship Using">
            <a-select v-model="location.ship_using" show-search size="large" @change="forceRefresh">
              <a-select-option v-for="option in shipUsingOptions" :value="option.value" :key="option.value">
                {{ option.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="Shipping Method">
            <a-select v-model="location.shipping_method" show-search size="large" @change="forceRefresh">
              <a-select-option v-for="option in shippingMethodOptions" :value="option.value" :key="option.value">
                {{ option.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="Date Shipped">
            <a-date-picker @change="forceRefresh" size="large" v-model="location.date_shipped" />
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <a-modal
      :centered="true"
      :width="700"
      :mask-closable="false"
      v-model="createAddressModalVisible"
      title="Create Address"
      @ok="attemptSaveAddress"
    >
      <a-form layout="vertical" @submit="attemptSaveAddress" :form="newAddressForm">
        <a-form-item label="Address Line One">
          <a-input
            size="large"
            v-decorator="['address_line_one', { rules: [{ required: true, message: 'Address line one is required' }] }]"
          />
        </a-form-item>
        <a-form-item label="Address Line Two">
          <a-input size="large" v-decorator="['address_line_two']" />
        </a-form-item>
        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-item label="City">
              <a-input
                size="large"
                v-decorator="['city', { rules: [{ required: true, message: 'City is required' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Province">
              <a-input
                size="large"
                v-decorator="['province', { rules: [{ required: true, message: 'Province is required' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-item label="Postcode">
              <a-input
                size="large"
                v-decorator="['postal_code', { rules: [{ required: true, message: 'Postcode is required' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Country">
              <a-select
                size="large"
                show-search
                v-decorator="['country', { rules: [{ required: true, message: 'Country is required' }] }]"
              >
                <a-select-option :key="i" v-for="(country, i) in countries" :value="country">
                  {{ country }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div slot="footer">
        <a-button @click="cancelCreatingNewAddress">Cancel</a-button>
        <a-button type="primary" @click="attemptSaveAddress" :loading="isSaving">Save</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import Addresses from "../../../../../mixins/Addresses";
import Countries from "../../../../../mixins/Countries";
import axios from "axios";

const SHIP_USING_OPTIONS = [
  {
    label: "Option 1",
    value: "option-1",
  },
  {
    label: "Option 2",
    value: "option-2",
  },
];

const SHIPPING_METHOD_OPTIONS = [
  {
    label: "Option 1",
    value: "option-1",
  },
];

export default {
  name: "LocationEditor",
  props: ["location", "addresses"],
  mixins: [Addresses, Countries],
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      shipUsingOptions: SHIP_USING_OPTIONS,
      shippingMethodOptions: SHIPPING_METHOD_OPTIONS,

      mode: "select", //select or create,
      isSaving: false,
      newAddressForm: this.$form.createForm(this, { name: "new_address_form" }),

      createAddressModalVisible: false,
    };
  },
  methods: {
    forceRefresh() {
      this.$forceUpdate();
    },

    startCreatingNewAddress() {
      this.createAddressModalVisible = true;
    },

    attemptSaveAddress(e) {
      e.preventDefault();
      this.newAddressForm.validateFields((err, values) => {
        if (!err) {
          this.saveAddress(values);
          this.newAddressForm.resetFields();
          this.createAddressModalVisible = false;
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
          vm.addresses.push(r.data);
          vm.location.address_id = r.data.id;
          vm.newAddressForm.resetFields();
          vm.mode = "select";
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error saving address");
          vm.isSaving = false;
        });
    },

    cancelCreatingNewAddress() {
      this.newAddressForm.resetFields();
      this.createAddressModalVisible = false;
    },
  },
};
</script>

<style scoped></style>
