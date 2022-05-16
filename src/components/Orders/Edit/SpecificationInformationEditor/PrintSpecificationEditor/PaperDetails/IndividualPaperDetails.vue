<template>
  <div>
    <a-row :gutter="70">
      <a-col span="12">
        <!-- General Paper Details -->
        <a-form layout="vertical">
          <validated-form-item v-if="!hideNameOfSection" id="paper-section-name" label="Name of Section">
            <a-select v-model="paper.section_name" show-search size="large" @change="forceRefresh">
              <a-select-option v-for="name in sectionNameOptions" :value="name.value" :key="name.value">
                {{ name.label }}
              </a-select-option>
            </a-select>
          </validated-form-item>

          <validated-form-item
            label="Number of Pages"
            :conditions="[{ field: 'section_name', value: paper.section_name }]"
            id="paper-number-of-pages"
          >
            <a-input
              type="number"
              min="0"
              v-model="paper.number_of_pages"
              addon-after="pp"
              @blur="forceRefresh"
              size="large"
            ></a-input>
          </validated-form-item>

          <validated-form-item
            label="Paper Finish"
            :conditions="[{ field: 'section_name', value: paper.section_name }]"
            id="paper-finish"
          >
            <a-select
              v-model="paper.finish"
              show-search
              size="large"
              :disabled="isDropdownLoading('paper-finish')"
              @change="forceRefresh"
            >
              <a-select-opt-group v-for="(group, i) in paperFinishOptions" :key="i">
                <span slot="label">{{ group.group }}</span>
                <a-select-option v-for="paperFinish in group.options" :value="paperFinish.name" :key="paperFinish.name">
                  {{ paperFinish.name }}
                </a-select-option>
              </a-select-opt-group>
            </a-select>
          </validated-form-item>

          <validated-form-item
            label="Fold Type"
            :conditions="[{ field: 'section_name', value: paper.section_name }]"
            id="paper-fold-type"
            v-if="productSubtype === 'leaflet'"
          >
            <a-select
              v-model="paper.fold_type"
              show-search
              size="large"
              :disabled="isDropdownLoading('paper-fold-type')"
              @change="forceRefresh"
            >
              <a-select-option v-for="type in paperFoldTypeOptions" :value="type.name" :key="type.name">
                {{ type.name }}
              </a-select-option>
            </a-select>
          </validated-form-item>

          <validated-form-item
            label="Paper Weight"
            :conditions="[{ field: 'section_name', value: paper.section_name }]"
            id="paper-weight,paper-weight-unit"
          >
            <a-input-group compact>
              <a-input
                @blur="forceRefresh"
                size="large"
                type="number"
                style="width: 75%"
                v-model="paper.paper_weight"
              />
              <a-select @change="forceRefresh" size="large" style="width: 25%" v-model="paper.paper_weight_unit">
                <a-select-option value="gsm"> gsm </a-select-option>
                <a-select-option value="lbs"> lbs </a-select-option>
              </a-select>
            </a-input-group>
          </validated-form-item>

          <validated-form-item
            label="Paper Brand"
            :conditions="[{ field: 'section_name', value: paper.section_name }]"
            id="paper-brand"
          >
            <a-select
              v-model="paper.paper_brand"
              show-search
              size="large"
              :disabled="isDropdownLoading('paper-brand')"
              @change="forceRefresh"
            >
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0" />
                <div style="display: flex; flex-wrap: nowrap; padding: 4px 8px 8px 8px">
                  <a-button block @click.prevent="setCustomPaperBrand" style="flex: none; display: block" icon="plus"
                    >Add custom paper brand
                  </a-button>
                </div>
              </div>
              <a-select-option v-for="paperBrand in paperBrandOptions" :value="paperBrand.name" :key="paperBrand.name">
                {{ paperBrand.name }}
              </a-select-option>
            </a-select>
          </validated-form-item>
          <validated-form-item
            label="Paper Name"
            :conditions="[{ field: 'section_name', value: paper.section_name }]"
            id="paper-name"
          >
            <a-select v-model="paper.paper_name" show-search size="large" @change="forceRefresh">
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0" />
                <div style="display: flex; flex-wrap: nowrap; padding: 4px 8px 8px 8px">
                  <a-button block @click.prevent="setCustomPaperName" style="flex: none; display: block" icon="plus"
                    >Add custom paper name
                  </a-button>
                </div>
              </div>
              <a-select-option v-for="paperName in paperNameOptions" :value="paperName.name" :key="paperName.name">
                {{ paperName.name }}
              </a-select-option>
            </a-select>
          </validated-form-item>
        </a-form>
        <!-- / General Paper Details -->
      </a-col>
      <a-col span="12">
        <!-- Paper size type -->
        <div class="paper-size-type">
          <div class="label">
            <label class="paper-size-label" title="Finished Page Size">Finished Page Size</label>
          </div>
          <div class="toggle">
            <a-radio-group
              @change="forceRefresh"
              v-model="paper.paper_size_type"
              default-value="standard"
              button-style="solid"
            >
              <a-radio-button value="standard"> Standard </a-radio-button>
              <a-radio-button value="custom"> Custom </a-radio-button>
            </a-radio-group>
          </div>
        </div>
        <!-- / Paper size type -->

        <!-- Paper size selector (standard) -->
        <paper-size-selector
          v-show="paper.paper_size_type === 'standard'"
          :section-name="paper.section_name"
          :initial-size="paper.paper_size"
          @paper-size-selected="(size) => handlePaperSizeSelected(size)"
        ></paper-size-selector>
        <!-- / Paper size selector -->

        <!-- Paper size (manual) -->
        <div v-show="paper.paper_size_type === 'custom'">
          <a-form layout="vertical">
            <!-- Width -->
            <validated-form-item
              label="Width"
              :conditions="[{ field: 'section_name', value: paper.section_name }]"
              id="paper-custom-paper-size-width,paper-custom-paper-size-width-unit"
            >
              <a-input-group compact>
                <a-input @blur="forceRefresh" size="large" style="width: 60%" v-model="paper.custom_paper_size_width" />
                <a-select
                  @change="forceRefresh"
                  default-value="mm"
                  style="width: 20%"
                  size="large"
                  v-model="paper.custom_paper_size_width_unit"
                >
                  <a-select-option value="mm"> mm </a-select-option>
                  <a-select-option value="in"> in </a-select-option>
                </a-select>
              </a-input-group>
            </validated-form-item>
            <!-- / Width -->

            <!-- Height -->
            <validated-form-item
              label="Height"
              :conditions="[{ field: 'section_name', value: paper.section_name }]"
              id="paper-custom-paper-size-height,paper-custom-paper-size-height-unit"
            >
              <a-input-group compact>
                <a-input
                  @blur="forceRefresh"
                  size="large"
                  style="width: 60%"
                  v-model="paper.custom_paper_size_height"
                />
                <a-select
                  @change="forceRefresh"
                  default-value="mm"
                  style="width: 20%"
                  size="large"
                  v-model="paper.custom_paper_size_height_unit"
                >
                  <a-select-option value="mm"> mm </a-select-option>
                  <a-select-option value="in"> in </a-select-option>
                </a-select>
              </a-input-group>
            </validated-form-item>
            <!-- / Height -->
          </a-form>
        </div>
        <!-- / Paper size (manual) -->
      </a-col>
    </a-row>

    <!-- Colour Type -->
    <div>
      <a-form layout="vertical">
        <a-row :gutter="70">
          <a-col :span="12">
            <validated-form-item
              label="Colour Type"
              :conditions="[{ field: 'section_name', value: paper.section_name }]"
              id="paper-colour-type"
            >
              <a-radio-group @change="forceRefresh" v-model="paper.colour_type" button-style="solid">
                <a-radio-button value="process"> Process </a-radio-button>
                <a-radio-button value="spot"> Spot </a-radio-button>
                <a-radio-button value="process-and-spot"> Process & Spot </a-radio-button>
              </a-radio-group>
            </validated-form-item>

            <validated-form-item
              v-if="paper.colour_type === 'process'"
              label="Number Of Process Colours"
              :conditions="[{ field: 'section_name', value: paper.section_name }]"
              id="paper-number-of-process-colours"
            >
              <a-input
                type="number"
                min="0"
                v-model="paper.number_of_process_colours"
                @blur="forceRefresh"
                size="large"
              ></a-input>
            </validated-form-item>

            <validated-form-item
              v-if="paper.colour_type === 'spot'"
              :conditions="[{ field: 'section_name', value: paper.section_name }]"
              id="paper-number-of-spot-colours"
              label="Number Of Spot Colours"
            >
              <a-input
                type="number"
                min="0"
                v-model="paper.number_of_spot_colours"
                @blur="forceRefresh"
                size="large"
              ></a-input>
            </validated-form-item>
          </a-col>
        </a-row>

        <!-- Process and spot -->
        <a-row :gutter="70" v-if="paper.colour_type === 'process-and-spot'">
          <a-col span="12">
            <validated-form-item
              label="Number Of Process Colours"
              :conditions="[{ field: 'section_name', value: paper.section_name }]"
              id="paper-number-of-process-colours"
            >
              <a-input
                type="number"
                min="0"
                v-model="paper.number_of_process_colours"
                @blur="forceRefresh"
                size="large"
              ></a-input>
            </validated-form-item>
          </a-col>
          <a-col span="12">
            <validated-form-item
              label="Number Of Spot Colours"
              :conditions="[{ field: 'section_name', value: paper.section_name }]"
              id="paper-number-of-spot-colours"
            >
              <a-input
                type="number"
                min="0"
                v-model="paper.number_of_spot_colours"
                @blur="forceRefresh"
                size="large"
              ></a-input>
            </validated-form-item>
          </a-col>
        </a-row>
        <!-- / Process and spot -->
      </a-form>
    </div>
    <!-- / Colour Type -->

    <!-- Coating Applied -->
    <a-form layout="vertical">
      <validated-form-item
        label="Coating Applied"
        :conditions="[{ field: 'section_name', value: paper.section_name }]"
        id="paper-is-coating-applied"
      >
        <a-radio-group @change="forceRefresh" v-model="paper.is_coating_applied" button-style="solid">
          <a-radio-button :value="true"> Yes </a-radio-button>
          <a-radio-button :value="false"> No </a-radio-button>
        </a-radio-group>
      </validated-form-item>
    </a-form>

    <a-form layout="vertical" v-if="paper.is_coating_applied === true">
      <a-row :gutter="60">
        <a-col span="12">
          <validated-form-item
            label="Coating Type"
            :conditions="[{ field: 'section_name', value: paper.section_name }]"
            id="paper-coating-type"
          >
            <a-select v-model="paper.coating_type" show-search size="large" style="width: 100%" @change="forceRefresh">
              <a-select-option
                v-for="coatingType in coatingTypeOptions"
                :value="coatingType.value"
                :key="coatingType.value"
              >
                {{ coatingType.label }}
              </a-select-option>
            </a-select>
          </validated-form-item>

          <validated-form-item
            label="Coating Applied"
            :conditions="[{ field: 'section_name', value: paper.section_name }]"
            id="paper-coating-applied"
          >
            <a-select
              v-model="paper.coating_applied"
              show-search
              size="large"
              style="width: 100%"
              @change="forceRefresh"
            >
              <a-select-option
                v-for="coatingApplied in coatingAppliedOptions"
                :value="coatingApplied.value"
                :key="coatingApplied.value"
              >
                {{ coatingApplied.label }}
              </a-select-option>
            </a-select>
          </validated-form-item>

          <validated-form-item
            label="Sides Coated"
            :conditions="[{ field: 'section_name', value: paper.section_name }]"
            id="paper-sides-coated"
          >
            <a-select v-model="paper.sides_coated" show-search size="large" style="width: 100%" @change="forceRefresh">
              <a-select-option
                v-for="sidesCoated in sidesCoatedOptions"
                :value="sidesCoated.value"
                :key="sidesCoated.value"
              >
                {{ sidesCoated.label }}
              </a-select-option>
            </a-select>
          </validated-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!-- / Coating Applied -->

    <!-- Embellishments -->
    <a-form layout="vertical">
      <validated-form-item
        label="Is Embellished"
        :conditions="[{ field: 'section_name', value: paper.section_name }]"
        id="paper-is-embellished"
      >
        <a-radio-group @change="forceRefresh" v-model="paper.is_embellished" button-style="solid">
          <a-radio-button :value="true"> Yes </a-radio-button>
          <a-radio-button :value="false"> No </a-radio-button>
        </a-radio-group>
      </validated-form-item>
    </a-form>

    <a-form layout="vertical" v-if="paper.is_embellished">
      <a-row :gutter="60">
        <a-col span="12">
          <validated-form-item
            label="Embellishment Type"
            :conditions="[{ field: 'section_name', value: paper.section_name }]"
            id="paper-embellishment-type"
          >
            <a-select
              v-model="paper.embellishment_type"
              show-search
              size="large"
              style="width: 100%"
              @change="forceRefresh"
            >
              <a-select-option
                v-for="embellishmentType in embellishmentTypeOptions"
                :value="embellishmentType.value"
                :key="embellishmentType.value"
              >
                {{ embellishmentType.label }}
              </a-select-option>
            </a-select>
          </validated-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!-- / Embellishments -->

    <!-- Die Cutting Required -->
    <a-form layout="vertical">
      <a-row :gutter="60">
        <a-col span="12">
          <validated-form-item
            label="Die Cutting Required"
            :conditions="[{ field: 'section_name', value: paper.section_name }]"
            id="paper-die-cutting-required"
          >
            <a-radio-group @change="forceRefresh" v-model="paper.die_cutting_required" button-style="solid">
              <a-radio-button v-for="option in dieCuttingRequiredOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </a-radio-button>
            </a-radio-group>
          </validated-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!--  Die Cutting Required -->
  </div>
</template>

<script>
import PaperSizeSelector from "./PaperSizeSelector";
import Forms from "../../../../../../mixins/Forms";

const _ = require("lodash");

// const PAPER_FINISH_OPTIONS = [
//   {
//     group: 'Coated Paper',
//     options: [
//       {
//         value: 'Gloss',
//         label: 'Gloss'
//       },
//       {
//         value: 'Satin',
//         label: 'Satin'
//       },
//       {
//         value: 'Matte',
//         label: 'Matte'
//       },
//       {
//         value: 'Silk',
//         label: 'Silk'
//       }
//     ]
//   },
//   {
//     group: 'Uncoated Paper',
//     options: [
//       {
//         value: 'Wove',
//         label: 'Wove'
//       },
//       {
//         value: 'Laid',
//         label: 'Laid'
//       },
//       {
//         value: 'Linen',
//         label: 'Linen'
//       }
//     ]
//   }
//   // {
//   //     value: 'bond',
//   //     label: 'Bond'
//   // },
//   // {
//   //     value: 'coated-paper',
//   //     label: 'Coated Paper'
//   // },
//   // {
//   //     value: 'uncoated-paper',
//   //     label: 'Uncoated Paper'
//   // }
// ];

const PAPER_WEIGHT_OPTIONS = [
  {
    value: "10-35gsm",
    label: "10-35gsm",
  },
  {
    value: "35-55gsm",
    label: "35-55gsm",
  },
  {
    value: "70-100gsm",
    label: "70-100gsm",
  },
  {
    value: "110-120gsm",
    label: "110-120gsm",
  },
  {
    value: "130-170gsm",
    label: "130-170gsm",
  },
  {
    value: "170-200gsm",
    label: "170-200gsm",
  },
  {
    value: "200-250gsm",
    label: "200-250gsm",
  },
  {
    value: "300-350gsm",
    label: "300-350gsm",
  },
  {
    value: "400gsm",
    label: "400gsm",
  },
];

// const PAPER_BRAND_OPTIONS = [
//   {
//     value: 'Ecostar',
//     label: 'Ecostar'
//   },
//   {
//     value: 'Envirocare',
//     label: 'Envirocare'
//   },
//   {
//     value: 'Grange',
//     label: 'Grange'
//   },
//   {
//     value: 'Hannoart',
//     label: 'Hannoart'
//   },
//   {
//     value: 'Novalite',
//     label: 'Novalite'
//   },
//   {
//     value: 'Magno',
//     label: 'Magno'
//   },
//   {
//     value: 'Maine',
//     label: 'Maine'
//   },
//   {
//     value: 'Alpine',
//     label: 'Alpine'
//   },
//   {
//     value: 'Impress',
//     label: 'Impress'
//   },
//   {
//     value: 'Fresh',
//     label: 'Fresh'
//   },
//   {
//     value: 'Monza',
//     label: 'Monza'
//   },
//   {
//     value: 'Pacesetter',
//     label: 'Pacesetter'
//   },
//   {
//     value: 'Titan',
//     label: 'Titan'
//   },
//   {
//     value: 'Splendorgel',
//     label: 'Splendorgel'
//   },
//   {
//     value: 'Optix',
//     label: 'Optix'
//   },
//   {
//     value: 'Precision',
//     label: 'Precision'
//   },
//   {
//     value: 'Reflex',
//     label: 'Reflex'
//   },
//   {
//     value: 'Publishers',
//     label: 'Publishers'
//   },
//   {
//     value: 'Revive',
//     label: 'Revive'
//   },
//   {
//     value: 'Silk',
//     label: 'Silk'
//   },
//   {
//     value: 'Impact',
//     label: 'Impact'
//   },
//   {
//     value: 'Sovereign',
//     label: 'Sovereign'
//   },
//   {
//     value: 'Freshzero',
//     label: 'Freshzero'
//   },
//   {
//     value: 'Saxton',
//     label: 'Saxton'
//   },
//   {
//     value: 'Sumo',
//     label: 'Sumo'
//   },
//   {
//     value: 'Supreme',
//     label: 'Supreme'
//   },
//   {
//     value: 'Yupo',
//     label: 'Yupo'
//   },
//   {
//     value: 'Barry',
//     label: 'Barry'
//   },
//   {
//     value: 'Pvc',
//     label: 'Pvc'
//   },
//   {
//     value: 'Knitted',
//     label: 'Knitted'
//   },
//   {
//     value: 'Buffalo',
//     label: 'Buffalo'
//   },
//   {
//     value: 'Colourplan',
//     label: 'Colourplan'
//   },
//   {
//     value: 'Colorplan',
//     label: 'Colorplan'
//   },
//   {
//     value: 'Conqueror',
//     label: 'Conqueror'
//   },
//   {
//     value: 'Curious',
//     label: 'Curious'
//   },
//   {
//     value: 'Xerox',
//     label: 'Xerox'
//   },
//   {
//     value: 'Mactac',
//     label: 'Mactac'
//   },
//   {
//     value: 'Europe',
//     label: 'Europe'
//   },
//   {
//     value: 'Opal',
//     label: 'Opal'
//   },
//   {
//     value: 'Envi',
//     label: 'Envi'
//   },
//   {
//     value: 'Enviro',
//     label: 'Enviro'
//   },
//   {
//     value: 'Colortech',
//     label: 'Colortech'
//   },
//   {
//     value: 'Novatech',
//     label: 'Novatech'
//   },
//   {
//     value: 'Greyback',
//     label: 'Greyback'
//   },
//   {
//     value: 'Incada',
//     label: 'Incada'
//   },
//   {
//     value: 'Keaykolour',
//     label: 'Keaykolour'
//   },
//   {
//     value: 'Keaycolour',
//     label: 'Keaycolour'
//   },
//   {
//     value: 'Knight',
//     label: 'Knight'
//   },
//   {
//     value: 'Pearl',
//     label: 'Pearl'
//   },
//   {
//     value: 'Kaskad',
//     label: 'Kaskad'
//   },
//   {
//     value: 'Atlas',
//     label: 'Atlas'
//   },
//   {
//     value: 'Backlit',
//     label: 'Backlit'
//   },
//   {
//     value: 'Carta',
//     label: 'Carta'
//   },
//   {
//     value: 'Snowflake',
//     label: 'Snowflake'
//   },
//   {
//     value: 'Canvas',
//     label: 'Canvas'
//   },
//   {
//     value: 'Zoda',
//     label: 'Zoda'
//   },
//   {
//     value: 'Tablex',
//     label: 'Tablex'
//   },
//   {
//     value: 'Vantage',
//     label: 'Vantage'
//   },
//   {
//     value: 'Lotus',
//     label: 'Lotus'
//   },
//   {
//     value: 'Toro',
//     label: 'Toro'
//   },
//   {
//     value: 'Neo',
//     label: 'Neo'
//   },
//   {
//     value: 'Lumi',
//     label: 'Lumi'
//   },
//   {
//     value: 'Bjball',
//     label: 'Bjball'
//   },
//   {
//     value: 'Fuji',
//     label: 'Fuji'
//   },
//   {
//     value: 'Manilla',
//     label: 'Manilla'
//   },
//   {
//     value: 'Extraprint',
//     label: 'Extraprint'
//   },
//   {
//     value: 'Ferrous',
//     label: 'Ferrous'
//   },
//   {
//     value: 'Neenah',
//     label: 'Neenah'
//   },
//   {
//     value: 'Heavy',
//     label: 'Heavy'
//   },
//   {
//     value: 'Magnegrip',
//     label: 'Magnegrip'
//   },
//   {
//     value: 'Mowhawk',
//     label: 'Mowhawk'
//   },
//   {
//     value: 'Mohawk',
//     label: 'Mohawk'
//   },
//   {
//     value: 'Any',
//     label: 'Any'
//   },
//   {
//     value: 'Nordset',
//     label: 'Nordset'
//   },
//   {
//     value: 'Crystal',
//     label: 'Crystal'
//   },
//   {
//     value: 'Paceseetter',
//     label: 'Paceseetter'
//   }
// ];

// const PAPER_NAME_OPTIONS = [
//   {
//     value: 'Magno Gloss',
//     label: 'Magno Gloss'
//   },
//   {
//     value: 'Magno Plus Gloss',
//     label: 'Magno Plus Gloss'
//   },
//   {
//     value: 'Magno Satin',
//     label: 'Magno Satin'
//   },
//   {
//     value: 'Magno Plus Silk',
//     label: 'Magno Plus Silk'
//   },
//   {
//     value: 'Magno Matt',
//     label: 'Magno Matt'
//   },
//   {
//     value: 'Magno Volume',
//     label: 'Magno Volume'
//   },
//   {
//     value: 'Magno Natural',
//     label: 'Magno Natural'
//   }
// ];

const COATING_TYPE_OPTIONS = [
  {
    value: "laminate",
    label: "Laminate",
  },
  {
    value: "varnish",
    label: "Varnish",
  },
  {
    value: "encapsulation",
    label: "Encapsulation",
  },
  {
    value: "uv-varnish",
    label: "UV Varnish",
  },
  {
    value: "aqueous-coating",
    label: "Aqueous Coating",
  },
];

const COATING_FINISH_OPTIONS = [
  {
    value: "matte",
    label: "Matte",
  },
  {
    value: "gloss",
    label: "Gloss",
  },
  {
    value: "satin",
    label: "Satin",
  },
  {
    value: "silk",
    label: "Silk",
  },
  {
    value: "soft-touch",
    label: "Soft Touch",
  },
  {
    value: "other",
    label: "Other",
  },
];

const COATING_APPLIED_OPTIONS = [
  {
    value: "spot",
    label: "Spot",
  },
  {
    value: "process",
    label: "Process",
  },
];

const SIDES_COATED_OPTIONS = [
  {
    value: "1",
    label: "One",
  },
  {
    value: "2",
    label: "Two",
  },
];

const EMBELLISHMENT_TYPE_OPTIONS = [
  {
    value: "foiling",
    label: "Foiling",
  },
  {
    value: "embossing",
    label: "Embossing",
  },
];

const DIE_CUTTING_REQUIRED_OPTIONS = [
  {
    value: true,
    label: "Yes",
  },
  {
    value: false,
    label: "No",
  },
];

// const PAPER_FOLD_TYPE_OPTIONS = [
//   {
//     value: 'letter-fold-c-fold',
//     label: 'Letter Fold (C Fold)'
//   },
//   {
//     value: 'tri-fold',
//     label: 'Tri Fold'
//   },
//   {
//     value: 'gate-fold',
//     label: 'Gate Fold'
//   },
//   {
//     value: 'accordion-fold-z-fold',
//     label: 'Accordion Fold (Z Fold)'
//   },
//   {
//     value: 'single-fold-v-fold',
//     label: 'Single Fold (V Fold)'
//   },
//   {
//     value: 'double-parallel-fold',
//     label: 'Double Parallel Fold'
//   },
//   {
//     value: 'engineering-fold-half-accordion',
//     label: 'Engineering Fold (Half Accordion)'
//   },
//   {
//     value: 'cross-fold-french-fold',
//     label: 'Cross Fold (French Fold)'
//   },
//   {
//     value: 'baronial-fold',
//     label: 'Baronial Fold'
//   }
// ];

export default {
  name: "IndividualPaperDetails",
  mixins: [Forms],
  props: ["productSubtype", "paper", "propagateForceRefresh", "sectionNameOptions", "hideNameOfSection", "paperBrands"],
  methods: {
    forceRefresh() {
      if (this.propagateForceRefresh) {
        this.$emit("force-refresh");
      }
      this.$forceUpdate();
    },

    handlePaperSizeSelected(size) {
      this.paper.paper_size = size;
      this.forceRefresh();
    },

    setCustomPaperBrand() {
      let custom = prompt("Please enter the paper brand");
      if (custom) {
        this.paper.paper_brand = custom;
      }
    },

    setCustomPaperName() {
      let custom = prompt("Please enter the paper name");
      if (custom) {
        this.paper.paper_name = custom;
      }
    },
  },
  components: {
    PaperSizeSelector,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      paperFinishOptions: [],
      paperWeightOptions: PAPER_WEIGHT_OPTIONS,
      paperBrandOptions: [],
      // paperBrandNames: _.map(PAPER_BRAND_OPTIONS, 'label'),
      // paperNameOptions: PAPER_NAME_OPTIONS,
      coatingTypeOptions: COATING_TYPE_OPTIONS,
      coatingFinishOptions: COATING_FINISH_OPTIONS,
      coatingAppliedOptions: COATING_APPLIED_OPTIONS,
      sidesCoatedOptions: SIDES_COATED_OPTIONS,
      embellishmentTypeOptions: EMBELLISHMENT_TYPE_OPTIONS,
      dieCuttingRequiredOptions: DIE_CUTTING_REQUIRED_OPTIONS,
      paperFoldTypeOptions: [],
    };
  },
  mounted() {
    this.getDropdownOptions("paper-brand", "paperBrandOptions");
    this.getDropdownOptions("paper-finish", "paperFinishOptions");
    this.getDropdownOptions("paper-fold-type", "paperFoldTypeOptions");
  },
  computed: {
    // paperBrandNames() {
    //   let fromDb = _.map(this.paperBrands, 'name');
    //   let currentPaperBrand = this.paper.paper_brand;
    //   if (currentPaperBrand.length !== 0 && !fromDb.includes(currentPaperBrand)) {
    //     fromDb.push(currentPaperBrand);
    //   }
    //   return fromDb;
    // }

    paperNameOptions() {
      let paperBrand = _.find(this.paperBrandOptions, {
        name: this.paper.paper_brand,
      });
      if (paperBrand) {
        return paperBrand.profiles;
      }
      return [];
    },
  },
};
</script>

<style scoped lang="scss">
.paper-size-type {
  /*text-align: center;*/
  display: flex;
  margin-bottom: 20px;
  align-items: center;

  .label {
    flex: 1;
  }
}

.paper-size-label {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}
</style>
