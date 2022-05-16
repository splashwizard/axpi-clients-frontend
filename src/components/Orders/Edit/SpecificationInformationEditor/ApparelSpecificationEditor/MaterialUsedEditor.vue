<template>
  <div>
    <el-collapse v-model="activePanel" accordion>
      <el-collapse-item
        v-for="(material, i) in orderLocal.apparel_material_used"
        :key="i"
        :title="getSectionNameLabel(material.material_type)"
        style="position: relative"
      >
        <a-dropdown style="position: absolute; right: 40px; top: 18px" :trigger="['click']">
          <a-button type="link" icon="ellipsis"></a-button>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="#" v-if="orderLocal.apparel_material_used.length > 1" @click.prevent="deleteMaterial(i)"
                >Delete section</a
              >
            </a-menu-item>
          </a-menu>
        </a-dropdown>

        <div class="collapse-inner-section">
          <a-row :gutter="70">
            <a-col :span="12">
              <a-form layout="vertical">
                <a-form-item label="Material">
                  <a-cascader
                    size="large"
                    v-model="material.material_type"
                    :options="materialTypeOptions"
                    @change="forceRefresh"
                  >
                  </a-cascader>
                </a-form-item>

                <a-checkbox @change="forceRefresh"> Organic? </a-checkbox>

                <a-form-item label="Percentage">
                  <a-input
                    v-model="material.percentage"
                    @blur="forceRefresh"
                    type="number"
                    :min="0"
                    :max="100"
                    size="large"
                  ></a-input>
                </a-form-item>

                <a-form-item label="Country Of Origin">
                  <a-select show-search v-model="material.country_of_origin" @change="forceRefresh" size="large">
                    <a-select-option v-for="(country, i) in countries" :value="country" :key="i">
                      {{ country }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-form>
            </a-col>
          </a-row>
        </div>
      </el-collapse-item>
    </el-collapse>

    <!-- Add new material button -->
    <a-button icon="plus" @click="addMaterial">Add material</a-button>
    <!-- / Add new material button -->
  </div>
</template>

<script>
import country from "country-list-js";
const _ = require("lodash");

const MATERIAL_USED_DATA_TEMPLATE = {
  material_type: null,
  percentage: null,
  country_of_origin: null,
};

const MATERIAL_TYPE_OPTIONS = [
  {
    label: "Cotton",
    value: "Cotton",
    children: [
      {
        label: "Combed Cotton",
        value: "Combed Cotton",
      },
      {
        label: "Pima Cotton",
        value: "Pima Cotton",
      },
      {
        label: "Slub Cotton",
        value: "Slub Cotton",
      },
    ],
  },
  {
    label: "Linen",
    value: "Linen",
  },
  {
    label: "Polyester",
    value: "Polyester",
  },
  {
    label: "Rayon",
    value: "Rayon",
  },
  {
    label: "Silk",
    value: "Silk",
  },
  {
    label: "Lycra",
    value: "Lycra",
  },
  {
    label: "Bamboo",
    value: "Bamboo",
  },
];

export default {
  name: "MaterialUsedEditor",
  props: ["orderLocal"],
  data() {
    return {
      activePanel: undefined,
      materialTypeOptions: MATERIAL_TYPE_OPTIONS,
      countries: country.names(),
    };
  },
  mounted() {
    if (!this.orderLocal.apparel_material_used) {
      this.orderLocal.apparel_material_used = [
        {
          ...MATERIAL_USED_DATA_TEMPLATE,
        },
      ];
      this.forceRefresh();
    }
  },
  methods: {
    addMaterial() {
      this.orderLocal.apparel_material_used.push({
        ...MATERIAL_USED_DATA_TEMPLATE,
      });
      this.forceRefresh();
      this.activePanel = Number(this.orderLocal.apparel_material_used.length - 1);
    },

    deleteMaterial(i) {
      this.orderLocal.apparel_material_used = _.filter(this.orderLocal.apparel_material_used, function (material, ii) {
        return String(ii) !== String(i);
      });
      this.forceRefresh();
    },

    forceRefresh() {
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    getSectionNameLabel(value) {
      if (!value) {
        return "Please select a material";
      }
      return value.join(" / ");
    },
  },
};
</script>

<style scoped lang="scss">
.el-collapse {
  margin-bottom: 20px;
}
</style>
