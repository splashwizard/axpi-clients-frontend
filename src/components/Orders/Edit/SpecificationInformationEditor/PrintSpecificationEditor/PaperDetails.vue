<template>
    <div>
        <el-collapse v-model="activePanel" accordion :key="updateKey">
            <el-collapse-item v-for="(paper, i) in orderLocal.paper" :key="i"
                              :title="getSectionNameLabel(paper.section_name)" :name="i">
                <!-- Update wrapper -->
                <div class="collapse-inner-section">

                    <!-- General Paper Details -->
                    <a-form layout="vertical">
                        <a-form-item label="Name of Section">
                            <a-select v-model="orderLocal.paper[i].section_name"
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
                                     v-model="orderLocal.paper[i].number_of_pages"
                                     @blur="forceRefresh"
                                     size="large"></a-input>
                        </a-form-item>

                        <a-form-item label="Paper Finish">
                            <a-select v-model="orderLocal.paper[i].paper_finish"
                                      show-search size="large"
                                      @change="forceRefresh">
                                <a-select-option v-for="paperFinish in paperFinishOptions" :value="paperFinish.value"
                                                 :key="paperFinish.value">
                                    {{ paperFinish.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>

                        <a-form-item label="Paper Weight">
                            <a-select v-model="orderLocal.paper[i].paper_weight"
                                      show-search size="large"
                                      @change="forceRefresh">
                                <a-select-option v-for="paperWeight in paperWeightOptions" :value="paperWeight.value"
                                                 :key="paperWeight.value">
                                    {{ paperWeight.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>

                        <a-form-item label="Paper Brand">
                            <a-select v-model="orderLocal.paper[i].paper_brand"
                                      show-search size="large"
                                      @change="forceRefresh">
                                <a-select-option v-for="paperBrand in paperBrandOptions" :value="paperBrand.value"
                                                 :key="paperBrand.value">
                                    {{ paperBrand.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>

                        <a-form-item label="Paper Name">
                            <a-select v-model="orderLocal.paper[i].paper_name"
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
                </div>
                <!-- / Update wrapper -->
            </el-collapse-item>
        </el-collapse>

        <!-- Add new paper -->
        <a-button icon="plus" @click="addPaper">Add paper section</a-button>
        <!-- / Add new paper -->
    </div>
</template>

<script>
    let _ = require('lodash');

    const PAPER_DATA_TEMPLATE = {
        section_name: 'body',
        number_of_pages: ''
    };

    const SECTION_NAME_OPTIONS = [
        {
            value: 'body',
            label: 'Body'
        },
        {
            value: 'cover',
            label: 'Cover'
        }
    ];

    const PAPER_FINISH_OPTIONS = [
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
        },
        {
            value: 'laid',
            label: 'Laid'
        },
        {
            value: 'linen',
            label: 'Linen'
        },
        {
            value: 'wove-smooth',
            label: 'Wove/Smooth'
        },
        {
            value: 'bond',
            label: 'Bond'
        },
        {
            value: 'coated-paper',
            label: 'Coated Paper'
        },
        {
            value: 'uncoated-paper',
            label: 'Uncoated Paper'
        }
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

    export default {
        name: "PaperDetails",
        props: ['orderLocal'],
        data() {
            return {
                updateKey: 1,
                activePanel: undefined,

                sectionNameOptions: SECTION_NAME_OPTIONS,
                paperFinishOptions: PAPER_FINISH_OPTIONS,
                paperWeightOptions: PAPER_WEIGHT_OPTIONS,
                paperBrandOptions: PAPER_BRAND_OPTIONS,
                paperNameOptions: PAPER_NAME_OPTIONS
            }
        },
        mounted() {
            if (!this.orderLocal.paper) {
                this.orderLocal.paper = [
                    {
                        ...PAPER_DATA_TEMPLATE
                    }
                ];
                this.incrementUpdateKey();
            }
        },
        methods: {
            incrementUpdateKey() {
                this.updateKey += 1;
            },

            forceRefresh() {
                this.$forceUpdate();
            },

            addPaper() {
                this.orderLocal.paper.push(
                    {
                        ...PAPER_DATA_TEMPLATE
                    }
                );
                this.$forceUpdate();
                this.activePanel = Number(this.orderLocal.paper.length - 1);
            },

            deletePaper(i) {
                this.orderLocal.paper = _.filter(this.orderLocal.paper, function (paper, ii) {
                    return String(ii) !== String(i);
                })
                this.$forceUpdate();
            },

            getSectionNameLabel(value) {
                let sectionName = _.find(this.sectionNameOptions, {value: value});
                return sectionName ? sectionName.label : value;
            }
        }
    }
</script>

<style scoped>
    .el-collapse {
        margin-bottom: 20px;
    }
</style>
