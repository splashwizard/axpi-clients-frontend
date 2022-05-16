<template>
  <div>
    <el-collapse v-model="activePanel" accordion :key="updateKey">
      <el-collapse-item
        v-for="(material, i) in orderLocal.pos_material"
        :key="i"
        :title="getSectionNameLabel(material.material)"
        :name="i"
        style="position: relative"
      >
        <a-dropdown style="position: absolute; right: 40px; top: 18px" :trigger="['click']">
          <a-button type="link" icon="ellipsis"></a-button>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="#" v-if="orderLocal.pos_material.length > 1" @click.prevent="deleteMaterial(i)"
                >Delete section</a
              >
            </a-menu-item>
          </a-menu>
        </a-dropdown>

        <!-- Update wrapper -->
        <div class="collapse-inner-section">
          <a-row :gutter="70">
            <a-col :span="12">
              <a-form layout="vertical">
                <!-- Material -->
                <a-form-item label="Material">
                  <a-select
                    size="large"
                    :disabled="isDropdownLoading('pos-material')"
                    style="width: 100%"
                    @change="forceRefresh"
                    v-model="orderLocal.pos_material[i].material"
                  >
                    <a-select-option v-for="opt in materialOptions" :key="opt.name" :value="opt.name">
                      {{ opt.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <!-- / Material -->

                <!-- Mass -->
                <a-form-item label="Mass">
                  <a-input-group compact>
                    <a-input
                      size="large"
                      style="width: 70%"
                      @blur="forceRefresh"
                      v-model="orderLocal.pos_material[i].mass"
                    />
                    <a-select
                      default-value="g"
                      style="width: 30%"
                      size="large"
                      @change="forceRefresh"
                      v-model="orderLocal.pos_material[i].mass_unit"
                    >
                      <a-select-option value="g"> g </a-select-option>
                      <a-select-option value="lbs"> lbs </a-select-option>
                    </a-select>
                  </a-input-group>
                </a-form-item>
                <!-- / Mass -->
              </a-form>
            </a-col>
          </a-row>
        </div>
        <!-- / Update wrapper -->
      </el-collapse-item>
    </el-collapse>

    <!-- Add new paper -->
    <a-button icon="plus" @click="addMaterial">Add material</a-button>
    <!-- / Add new paper -->
  </div>
</template>

<script>
let _ = require("lodash");

const MATERIAL_DATA_TEMPLATE = {
  material: null,
  mass: null,
  mass_unit: "g",
};

// const MATERIAL_OPTIONS = [
//   {
//     label: 'Aluminum',
//     value: 'Aluminium'
//   },
//   {
//     label: 'Steel',
//     value: 'Steel'
//   },
//   {
//     label: 'Wood',
//     value: 'Wood'
//   },
//   {
//     label: 'Fiberboard',
//     value: 'Fiberboard'
//   },
//   {
//     label: 'PVC',
//     value: 'PVC'
//   },
//   {
//     label: 'Acrylic',
//     value: 'Acrylic'
//   }
// ];

import Forms from "../../../../../mixins/Forms";
export default {
  name: "MaterialUsedEditor",
  props: ["orderLocal"],
  mixins: [Forms],
  data() {
    return {
      updateKey: 1,
      activePanel: undefined,

      materialOptions: [],
    };
  },
  mounted() {
    if (!this.orderLocal.pos_material) {
      this.orderLocal.pos_material = [
        {
          ...MATERIAL_DATA_TEMPLATE,
        },
      ];
      this.incrementUpdateKey();
    }
  },
  created() {
    this.getDropdownOptions("pos-material", "materialOptions");
  },
  methods: {
    incrementUpdateKey() {
      this.updateKey += 1;
    },

    forceRefresh() {
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    addMaterial() {
      this.orderLocal.pos_material.push({
        ...MATERIAL_DATA_TEMPLATE,
      });
      this.$forceUpdate();
      this.activePanel = Number(this.orderLocal.pos_material.length - 1);
    },

    deleteMaterial(i) {
      this.orderLocal.pos_material = _.filter(this.orderLocal.pos_material, function (material, ii) {
        return String(ii) !== String(i);
      });
      this.forceRefresh();
    },

    getSectionNameLabel(value) {
      if (!value) {
        return "Please select a material";
      }
      return value;
      // return value.join(' / ');
    },
  },
};
</script>

<style scoped lang="scss">
.el-collapse {
  margin-bottom: 20px;
}
</style>
