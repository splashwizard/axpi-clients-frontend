<template>
  <div class="form-section">
    <div class="form-header">
      <div class="flex">
        <div class="flex-1">
          <h2>Delivery Information</h2>
        </div>
        <div>
          <upload-csv-button-and-modal
            @csvs-uploaded="incrementUpdateKey"
            :addresses="addresses"
            :order-local="orderLocal"
          ></upload-csv-button-and-modal>
        </div>
      </div>
    </div>

    <div class="delivery-information-editor">
      <a-skeleton v-if="isLoading" active />

      <el-collapse v-if="!isLoading" v-model="activePanel" accordion>
        <el-collapse-item
          v-for="(location, i) in orderLocal.delivery_locations"
          :key="i"
          :title="getSectionNameLabel(i)"
          style="position: relative"
        >
          <a-dropdown style="position: absolute; right: 40px; top: 18px" :trigger="['click']">
            <a-button type="link" icon="ellipsis"></a-button>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="#" v-if="orderLocal.delivery_locations.length > 1" @click.prevent="deleteLocation(i)"
                  >Delete location</a
                >
              </a-menu-item>
            </a-menu>
          </a-dropdown>

          <div class="collapse-inner-section">
            <location-editor :addresses="addresses" :location="location"></location-editor>
          </div>
        </el-collapse-item>
      </el-collapse>

      <a-button v-if="!isLoading" icon="plus" @click="addLocation">Add shipping location</a-button>
    </div>
  </div>
</template>

<script>
import LocationEditor from "./DeliveryInformationEditor/LocationEditor";
import axios from "axios";
import UploadCsvButtonAndModal from "./DeliveryInformationEditor/UploadCsvButtonAndModal";
const _ = require("lodash");

const DELIVERY_LOCATION_DATA_TEMPLATE = {
  quantity: null,
  ship_using: null,
  shipping_method: null,
  address_id: null,
  date_shipped: null,
  shipping_cost: null,
  who_paid_shipping_cost: null,
};

export default {
  name: "DeliveryInformationEditor",
  props: ["orderLocal"],
  data() {
    return {
      activePanel: undefined,
      updateKey: 1,

      isLoading: false,
      addresses: [],
    };
  },
  components: { UploadCsvButtonAndModal, LocationEditor },
  mounted() {
    if (!this.orderLocal.delivery_locations) {
      this.orderLocal.delivery_locations = [
        {
          ...DELIVERY_LOCATION_DATA_TEMPLATE,
        },
      ];
      this.activePanel = Number(this.orderLocal.delivery_locations.length - 1);
      this.incrementUpdateKey();
    }
  },
  created() {
    this.loadAddresses();
  },
  methods: {
    loadAddresses() {
      let vm = this;

      vm.isLoading = true;
      axios
        .get(window.API_BASE + "/addresses")
        .then((r) => {
          vm.isLoading = false;
          vm.addresses = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error loading addresses");
        });
    },

    addLocation() {
      this.orderLocal.delivery_locations.push({
        ...DELIVERY_LOCATION_DATA_TEMPLATE,
      });
      this.activePanel = Number(this.orderLocal.delivery_locations.length - 1);
      this.incrementUpdateKey();
    },

    deleteLocation(i) {
      this.orderLocal.delivery_locations = _.filter(this.orderLocal.delivery_locations, function (location, ii) {
        return String(ii) !== String(i);
      });
      this.forceRefresh();
    },

    incrementUpdateKey() {
      this.updateKey += 1;
    },

    forceRefresh() {
      this.$forceUpdate();
    },

    getSectionNameLabel(i) {
      return "Location " + (i + 1);
    },
  },
};
</script>

<style scoped lang="scss">
.el-collapse {
  margin-bottom: 20px;
}
</style>
