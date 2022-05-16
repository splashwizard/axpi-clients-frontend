<template>
  <div>
    <!-- Selected address -->
    <div class="address-selector-link" @click.prevent="openSelectAddressModal">
      <div class="left">
        <a-icon type="environment" />
      </div>
      <div class="right">
        {{
          selectedAddress
            ? formatAddressShort(selectedAddress, "Deliver to " + user.client.name + " - ")
            : "No address selected"
        }}
      </div>
    </div>
    <!-- / Selected address -->

    <a-modal centered title="Select Address" v-model="addressSelectorVisible" :footer="null">
      <!-- Is Loading -->
      <div class="loader" v-if="isLoading">
        <a-spin></a-spin>
      </div>
      <!-- / Is Loading -->

      <!-- Addresses -->
      <div v-if="view === 'list'" class="addresses">
        <div v-for="(address, i) in addresses" :key="i" class="address-selection">
          <a-button @click.prevent="() => selectAddressAndCloseModal(address)" block
            >{{ formatAddress(address) }}
          </a-button>
        </div>

        <div class="add-address-button">
          <a-button type="link" @click.prevent="() => setView('create')">Or add a new address</a-button>
        </div>
      </div>
      <!-- / Addresses -->

      <!-- Create view -->
      <div v-if="view === 'create'">
        <a-form layout="vertical" @submit="attemptSaveAddress" :form="form">
          <a-form-item label="Address Line One">
            <a-input
              v-decorator="[
                'address_line_one',
                { rules: [{ required: true, message: 'Address line one is required' }] },
              ]"
            />
          </a-form-item>
          <a-form-item label="Address Line Two">
            <a-input v-decorator="['address_line_two']" />
          </a-form-item>
          <a-form-item label="City">
            <a-input v-decorator="['city', { rules: [{ required: true, message: 'City is required' }] }]" />
          </a-form-item>
          <a-row :gutter="20">
            <a-col :span="12">
              <a-form-item label="Province">
                <a-input v-decorator="['province', { rules: [{ required: true, message: 'Province is required' }] }]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Postcode">
                <a-input
                  v-decorator="['postal_code', { rules: [{ required: true, message: 'Postcode is required' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>

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
              <a-button @click="() => setView('list')">Cancel</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
      <!-- / Create view -->
    </a-modal>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import Addresses from "../../../mixins/Addresses";
import Countries from "../../../mixins/Countries";

export default {
  name: "AddressSelectorInline",
  mixins: [Addresses, Countries],
  data() {
    return {
      isLoading: false,
      addresses: [],

      view: "list", // [list, create]

      addressSelectorVisible: false,

      form: this.$form.createForm(this, { name: "new_address_form" }),
    };
  },
  computed: {
    ...mapGetters("shop", {
      selectedAddress: "selectedAddress",
    }),

    ...mapGetters("auth", {
      user: "user",
    }),
  },
  methods: {
    ...mapActions("shop", {
      selectAddress: "selectAddress",
    }),

    setView(view) {
      this.view = view;
    },

    openSelectAddressModal() {
      this.addressSelectorVisible = true;
      this.view = "list"; // view or create
      this.fetch();
    },

    selectAddressAndCloseModal(address) {
      this.selectAddress(address);
      this.addressSelectorVisible = false;
    },

    fetch() {
      let vm = this;
      axios
        .get(window.API_BASE + "/addresses")
        .then((r) => {
          vm.isLoading = false;
          vm.addresses = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
        });
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
        .post(window.API_BASE + "/addresses", values)
        .then((r) => {
          vm.isSaving = false;
          vm.selectAddress(r.data);
          vm.form.resetFields();
          vm.view = "list";
          vm.addressSelectorVisible = false;
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

<style scoped lang="scss">
.addresses {
  text-align: center;

  .address-selection {
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.address-selector-link {
  cursor: pointer;
  color: #1890ff;
  display: flex;

  .left {
    flex-shrink: 1;
    padding-right: 10px;
  }

  .right {
    flex-grow: 1;
  }
}

.loader {
  text-align: center;
}

.add-address-button {
  margin-top: 10px;
}
</style>
