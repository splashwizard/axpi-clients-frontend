<template>
  <div>
    <div class="form-header">
      <h2 class="form-header-title">Model</h2>
      <a-button v-if="selectedModel"
          class="form-header-action" @click="selectModel(null)">Change model</a-button>
    </div>

    <div class="loading-screen" v-if="isLoadingTemplates">
      <a-spin />
    </div>

    <div>
      <model-selector v-if="!selectedModel"
          :models="packagingSpecs" :selected-model="selectedModel" @select-model="selectModel"></model-selector>

      <!-- Model selected -->
      <div class="model-details-editor" v-if="selectedModel">

        <a-row>
          <a-col :span="12">
            Asdf
          </a-col>
          <a-col :span="12">
            <img class="flat-image" :src="getImageSrc(this.selectedModel['image'])" alt="3D Image">
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
      this.orderLocal.packaging_box_specification.model_id = model.id;
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

.model-details-editor {
  padding-bottom: 75px;
}

.flat-image {
  width: 100%;
}
</style>