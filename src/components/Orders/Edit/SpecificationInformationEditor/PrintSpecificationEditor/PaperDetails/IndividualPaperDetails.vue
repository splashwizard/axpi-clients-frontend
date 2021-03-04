<template>
    <div>
        <a-row :gutter="70">
            <a-col span="12">
                <!-- General Paper Details -->
                <a-form layout="vertical">
                    <a-form-item v-if="!hideNameOfSection"
                            label="Name of Section">
                        <a-select v-model="paper.section_name"
                                  show-search size="large"
                                  @change="forceRefresh">
                            <a-select-option v-for="name in sectionNameOptions" :value="name.value"
                                             :key="name.value">
                                {{ name.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="Number of Pages">
                        <a-input type="number" min="0"
                                 v-model="paper.number_of_pages"
                                 addon-after="pp"
                                 @blur="forceRefresh"
                                 size="large"></a-input>
                    </a-form-item>

                    <a-form-item label="Paper Finish">
                        <a-select v-model="paper.paper_finish"
                                  show-search size="large"
                                  @change="forceRefresh">
                            <a-select-opt-group v-for="(group, i) in paperFinishOptions" :key="i">
                                <span slot="label">{{group.group }}</span>
                                <a-select-option v-for="paperFinish in group.options"
                                                 :value="paperFinish.value"
                                                 :key="paperFinish.value">
                                    {{ paperFinish.label }}
                                </a-select-option>
                            </a-select-opt-group>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="Paper Weight">
                        <a-input-group compact>
                            <a-input @blur="forceRefresh"
                                    size="large" type="number" style="width: 75%" v-model="paper.paper_weight"  />
                            <a-select @change="forceRefresh"
                                    size="large" style="width: 25%" v-model="paper.paper_weight_unit">
                                <a-select-option value="gsm">
                                    gsm
                                </a-select-option>
                                <a-select-option value="lbs">
                                    lbs
                                </a-select-option>
                            </a-select>
                        </a-input-group>
                    </a-form-item>

                    <a-form-item label="Paper Brand">
                        <a-select v-model="paper.paper_brand"
                                  show-search size="large"
                                  @change="forceRefresh">
                            <a-select-option v-for="paperBrand in paperBrandOptions"
                                             :value="paperBrand.value"
                                             :key="paperBrand.value">
                                {{ paperBrand.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="Paper Name">
                        <a-select v-model="paper.paper_name"
                                  show-search size="large"
                                  @change="forceRefresh">
                            <a-select-option v-for="paperName in paperNameOptions" :value="paperName.value"
                                             :key="paperName.value">
                                {{ paperName.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
                <!-- / General Paper Details -->
            </a-col>
            <a-col span="12">
                <!-- Paper size type -->
                <div class="paper-size-type">
                    <div class="label">
                        <label class="paper-size-label" title="Finished Page Size">Finished Page
                            Size</label>
                    </div>
                    <div class="toggle">
                        <a-radio-group @change="forceRefresh" v-model="paper.paper_size_type"
                                       default-value="standard" button-style="solid">
                            <a-radio-button value="standard">
                                Standard
                            </a-radio-button>
                            <a-radio-button value="custom">
                                Custom
                            </a-radio-button>
                        </a-radio-group>
                    </div>
                </div>
                <!-- / Paper size type -->

                <!-- Paper size selector (standard) -->
                <paper-size-selector v-show="paper.paper_size_type === 'standard'"
                                     :initial-size="paper.paper_size"
                                     @paper-size-selected="size => handlePaperSizeSelected(size)"></paper-size-selector>
                <!-- / Paper size selector -->

                <!-- Paper size (manual) -->
                <div v-show="paper.paper_size_type === 'custom'">
                    <a-form layout="vertical">
                        <!-- Width -->
                        <a-form-item label="Width">
                            <a-input-group compact>
                                <a-input @blur="forceRefresh"
                                         size="large" style="width: 60%"
                                         v-model="paper.custom_paper_size_width"/>
                                <a-select @change="forceRefresh"
                                          default-value="mm" style="width: 20%" size="large"
                                          v-model="paper.custom_paper_size_width_unit">
                                    <a-select-option value="mm">
                                        mm
                                    </a-select-option>
                                    <a-select-option value="in">
                                        in
                                    </a-select-option>
                                </a-select>
                            </a-input-group>
                        </a-form-item>
                        <!-- / Width -->

                        <!-- Height -->
                        <a-form-item label="Height">
                            <a-input-group compact>
                                <a-input @blur="forceRefresh"
                                         size="large" style="width: 60%"
                                         v-model="paper.custom_paper_size_height"/>
                                <a-select @change="forceRefresh"
                                          default-value="mm" style="width: 20%" size="large"
                                          v-model="paper.custom_paper_size_height_unit">
                                    <a-select-option value="mm">
                                        mm
                                    </a-select-option>
                                    <a-select-option value="in">
                                        in
                                    </a-select-option>
                                </a-select>
                            </a-input-group>
                        </a-form-item>
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
                        <a-form-item label="Colour Type">
                            <a-radio-group @change="forceRefresh" v-model="paper.colour_type"
                                           button-style="solid">
                                <a-radio-button value="process">
                                    Process
                                </a-radio-button>
                                <a-radio-button value="spot">
                                    Spot
                                </a-radio-button>
                                <a-radio-button value="process-and-spot">
                                    Process & Spot
                                </a-radio-button>
                            </a-radio-group>
                        </a-form-item>

                        <a-form-item
                                v-if="paper.colour_type === 'process'"
                                label="Number Of Process Colours">
                            <a-input type="number" min="0"
                                     v-model="paper.number_of_process_colours"
                                     @blur="forceRefresh"
                                     size="large"></a-input>
                        </a-form-item>

                        <a-form-item
                                v-if="paper.colour_type === 'spot'"
                                label="Number Of Spot Colours">
                            <a-input type="number" min="0"
                                     v-model="paper.number_of_spot_colours"
                                     @blur="forceRefresh"
                                     size="large"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>

                <!-- Process and spot -->
                <a-row :gutter="70" v-if="paper.colour_type === 'process-and-spot'">
                    <a-col span="12">
                        <a-form-item label="Number Of Process Colours">
                            <a-input type="number" min="0"
                                     v-model="paper.number_of_process_colours"
                                     @blur="forceRefresh"
                                     size="large"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col span="12">
                        <a-form-item label="Number Of Spot Colours">
                            <a-input type="number" min="0"
                                     v-model="paper.number_of_spot_colours"
                                     @blur="forceRefresh"
                                     size="large"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- / Process and spot -->
            </a-form>
        </div>
        <!-- / Colour Type -->

        <!-- Coating Applied -->
        <a-form layout="vertical">
            <a-form-item label="Coating Applied?">
                <a-radio-group @change="forceRefresh" v-model="paper.is_coating_applied"
                               button-style="solid">
                    <a-radio-button :value="true">
                        Yes
                    </a-radio-button>
                    <a-radio-button :value="false">
                        No
                    </a-radio-button>
                </a-radio-group>
            </a-form-item>
        </a-form>

        <a-form layout="vertical" v-if="paper.is_coating_applied === true">
            <a-row :gutter="60">
                <a-col span="12">
                    <a-form-item label="Coating Type">
                        <a-select v-model="paper.coating_type"
                                  show-search size="large"
                                  style="width: 100%"
                                  @change="forceRefresh">
                            <a-select-option v-for="coatingType in coatingTypeOptions"
                                             :value="coatingType.value"
                                             :key="coatingType.value">
                                {{ coatingType.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="Coating Applied">
                        <a-select v-model="paper.coating_applied"
                                  show-search size="large"
                                  style="width: 100%"
                                  @change="forceRefresh">
                            <a-select-option v-for="coatingApplied in coatingAppliedOptions"
                                             :value="coatingApplied.value"
                                             :key="coatingApplied.value">
                                {{ coatingApplied.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="Sides Coated">
                        <a-select v-model="paper.sides_coated"
                                  show-search size="large"
                                  style="width: 100%"
                                  @change="forceRefresh">
                            <a-select-option v-for="sidesCoated in sidesCoatedOptions"
                                             :value="sidesCoated.value"
                                             :key="sidesCoated.value">
                                {{ sidesCoated.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <!-- / Coating Applied -->

        <!-- Embellishments -->
        <a-form-item label="Is Embellished?">
            <a-radio-group @change="forceRefresh" v-model="paper.is_embellished"
                           button-style="solid">
                <a-radio-button :value="true">
                    Yes
                </a-radio-button>
                <a-radio-button :value="false">
                    No
                </a-radio-button>
            </a-radio-group>
        </a-form-item>

        <a-form layout="vertical" v-if="paper.is_embellished">
            <a-row :gutter="60">
                <a-col span="12">
                    <a-form-item label="Embellishment Type">
                        <a-select v-model="paper.embellishment_type"
                                  show-search size="large"
                                  style="width: 100%"
                                  @change="forceRefresh">
                            <a-select-option v-for="embellishmentType in embellishmentTypeOptions"
                                             :value="embellishmentType.value"
                                             :key="embellishmentType.value">
                                {{ embellishmentType.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <!-- / Embellishments -->

        <!-- Die Cutting Required -->
        <a-form layout="vertical">
            <a-row :gutter="60">
                <a-col span="12">
                    <a-form-item label="Die Cutting Required?">
                        <a-radio-group @change="forceRefresh"
                                       v-model="paper.die_cutting_required"
                                       button-style="solid">
                            <a-radio-button v-for="option in dieCuttingRequiredOptions" :key="option.value"
                                            :value="option.value">
                                {{ option.label }}
                            </a-radio-button>
                        </a-radio-group>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <!--  Die Cutting Required -->
    </div>
</template>

<script>
    import PaperSizeSelector from "./PaperSizeSelector";

    const PAPER_FINISH_OPTIONS = [
        {
            group: 'Coated Paper',
            options: [
                {
                    value: 'gloss',
                    label: 'Gloss'
                },
                {
                    value: 'satin',
                    label: 'Satin'
                },
                {
                    value: 'matte',
                    label: 'Matte'
                },
                {
                    value: 'silk-dull',
                    label: 'Silk/Dull'
                }
            ]
        },
        {
            group: 'Uncoated Paper',
            options: [
                {
                    value: 'wove-smooth',
                    label: 'Wove/Smooth'
                },
                {
                    value: 'laid',
                    label: 'Laid'
                },
                {
                    value: 'linen',
                    label: 'Linen'
                }
            ]
        }
        // {
        //     value: 'bond',
        //     label: 'Bond'
        // },
        // {
        //     value: 'coated-paper',
        //     label: 'Coated Paper'
        // },
        // {
        //     value: 'uncoated-paper',
        //     label: 'Uncoated Paper'
        // }
    ];

    const PAPER_WEIGHT_OPTIONS = [
        {
            value: '10-35gsm',
            label: '10-35gsm'
        },
        {
            value: '35-55gsm',
            label: '35-55gsm'
        },
        {
            value: '70-100gsm',
            label: '70-100gsm'
        },
        {
            value: '110-120gsm',
            label: '110-120gsm'
        },
        {
            value: '130-170gsm',
            label: '130-170gsm'
        },
        {
            value: '170-200gsm',
            label: '170-200gsm'
        },
        {
            value: '200-250gsm',
            label: '200-250gsm'
        },
        {
            value: '300-350gsm',
            label: '300-350gsm'
        },
        {
            value: '400gsm',
            label: '400gsm'
        }
    ];

    const PAPER_BRAND_OPTIONS = [
        {
            value: 'brand-1',
            label: 'Brand 1'
        },
        {
            value: 'brand-2',
            label: 'Brand 2'
        },
        {
            value: 'brand-3',
            label: 'Brand 3'
        }
    ];

    const PAPER_NAME_OPTIONS = [
        {
            value: 'paper-name-1',
            label: 'Paper Name 1'
        },
        {
            value: 'paper-name-2',
            label: 'Paper Name 2'
        }
    ];

    const COATING_TYPE_OPTIONS = [
        {
            value: 'laminate',
            label: 'Laminate'
        },
        {
            value: 'varnish',
            label: 'Varnish'
        },
        {
            value: 'encapsulation',
            label: 'Encapsulation'
        },
        {
            value: 'uv-varnish',
            label: 'UV Varnish'
        },
        {
            value: 'aqueous-coating',
            label: 'Aqueous Coating'
        }
    ];

    const COATING_FINISH_OPTIONS = [
        {
            value: 'matt',
            label: 'Matt'
        },
        {
            value: 'gloss',
            label: 'Gloss'
        },
        {
            value: 'satin',
            label: 'Satin'
        },
        {
            value: 'silk',
            label: 'Silk'
        },
        {
            value: 'soft-touch',
            label: 'Soft Touch'
        },
        {
            value: 'other',
            label: 'Other'
        }
    ];

    const COATING_APPLIED_OPTIONS = [
        {
            value: 'spot',
            label: 'Spot'
        },
        {
            value: 'process',
            label: 'Process'
        }
    ];

    const SIDES_COATED_OPTIONS = [
        {
            value: '1',
            label: 'One'
        },
        {
            value: '2',
            label: 'Two'
        }
    ];

    const EMBELLISHMENT_TYPE_OPTIONS = [
        {
            value: 'foiling',
            label: 'Foiling'
        },
        {
            value: 'embossing',
            label: 'Embossing'
        }
    ];

    const DIE_CUTTING_REQUIRED_OPTIONS = [
        {
            value: true,
            label: 'Yes'
        },
        {
            value: false,
            label: 'No'
        }
    ];

    export default {
        name: "IndividualPaperDetails",
        props: [
            'productSubtype',
            'paper',
            'propagateForceRefresh',
            'sectionNameOptions',
            'hideNameOfSection'
        ],
        methods: {
            forceRefresh() {
                if (this.propagateForceRefresh) {
                    this.$emit('force-refresh');
                }
                this.$forceUpdate();
            },

            handlePaperSizeSelected(size) {
                this.paper.paper_size = size;
                this.forceRefresh();
            }
        },
        components: {PaperSizeSelector},
        data() {
            return {
                paperFinishOptions: PAPER_FINISH_OPTIONS,
                paperWeightOptions: PAPER_WEIGHT_OPTIONS,
                paperBrandOptions: PAPER_BRAND_OPTIONS,
                paperNameOptions: PAPER_NAME_OPTIONS,
                coatingTypeOptions: COATING_TYPE_OPTIONS,
                coatingFinishOptions: COATING_FINISH_OPTIONS,
                coatingAppliedOptions: COATING_APPLIED_OPTIONS,
                sidesCoatedOptions: SIDES_COATED_OPTIONS,
                embellishmentTypeOptions: EMBELLISHMENT_TYPE_OPTIONS,
                dieCuttingRequiredOptions: DIE_CUTTING_REQUIRED_OPTIONS
            }
        }
    }
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
