<template>
  <div class="axpi-form width-xl">
    <!-- Delivery information -->

    <!--            <address-selector-->
    <!--                    :initial-address-id="orderLocal.address_id"-->
    <!--                    @address-id-changed="updateOrderAddressId"-->
    <!--                    resource="addresses"-->
    <!--            ></address-selector>-->
    <delivery-information-editor :order-local="orderLocal"></delivery-information-editor>

    <!-- / Delivery Information -->

    <!-- Chemicals -->
    <div class="form-section">
      <div class="form-header">
        <h2>Chemicals</h2>
      </div>
      <chemicals-editor :chemicals="orderLocal.chemicals" @chemicals-updated="setChemicals"></chemicals-editor>
    </div>
    <!-- / Chemicals -->

    <!-- Consumables -->
    <!--        <div class="form-section">-->
    <!--            <div class="form-header">-->
    <!--                <h2>Consumables</h2>-->
    <!--            </div>-->
    <!--        </div>-->
    <!-- / Consumables -->

    <!-- Additional Information -->
    <div class="form-section">
      <div class="form-header">
        <h2>Additional Information</h2>
      </div>
      <a-textarea
        v-model="orderLocal.additional_information"
        placeholder="Enter additional information here..."
        :rows="4"
      />
    </div>
    <!-- / Additional Information -->

    <!-- Form footer -->
    <div class="form-footer">
      <a-button size="large" @click="goToPreviousStage" class="button-space-right">
        <a-icon type="arrow-left"></a-icon>
        Go Back
      </a-button>

      <a-button size="large" type="primary" @click="saveAndQuit"> Save And Quit </a-button>
    </div>
    <!-- / Form Footer -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
// import AddressSelector from "../../Addresses/AddressSelector";
import ChemicalsEditor from "../../Chemicals/ChemicalsEditor";
import DeliveryInformationEditor from "./AdditionalInformationEditor/DeliveryInformationEditor";

export default {
  name: "AdditionalInformationEditor",
  props: ["orderLocal"],
  components: { ChemicalsEditor, DeliveryInformationEditor },
  data() {
    return {
      updateKey: 1,
    };
  },
  created() {
    if (!this.orderLocal.chemicals) {
      this.orderLocal.chemicals = [];
    }
  },
  methods: {
    ...mapActions("orderEditor", {
      goToPreviousStage: "goToPreviousStage",
      saveOrder: "saveOrder",
    }),

    incrementUpdateKey() {
      this.updateKey = this.updateKey + 1;
    },

    updateOrderAddressId(id) {
      this.orderLocal.address_id = id;
    },

    setChemicals(chemicals) {
      this.orderLocal.chemicals = chemicals;
    },

    saveAndQuit() {
      this.saveOrder({
        order: this.orderLocal,
        quitAfterSave: true,
      });
    },
  },
};
</script>

<style scoped></style>
