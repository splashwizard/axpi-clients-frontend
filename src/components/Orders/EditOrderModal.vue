<template>
  <a-modal v-model="visible"
           class="fullscreen-modal"
           :centered="true"
           title="Update Order"
           :after-close="handleModalClosed"
           :footer="null">

    <!-- Loading  -->
    <a-skeleton v-if="isLoading" active/>
    <!-- / Loading  -->

    <!-- Saving -->
    <loading-screen :is-loading="isSaving"></loading-screen>
    <!-- / Saving -->

    <!-- Loaded -->
    <div v-if="!isLoading && orderLocal">
      <div class="modal-buttons">
        <a-button @click.prevent="() => save(true)">Save</a-button>
      </div>

      <div class="progress-bar">
        <progress-bar></progress-bar>
      </div>

      <!-- Small form -->
      <div>
        <general-information-editor v-if="wizardStage === 0"
                                    :suppliers="suppliers"
                                    :order-local="orderLocal"></general-information-editor>


        <specification-information-editor v-if="wizardStage === 1"
                                          :order-local="orderLocal"></specification-information-editor>

        <additional-information-editor v-if="wizardStage === 2"
                                       :order-local="orderLocal">
        </additional-information-editor>
      </div>
      <!-- / Small form -->
    </div>
    <!-- / Loaded -->

  </a-modal>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import ProgressBar from "./Edit/ProgressBar";
import GeneralInformationEditor from "./Edit/GeneralInformationEditor";
import SpecificationInformationEditor from "./Edit/SpecificationInformationEditor";
import AdditionalInformationEditor from "./Edit/AdditionalInformationEditor";

export default {
  name: "EditOrderModal",
  props: ['suppliers'],
  data() {
    return {
      visible: true,
      orderLocal: null
    }
  },
  components: {
    ProgressBar,
    GeneralInformationEditor,
    SpecificationInformationEditor,
    AdditionalInformationEditor
  },
  computed: {
    ...mapGetters('orderEditor', {
      order: 'order',
      isLoading: 'isLoading',
      wizardStage: 'wizardStage',
      isSaving: 'isSaving'
    })
  },
  mounted() {
    this.orderLocal = {
      ...this.order,
      pos_product_width_unit: 'cm',
      pos_product_depth_unit: 'cm',
      pos_product_height_unit: 'cm',
      pos_weight_supported_unit: 'g',
      usable_area_unit: 'm2',
      pos_product_supported_width_unit: 'cm',
      pos_product_supported_depth_unit: 'cm',
      pos_product_supported_height_unit: 'cm',
      pos_display_width_unit: 'cm',
      pos_display_depth_unit: 'cm',
      pos_display_height_unit: 'cm',
      pos_weight_support_unit: 'g',
      pos_usable_area_of_shelves_unit: 'm2'
    };
  },
  methods: {
    ...mapActions('orderEditor', {
      cancelOrderEdit: 'cancelOrderEdit',
      saveOrder: 'saveOrder'
    }),

    handleModalClosed() {
      this.cancelOrderEdit();
    },

    save(quitAfterSave=false) {
      this.saveOrder({
        order: this.orderLocal,
        quitAfterSave: quitAfterSave
      })
    }
  }
}
</script>

<style scoped lang="scss">
.progress-bar {
  margin-bottom: 40px;
}

.modal-buttons {
  position: fixed;
  top: 11px;
  right: 15px;
  z-index: 1000;
}
</style>
