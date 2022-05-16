<template>
  <div>
    <div class="form-header">
      <a-page-header v-if="selectedModel" :title="selectedModel.name" @back="selectModel(null)" />

      <div class="form-actions" v-if="!selectedModel">
        <a-select
          placeholder="Please select a model"
          v-model="selectedCategory"
          style="width: 250px; margin-right: 10px; top: -1px"
        >
          <a-select-option :value="null">Show all</a-select-option>
          <a-select-option value="ecma">ECMA (Folding carton)</a-select-option>
          <a-select-option value="fefco">FEFCO (Corrugated containers)</a-select-option>
          <a-select-option value="envelopes-folders-bags">Envelopes, Folders, Bags</a-select-option>
        </a-select>
        <a-input-search placeholder="Search models" style="width: 200px" v-model="searchQuery" />
      </div>
    </div>
    <!--    <div class="change-model-button-wrapper">-->
    <!--      <a-button v-if="selectedModel" icon="arrow-left"-->
    <!--                @click="selectModel(null)">Change model-->
    <!--      </a-button>-->
    <!--    </div>-->

    <div class="loading-screen" v-if="isLoadingTemplates">
      <a-spin />
    </div>

    <div class="model-details-wrapper">
      <model-selector
        v-if="!selectedModel"
        :search-query="searchQuery"
        :selected-category="selectedCategory"
        :models="packagingSpecs"
        :selected-model="selectedModel"
        @select-model="selectModel"
      ></model-selector>

      <!-- Model selected -->
      <div class="model-details-editor" v-if="selectedModel">
        <a-row>
          <a-col :span="12">
            <a-form layout="vertical">
              <!-- Length -->
              <a-form-item v-if="selectedModel.length" label="Length">
                <a-input
                  size="large"
                  addon-after="mm"
                  style="width: 70%"
                  v-model="spec.box.length"
                  @blur="forceRefresh"
                />
              </a-form-item>
              <!-- / Length -->

              <!-- Width -->
              <a-form-item v-if="selectedModel.width" label="Width">
                <a-input
                  addon-after="mm"
                  size="large"
                  style="width: 70%"
                  v-model="spec.box.width"
                  @blur="forceRefresh"
                />
              </a-form-item>
              <!-- / Width -->

              <!-- Depth -->
              <a-form-item v-if="selectedModel.depth" label="Depth">
                <a-input
                  addon-after="mm"
                  size="large"
                  style="width: 70%"
                  v-model="spec.box.depth"
                  @blur="forceRefresh"
                />
              </a-form-item>
              <!-- / Depth -->

              <!-- Diameter -->
              <a-form-item v-if="selectedModel.diameter" label="Diameter">
                <a-input
                  addon-after="mm"
                  size="large"
                  style="width: 70%"
                  v-model="spec.box.diameter"
                  @blur="forceRefresh"
                />
              </a-form-item>
              <!-- / Diameter -->

              <!-- Breadth -->
              <a-form-item v-if="selectedModel.breadth" label="Breadth">
                <a-input
                  addon-after="mm"
                  size="large"
                  style="width: 70%"
                  v-model="spec.box.breadth"
                  @blur="forceRefresh"
                />
              </a-form-item>
              <!-- / Breadth -->

              <!-- Th - Thickness -->
              <a-form-item v-if="selectedModel['th-thickness']" label="Th">
                <a-input
                  addon-after="mm"
                  size="large"
                  style="width: 70%"
                  v-model="spec.box.th_thickness"
                  @blur="forceRefresh"
                />
              </a-form-item>
              <!-- / Th - Thickness -->

              <!-- C -->
              <a-form-item v-if="selectedModel['c-thickness']" label="C">
                <a-input addon-after="mm" size="large" style="width: 70%" v-model="spec.box.c" @blur="forceRefresh" />
              </a-form-item>
              <!-- / C -->

              <!-- h -->
              <a-form-item v-if="selectedModel['h']" label="h">
                <a-input addon-after="mm" size="large" style="width: 70%" v-model="spec.box.h" @blur="forceRefresh" />
              </a-form-item>
              <!-- / h -->

              <!-- Angle -->
              <a-form-item v-if="selectedModel['angle']" label="Angle">
                <a-input
                  addon-after="deg"
                  size="large"
                  style="width: 70%"
                  v-model="spec.box.angle"
                  @blur="forceRefresh"
                />
              </a-form-item>
              <!-- / Angle -->

              <!-- Radius -->
              <a-form-item v-if="selectedModel['radius']" label="Radius">
                <a-input
                  addon-after="mm"
                  size="large"
                  style="width: 70%"
                  v-model="spec.box.radius"
                  @blur="forceRefresh"
                />
              </a-form-item>
              <!-- / Radius -->

              <!-- Sw thickness -->
              <a-form-item v-if="selectedModel['sw-thickness']" label="Sw Thickness (mm)">
                <a-input
                  addon-after="mm"
                  size="large"
                  style="width: 70%"
                  v-model="spec.box.radius"
                  @blur="forceRefresh"
                />
              </a-form-item>
              <!-- / Sw thickness -->

              <!-- Dimension type -->
              <!--              <div v-if="selectedModel['dimension-type']">-->
              <!--                Dimension type changer-->
              <!--              </div>-->
              <!-- / Dimension type -->
            </a-form>
          </a-col>
          <a-col :span="12">
            <a-tabs>
              <a-tab-pane key="2d" tab="2D Image">
                <div class="flat-image-wrapper">
                  <img class="flat-image" :src="getTwoDimensionalImageForModel(this.selectedModel)" alt="2D Image" />
                </div>
              </a-tab-pane>
              <a-tab-pane key="3d" tab="3D Image">
                <div class="flat-image-wrapper">
                  <img class="flat-image" :src="getThreeDimensionalImageForModel(this.selectedModel)" alt="3D Image" />
                </div>
              </a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>
      </div>
      <!-- / Model selected -->

      <!-- Cardboard Details -->
      <div class="cardboard-details" v-if="selectedModel" :key="cardboardUpdateKey">
        <h2>Cardboard Used</h2>

        <a-form-item label="Type of Cardboard">
          <a-select
            v-model="spec.box.cardboard.cardboard_type"
            size="large"
            style="width: 280px"
            @change="incrementCardboardUpdateKey"
          >
            <a-select-option value="corrugated-cardboard"> Corrugated Cardboard </a-select-option>
            <a-select-option value="paper-board"> Paper Board </a-select-option>
            <a-select-option value="matt-board"> Matt Board </a-select-option>
          </a-select>
        </a-form-item>

        <corrugated-cardboard-properties
          :cardboard="spec.box.cardboard"
          @property-changed="incrementCardboardUpdateKey"
        >
        </corrugated-cardboard-properties>
      </div>
      <!-- / Cardboard Details -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ModelSelector from "./BoxesSpecificationEditor/ModelSelector";
import Images from "../../../../../mixins/Images";
import CorrugatedCardboardProperties from "../PosSpecificationEditor/CardboardUsedEditor/CorrugatedCardboardProperties";
const _ = require("lodash");

export default {
  name: "BoxesSpecificationEditor",
  props: ["spec"],
  data() {
    return {
      isLoadingTemplates: true,
      packagingSpecs: [],
      selectedModel: null,
      selectedCategory: null,
      searchQuery: "",
      cardboardUpdateKey: 1,
    };
  },
  mixins: [Images],
  components: { ModelSelector, CorrugatedCardboardProperties },
  mounted() {
    if (!this.spec.box) {
      this.spec.box = {
        model_id: null,
        length: null,
        width: null,
        depth: null,
        diameter: null,
        breadth: null,
        th_thickness: null,
        c: null,
        h: null,
        angle: null,
        radius: null,
        sw_thickness: null,
        dimension_type: null,
        cardboard: {
          cardboard_type: null,
          area_used: null,
          area_used_unit: "m2",
          lining_one_details: {},
          fluting_one_details: {},
          lining_two_details: {},
          fluting_two_details: {},
          lining_three_details: {},
          fluting_three_details: {},
          lining_four_details: {},
        },
      };
    }
    this.loadTemplates();
  },
  methods: {
    incrementCardboardUpdateKey() {
      this.cardboardUpdateKey += 1;
    },

    loadTemplates() {
      let vm = this;
      vm.isLoadingTemplates = true;
      axios
        .get(window.API_COMMON_BASE + "/packaging-specs")
        .then((r) => {
          vm.packagingSpecs = r.data;
          vm.isLoadingTemplates = false;
          if (vm.spec.box.model_id) {
            vm.selectedModel = _.find(vm.packagingSpecs, { id: vm.spec.box.model_id });
          }
        })
        .catch((e) => {
          console.log(e);
          vm.$message.error("Error loading packaging specs");
        });
    },

    selectModel(model) {
      this.selectedModel = model;
      this.spec.box.model_id = model ? model.id : null;
    },

    forceRefresh() {
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    getTwoDimensionalImageForModel(model) {
      return "https://api.axiomdata.io/packaging/" + model.name + ".png";
    },

    getThreeDimensionalImageForModel(model) {
      return "https://api.axiomdata.io/packaging/" + model.name + "_3d.png";
    },
  },
};
</script>

<style scoped>
.loading-screen {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 70px;
}

.form-header {
  display: flex;
}

.form-header-title {
  flex: 1;
}

.form-header-action {
  flex-shrink: 1;
}

.form-header {
  margin-bottom: 10px;
}

/*.change-model-button-wrapper {*/
/*  margin-bottom: 30px;*/
/*}*/

.model-details-wrapper {
  padding-bottom: 55px;
}

.flat-image-wrapper {
  text-align: center;
}

.flat-image {
  /*width: auto;*/
  /*height: 300px;*/
  width: 100%;
  object-fit: contain;
  margin: 0 auto;
}

.cardboard-details {
  padding-top: 30px;
}

.cardboard-details h2 {
  padding-bottom: 15px;
}
</style>
