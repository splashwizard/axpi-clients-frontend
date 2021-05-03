<template>
  <div>
    <a-row :gutter="15">
      <a-col :span="6" v-for="(model, i) in models" :key="i">
        <a-card hoverable @click="selectModel(model)">
<!--          <img-->
<!--              slot="cover"-->
<!--              alt="Image"-->
<!--              :src="getImageSrc(model['3d_image'])"-->
<!--          />-->
          <img
              slot="cover"
              alt="Image"
              :src="getThreeDimensionalImageForModel(model)"
          />

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
  props: ['models', 'selectedModel'],
  mixins: [Images],
  methods: {
    selectModel(model) {
      this.$emit('select-model', model);
    },

    getThreeDimensionalImageForModel(model) {
      return 'https://api.axiomdata.io/packaging/' + model.name + "_3d.png";
    }
  }
}
</script>

<style scoped>

</style>