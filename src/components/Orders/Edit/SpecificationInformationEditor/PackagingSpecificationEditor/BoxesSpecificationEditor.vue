<template>
  <div>
    <div class="form-header">
      <h2 class="form-header-title">Model</h2>
    </div>
    <div class="change-model-button-wrapper">
      <a-button v-if="selectedModel"
                @click="selectModel(null)">Change model
      </a-button>
    </div>

    <div class="loading-screen" v-if="isLoadingTemplates">
      <a-spin/>
    </div>

    <div class="model-details-wrapper">
      <model-selector v-if="!selectedModel"
                      :models="packagingSpecs" :selected-model="selectedModel"
                      @select-model="selectModel"></model-selector>

      <!-- Model selected -->
      <div class="model-details-editor" v-if="selectedModel">

        <a-row>
          <a-col :span="12">
            <a-form layout="vertical">

              <!-- Length -->
              <a-form-item v-if="selectedModel.length" label="Length (mm)">
                <a-input-group compact>
                  <a-input size="large" style="width: 70%"
                           v-model="orderLocal.packaging_box_specification.length"
                           @blur="forceRefresh"/>
                </a-input-group>
              </a-form-item>
              <!-- / Length -->

              <!-- Width -->
              <a-form-item v-if="selectedModel.width" label="Width (mm)">
                <a-input-group compact>
                  <a-input size="large" style="width: 70%"
                           v-model="orderLocal.packaging_box_specification.width"
                           @blur="forceRefresh"/>
                </a-input-group>
              </a-form-item>
              <!-- / Width -->

              <!-- Depth -->
              <a-form-item v-if="selectedModel.depth" label="Depth (mm)">
                <a-input-group compact>
                  <a-input size="large" style="width: 70%"
                           v-model="orderLocal.packaging_box_specification.depth"
                           @blur="forceRefresh"/>
                </a-input-group>
              </a-form-item>
              <!-- / Depth -->

              <!-- Diameter -->
              <a-form-item v-if="selectedModel.diameter" label="Diameter (mm)">
                <a-input-group compact>
                  <a-input size="large" style="width: 70%"
                           v-model="orderLocal.packaging_box_specification.diameter"
                           @blur="forceRefresh"/>
                </a-input-group>
              </a-form-item>
              <!-- / Diameter -->

              <!-- Breadth -->
              <a-form-item v-if="selectedModel.breadth" label="Breadth (mm)">
                <a-input-group compact>
                  <a-input size="large" style="width: 70%"
                           v-model="orderLocal.packaging_box_specification.breadth"
                           @blur="forceRefresh"/>
                </a-input-group>
              </a-form-item>
              <!-- / Breadth -->

              <!-- Th - Thickness -->
              <a-form-item v-if="selectedModel['th-thickness']" label="Th (mm)">
                <a-input-group compact>
                  <a-input size="large" style="width: 70%"
                           v-model="orderLocal.packaging_box_specification.th_thickness"
                           @blur="forceRefresh"/>
                </a-input-group>
              </a-form-item>
              <!-- / Th - Thickness -->

              <!-- C -->
              <a-form-item v-if="selectedModel['c-thickness']" label="C (mm)">
                <a-input-group compact>
                  <a-input size="large" style="width: 70%"
                           v-model="orderLocal.packaging_box_specification.c"
                           @blur="forceRefresh"/>
                </a-input-group>
              </a-form-item>
              <!-- / C -->

              <!-- h -->
              <a-form-item v-if="selectedModel['h']" label="h (mm)">
                <a-input-group compact>
                  <a-input size="large" style="width: 70%"
                           v-model="orderLocal.packaging_box_specification.h"
                           @blur="forceRefresh"/>
                </a-input-group>
              </a-form-item>
              <!-- / h -->

              <!-- Angle -->
              <a-form-item v-if="selectedModel['angle']" label="Angle (deg)">
                <a-input-group compact>
                  <a-input size="large" style="width: 70%"
                           v-model="orderLocal.packaging_box_specification.angle"
                           @blur="forceRefresh"/>
                </a-input-group>
              </a-form-item>
              <!-- / Angle -->

              <!-- Radius -->
              <a-form-item v-if="selectedModel['radius']" label="Radius (mm)">
                <a-input-group compact>
                  <a-input size="large" style="width: 70%"
                           v-model="orderLocal.packaging_box_specification.radius"
                           @blur="forceRefresh"/>
                </a-input-group>
              </a-form-item>
              <!-- / Radius -->

              <!-- Sw thickness -->
              <a-form-item v-if="selectedModel['sw-thickness']" label="Sw Thickness (mm)">
                <a-input-group compact>
                  <a-input size="large" style="width: 70%"
                           v-model="orderLocal.packaging_box_specification.radius"
                           @blur="forceRefresh"/>
                </a-input-group>
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
                <img class="flat-image" :src="getTwoDimensionalImageForModel(this.selectedModel)" alt="2D Image">
              </a-tab-pane>
              <a-tab-pane key="3d" tab="3D Image">
                <img class="flat-image" :src="getThreeDimensionalImageForModel(this.selectedModel)" alt="3D Image">
              </a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>

      </div>
      <!-- / Model selected -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ModelSelector from "./BoxesSpecificationEditor/ModelSelector";
import Images from "../../../../../mixins/Images";

export default {
  name: "BoxesSpecificationEditor",
  props: ['orderLocal'],
  data() {
    return {
      isLoadingTemplates: true,
      packagingSpecs: [],
      selectedModel: null
    }
  },
  mixins: [Images],
  components: {ModelSelector},
  mounted() {
    if (!this.orderLocal.packaging_box_specification) {
      this.orderLocal.packaging_box_specification = {
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
        dimension_type: null
      }
    }
    this.loadTemplates();
  },
  methods: {
    loadTemplates() {
      let vm = this;
      vm.isLoadingTemplates = true;
      axios.get(window.API_COMMON_BASE + '/packaging-specs').then(r => {
        vm.packagingSpecs = r.data;
        vm.isLoadingTemplates = false;
      }).catch(e => {
        console.log(e);
        vm.$message.error('Error loading packaging specs');
      });
    },

    selectModel(model) {
      this.selectedModel = model;
      this.orderLocal.packaging_box_specification.model_id = (model ? model.id : null);
    },

    forceRefresh() {
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    getTwoDimensionalImageForModel(model) {
      return 'https://api.axiomdata.io/packaging/' + model.name + ".svg";
    },

    getThreeDimensionalImageForModel(model) {
      return 'https://api.axiomdata.io/packaging/' + model.name + "_3d.svg";
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

.change-model-button-wrapper {
  margin-bottom: 30px;
}

.model-details-wrapper {
  padding-bottom: 55px;
}

.flat-image {
  width: 100%;
}
</style>