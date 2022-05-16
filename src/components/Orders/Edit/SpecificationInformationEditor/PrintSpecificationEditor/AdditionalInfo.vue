<template>
  <a-row :gutter="70">
    <a-col span="12">
      <a-form layout="vertical">
        <validated-form-item id="print-detail-printing-method" label="Printing Method">
          <a-cascader
            size="large"
            :options="printingMethodTypeOptions"
            :show-search="{ filter }"
            placeholder="Please select a printing type"
            @change="forceRefresh"
            :disabled="isDropdownLoading('print-printing-method')"
            v-model="orderLocal.print_printing_method"
          />
        </validated-form-item>

        <a-row>
          <a-col :span="12">
            <validated-form-item id="print-detail-artwork-supplied" label="Artwork Supplied">
              <a-radio-group @change="forceRefresh" v-model="orderLocal.print_artwork_supplied" button-style="solid">
                <a-radio-button v-for="option in artworkSuppliedOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-radio-button>
              </a-radio-group>
            </validated-form-item>
          </a-col>
          <a-col :span="12">
            <validated-form-item id="print-detail-proof-made" label="Proof Made">
              <a-radio-group @change="forceRefresh" v-model="orderLocal.print_proof_made" button-style="solid">
                <a-radio-button v-for="option in proofMadeOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-radio-button>
              </a-radio-group>
            </validated-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
  </a-row>
</template>

<script>
import Forms from "../../../../../mixins/Forms";

// const PRINTING_METHOD_TYPE_OPTIONS = [
//   {
//     value: 'offset-printing',
//     label: 'Offset Printing',
//     children: [
//       {
//         value: 'coldset-web-offset',
//         label: 'Coldset Web Offset'
//       },
//       {
//         value: 'heatset-web-offset',
//         label: 'Heatset Web Offset'
//       },
//       {
//         value: 'other',
//         label: 'Other'
//       },
//       {
//         value: 'sheet-fed-offset',
//         label: 'Sheet Fed Offset'
//       }
//     ]
//   },
//   {
//     value: 'digital-printing',
//     label: 'Digital Printing',
//     children: [
//       {
//         value: 'inkjet',
//         label: 'Inkjet'
//       },
//       {
//         value: 'laser',
//         label: 'Laser'
//       },
//       {
//         value: 'digital-press',
//         label: 'Digital Press'
//       }
//     ]
//   },
//   {
//     value: 'digital-large-format',
//     label: 'Digital Large Format'
//   },
//   {
//     value: 'gravure',
//     label: 'Gravure',
//     children: [
//       {
//         value: 'publication-gravure',
//         label: 'Publication Gravure'
//       },
//       {
//         value: 'packaging-gravure',
//         label: 'Packaging Gravure'
//       },
//       {
//         value: 'dabber-printing',
//         label: 'Dabber Printing'
//       },
//       {
//         value: 'other',
//         label: 'Other'
//       }
//     ]
//   },
//   {
//     value: 'relief',
//     label: 'Relief',
//     children: [
//       {
//         value: 'letter-press',
//         label: 'Letter Press'
//       },
//       {
//         value: 'flexography',
//         label: 'Flexography'
//       },
//       {
//         value: 'other',
//         label: 'Other'
//       }
//     ]
//   },
//   {
//     value: 'screen-printing',
//     label: 'Screen Printing'
//   }
// ];

const ARTWORK_SUPPLIED_OPTIONS = [
  {
    value: true,
    label: "Yes",
  },
  {
    value: false,
    label: "No",
  },
];

const PROOF_MADE_OPTIONS = [
  {
    value: true,
    label: "Yes",
  },
  {
    value: false,
    label: "No",
  },
];

export default {
  name: "AdditionalInfo",
  props: ["orderLocal"],

  data() {
    return {
      printingMethodTypeOptions: [],
      artworkSuppliedOptions: ARTWORK_SUPPLIED_OPTIONS,
      proofMadeOptions: PROOF_MADE_OPTIONS,
    };
  },

  mixins: [Forms],

  methods: {
    filter(inputValue, path) {
      return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    },

    forceRefresh() {
      this.$forceUpdate();
    },
  },

  mounted() {
    this.getDropdownOptions("print-printing-method", "printingMethodTypeOptions");
  },
};
</script>

<style scoped></style>
