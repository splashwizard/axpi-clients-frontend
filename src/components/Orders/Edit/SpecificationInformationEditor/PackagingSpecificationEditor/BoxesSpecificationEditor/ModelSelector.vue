<template>
  <div class="packaging-model-selector">
    <a-row :gutter="15">
      <a-col :span="6" v-for="(model, i) in modelsToShow" :key="i">
        <a-card hoverable @click="selectModel(model)">
          <!--          <img-->
          <!--              slot="cover"-->
          <!--              alt="Image"-->
          <!--              :src="getImageSrc(model['3d_image'])"-->
          <!--          />-->
          <img slot="cover" alt="Image" :src="getThreeDimensionalImageForModel(model)" />

          <a-card-meta :title="model.name">
            <!--            <template slot="description">-->
            <!--              {{ model.description }}-->
            <!--            </template>-->
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Images from "../../../../../../mixins/Images";

export default {
  name: "ModelSelector",
  props: ["models", "selectedModel", "searchQuery", "selectedCategory"],
  mixins: [Images],
  methods: {
    selectModel(model) {
      this.$emit("select-model", model);
    },

    getThreeDimensionalImageForModel(model) {
      return "https://api.axiomdata.io/packaging/" + model.name + "_3d.png";
    },
  },
  computed: {
    modelsToShow() {
      let filtered = this.models;

      // if (this.selectedCategory === 'ecma') {
      //   filtered = _.filter(filtered, function(model) {
      //     return model.name.match(ecmaRegx);
      //   })
      // }

      return filtered.filter((model) => {
        return model.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
  },
};
</script>

<style lang="scss">
.packaging-model-selector {
  max-height: 600px;
  overflow-y: scroll;
  overflow: -moz-scrollbars-vertical;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }

  .ant-card {
    margin-bottom: 15px;
    border: none !important;
  }

  .ant-card-cover {
    padding-top: 15px;
  }

  .ant-card-cover img {
    height: 100px;
    width: auto;
    object-fit: contain;
    margin: 0 auto;
  }

  .ant-card-meta-title {
    text-align: center;
  }
}
</style>
