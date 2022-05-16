<template>
  <div :key="updateKey">
    <a-card :title="liningLabel" :name="liningLabel">
      <div class="collapse-inner-section">
        <!-- Lining (Wall) Details -->
        <a-form layout="vertical">
          <a-form-item label="Paper Type">
            <a-select v-model="cardboard[liningProperty].paper_type" show-search @change="handlePropertyUpdated">
              <a-select-option v-for="paperType in paperTypeOptions" :value="paperType.value" :key="paperType.value">
                {{ paperType.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="Paper Weight">
            <a-input-group compact>
              <a-input style="width: 50%" v-model="cardboard[liningProperty].paper_weight" />
              <a-select
                style="width: 50%"
                v-model="cardboard[liningProperty].paper_weight_unit"
                placeholder="Select unit"
                @change="handlePropertyUpdated"
              >
                <a-select-option
                  v-for="paperWeightUnit in paperWeightUnitOptions"
                  :value="paperWeightUnit.value"
                  :key="paperWeightUnit.value"
                >
                  {{ paperWeightUnit.label }}
                </a-select-option>
              </a-select>
            </a-input-group>
          </a-form-item>
        </a-form>
        <!-- / Lining (Wall) Details -->
      </div>
    </a-card>
    <a-card :title="flutingLabel" v-if="!isLastWall">
      <div class="collapse-inner-section">
        <!-- Fluting Details -->
        <a-form layout="vertical">
          <a-form-item label="Paper Type">
            <a-select v-model="cardboard[flutingProperty].paper_type" show-search @change="handlePropertyUpdated">
              <a-select-option v-for="paperType in paperTypeOptions" :value="paperType.value" :key="paperType.value">
                {{ paperType.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="Paper Weight">
            <a-input-group compact>
              <a-input style="width: 50%" v-model="cardboard[flutingProperty].paper_weight" />
              <a-select
                style="width: 50%"
                v-model="cardboard[flutingProperty].paper_weight_unit"
                placeholder="Select unit"
                @change="handlePropertyUpdated"
              >
                <a-select-option
                  v-for="paperWeightUnit in paperWeightUnitOptions"
                  :value="paperWeightUnit.value"
                  :key="paperWeightUnit.value"
                >
                  {{ paperWeightUnit.label }}
                </a-select-option>
              </a-select>
            </a-input-group>
          </a-form-item>

          <a-form-item label="Fluting Size">
            <a-select v-model="cardboard[flutingProperty].fluting_size" show-search @change="handlePropertyUpdated">
              <a-select-option
                v-for="flutingSize in flutingSizeOptions"
                :value="flutingSize.value"
                :key="flutingSize.value"
              >
                {{ flutingSize.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
        <!-- / Fluting Details -->
      </div>
    </a-card>
  </div>
</template>

<script>
const PAPER_TYPE_OPTIONS = [
  {
    value: "kraft",
    label: "Kraft",
  },
  {
    value: "test-2",
    label: "Test 2",
  },
  {
    value: "test-3",
    label: "Test 3",
  },
  {
    value: "chip",
    label: "Chip",
  },
  {
    value: "fully-bleached-white",
    label: "Fully Bleached White",
  },
  {
    value: "white-top",
    label: "White Top",
  },
  {
    value: "mottled-kraft",
    label: "Mottled Kraft",
  },
  {
    value: "oyster",
    label: "Oyster",
  },
  {
    value: "semi-chem",
    label: "Semi Chem",
  },
  {
    value: "waste-based",
    label: "Waste Based",
  },
];
const PAPER_WEIGHT_UNIT_OPTIONS = [
  {
    label: "gsm",
    value: "gsm",
  },
  {
    label: "lbs",
    value: "lbs",
  },
];
const FLUTING_SIZE_OPTIONS = [
  {
    label: "A FLUTE:  5mm",
    value: "a-flute-5mm",
  },
  {
    label: "B FLUTE: 3mm",
    value: "b-flute-5mm",
  },
  {
    label: "C FLUTE: 4mm",
    value: "c-flute-4mm",
  },
  {
    label: "E FLUTE: 1.5mm",
    value: "e-flute-1.5mm",
  },
  {
    label: "F FLUTE: 2mm",
    value: "f-flute-2mm",
  },
  {
    label: "BC FLUTE: Double Wall – 6mm - Combination of B + C flutes",
    value: "bc-flute",
  },
  {
    label: "EB FLUTE: Double Wall - 3.5mm - Combination of E + B flutes",
    value: "eb-flute",
  },
];
export default {
  name: "WallDetails",
  props: ["wall", "cardboard", "isLastWall"],
  data() {
    return {
      updateKey: 1,
      paperTypeOptions: PAPER_TYPE_OPTIONS,
      paperWeightUnitOptions: PAPER_WEIGHT_UNIT_OPTIONS,
      flutingSizeOptions: FLUTING_SIZE_OPTIONS,
    };
  },
  methods: {
    handlePropertyUpdated() {
      this.updateKey += 1;
    },
  },
  computed: {
    liningLabel() {
      return "Lining " + this.wall;
    },

    flutingLabel() {
      return "Fluting " + this.wall;
    },

    wallNumberText() {
      if (this.wall === 1) {
        return "one";
      } else if (this.wall === 2) {
        return "two";
      } else if (this.wall === 3) {
        return "three";
      } else if (this.wall === 4) {
        return "four";
      } else {
        return null;
      }
    },

    liningProperty() {
      return "lining_" + this.wallNumberText + "_details";
    },

    flutingProperty() {
      return "fluting_" + this.wallNumberText + "_details";
    },
  },
};
</script>

<style scoped>
.ant-descriptions {
  margin-top: 20px;
}
</style>
