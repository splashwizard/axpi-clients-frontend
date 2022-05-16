<template>
  <div v-if="orderLocal.envelope">
    <a-form layout="vertical">
      <!-- Envelope Style -->
      <a-row :gutter="70">
        <a-col span="12">
          <a-form-item label="Envelope Style">
            <a-cascader
              :options="envelopeStyleOptions"
              v-model="orderLocal.envelope.envelope_style"
              :show-search="{ filter }"
              @change="forceRefresh"
              size="large"
            ></a-cascader>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- / Envelope Style -->

      <!-- Width and height -->
      <a-row :gutter="70">
        <a-col span="12">
          <a-form-item label="Width">
            <a-input-group compact>
              <a-input size="large" style="width: 70%" v-model="orderLocal.envelope.width" @blur="forceRefresh" />
              <a-select size="large" style="width: 30%" v-model="orderLocal.envelope.width_unit" @change="forceRefresh">
                <a-select-option value="mm"> mm </a-select-option>
                <a-select-option value="inch"> inch </a-select-option>
              </a-select>
            </a-input-group>
          </a-form-item>
        </a-col>
        <a-col span="12">
          <a-form-item label="Height">
            <a-input-group compact>
              <a-input size="large" style="width: 70%" v-model="orderLocal.envelope.height" @blur="forceRefresh" />
              <a-select
                size="large"
                style="width: 30%"
                v-model="orderLocal.envelope.height_unit"
                @change="forceRefresh"
              >
                <a-select-option value="mm"> mm </a-select-option>
                <a-select-option value="inch"> inch </a-select-option>
              </a-select>
            </a-input-group>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- / Width and height -->

      <!-- Seal -->
      <a-row :gutter="70">
        <a-col span="12">
          <a-form-item label="Seal">
            <a-select v-model="orderLocal.envelope.seal" show-search size="large" @change="forceRefresh">
              <a-select-option v-for="seal in sealOptions" :value="seal.value" :key="seal.value">
                {{ seal.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- / Seal -->

      <!-- Paper Type -->
      <a-row :gutter="70">
        <a-col span="12">
          <a-form-item label="Paper Type">
            <a-select v-model="orderLocal.envelope.paper_type" show-search size="large" @change="forceRefresh">
              <a-select-option v-for="type in paperTypeOptions" :value="type.value" :key="type.value">
                {{ type.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- / Paper Type -->
    </a-form>
  </div>
</template>

<script>
const ENVELOPE_DATA_TEMPLATE = {
  envelope_style: null,
  width: null,
  width_unit: "mm",
  height: null,
  height_unit: "mm",
  seal: null,
  paper_type: null,
};

const ENVELOPE_STYLE_OPTIONS = [
  {
    label: "Baronial",
    value: "baronial",
  },
  {
    label: "A-Style",
    value: "a-style",
  },
  {
    label: "Square",
    value: "square",
  },
  {
    label: "Commercial",
    value: "commercial",
    children: [
      {
        value: "square-flap",
        label: "Square Flap",
      },
      {
        value: "policy-flap",
        label: "policy-flap",
      },
      {
        value: "dl-international",
        label: "DL International",
      },
    ],
  },
  {
    label: "Booklet",
    value: "booklet",
  },
  {
    label: "Catalog",
    value: "catalog",
  },
];

const SEAL_OPTIONS = [
  {
    label: "Paper and Seal",
    value: "paper-and-seal",
  },
  {
    label: "Gummed",
    value: "gummed",
  },
  {
    label: "Self Seal",
    value: "self-seal",
  },
];

const PAPER_TYPE_OPTIONS = [
  {
    label: "Wove",
    value: "wove",
  },
  {
    label: "Surface Enhanced White Wove",
    value: "surface-enhanced-white-wove",
  },
  {
    label: "Kraft",
    value: "kraft",
  },
  {
    label: "Recycled",
    value: "recycled",
  },
  {
    label: "Speciality",
    value: "speciality",
  },
  {
    label: "Tear Resistant",
    value: "tear-resistant",
  },
];

export default {
  name: "EnvelopeDetails",
  props: ["orderLocal"],
  data() {
    return {
      envelopeStyleOptions: ENVELOPE_STYLE_OPTIONS,
      sealOptions: SEAL_OPTIONS,
      paperTypeOptions: PAPER_TYPE_OPTIONS,
    };
  },
  mounted() {
    if (!this.orderLocal.envelope) {
      this.orderLocal.envelope = {
        ...ENVELOPE_DATA_TEMPLATE,
      };
      this.forceRefresh();
    }
  },
  methods: {
    forceRefresh() {
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    filter(inputValue, path) {
      return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    },
  },
};
</script>

<style scoped></style>
