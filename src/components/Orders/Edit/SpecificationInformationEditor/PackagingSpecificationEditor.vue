<template>
  <div>
    <div class="form-header">
      <h2>Build Your Packaging</h2>
    </div>

    <el-collapse v-model="activePanel" accordion>
      <el-collapse-item
        v-for="(component, i) in orderLocal.packaging_components"
        :key="i"
        :title="getSectionNameLabel(component)"
        style="position: relative"
      >
        <a-dropdown style="position: absolute; right: 40px; top: 18px" :trigger="['click']">
          <a-button type="link" icon="ellipsis"></a-button>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="#" v-if="orderLocal.packaging_components.length > 1" @click.prevent="deleteComponent(i)"
                >Delete section</a
              >
            </a-menu-item>
          </a-menu>
        </a-dropdown>

        <div class="collapse-inner-section">
          <!-- Type selector -->
          <div style="margin-bottom: 20px">
            <a-select v-model="component.type" @change="forceRefresh" style="width: 250px">
              <a-select-option value="box">Box</a-select-option>
            </a-select>
          </div>
          <!-- / Type selector -->

          <!-- Boxes -->
          <boxes-specification-editor
            @force-refresh="forceRefresh"
            :spec="orderLocal.packaging_components[i]"
            :order-local="orderLocal"
            v-if="component.type == 'box'"
          ></boxes-specification-editor>
          <!-- / Boxes -->
        </div>
      </el-collapse-item>
    </el-collapse>

    <!-- Add new packaging component -->
    <a-button icon="plus" @click="addComponent">Add component</a-button>
    <!-- / Add new packaging component -->
  </div>
</template>

<script>
const _ = require("lodash");
import BoxesSpecificationEditor from "./PackagingSpecificationEditor/BoxesSpecificationEditor";

const PACKAGING_COMPONENT_DATA_TEMPLATE = {
  name: "Component 1",
  type: "box",
};

export default {
  name: "PackagingSpecificationEditor",
  props: ["orderLocal"],
  data() {
    return {
      activePanel: undefined,
    };
  },
  components: { BoxesSpecificationEditor },
  mounted() {
    if (!this.orderLocal.packaging_components) {
      this.orderLocal.packaging_components = [
        {
          ...PACKAGING_COMPONENT_DATA_TEMPLATE,
        },
      ];
      this.forceRefresh();
    }
  },
  methods: {
    addComponent() {
      this.orderLocal.packaging_components.push({
        ...PACKAGING_COMPONENT_DATA_TEMPLATE,
        name: "Component " + (this.orderLocal.packaging_components.length + 1),
      });
      this.forceRefresh();
      this.activePanel = Number(this.orderLocal.packaging_components.length - 1);
    },

    deleteComponent(i) {
      this.orderLocal.packaging_components = _.filter(this.orderLocal.packaging_components, function (c, ii) {
        return String(ii) !== String(i);
      });
      this.forceRefresh();
    },

    forceRefresh() {
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    getSectionNameLabel(component) {
      if (!component) {
        return "Please select a packaging component";
      }
      return component.name + " - " + (component.type.charAt(0).toUpperCase() + component.type.slice(1));
    },
  },
};
</script>

<style scoped lang="scss">
.el-collapse {
  margin-bottom: 20px;
}
</style>
