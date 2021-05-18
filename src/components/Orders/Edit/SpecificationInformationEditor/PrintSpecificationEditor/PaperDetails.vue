<template>
    <div>
        <!-- Single Section -->
        <div v-if="['leaflet', 'poster', 'business_card'].includes(subtype)"
                class="single-section" :key="updateKey">
            <individual-paper-details
                    v-if="orderLocal.paper && orderLocal.paper.length"
                    :product-subtype="subtype"
                    :propagate-force-refresh="true"
                    @force-refresh="forceRefresh"
                    :hide-name-of-section="true"
                    :section-name-options="sectionNameOptions"
                    :paper="orderLocal.paper[0]"></individual-paper-details>
        </div>
        <!-- / Single Section -->

        <!-- Multi Section -->
        <div v-if="['brochure', 'book', 'pad'].includes(subtype)"
                class="multi-section">
            <el-collapse v-model="activePanel" accordion :key="updateKey">
                <el-collapse-item v-for="(paper, i) in orderLocal.paper" :key="i"
                                  :title="getSectionNameLabel(paper.section_name)" :name="i">
                    <!-- Update wrapper -->
                    <div class="collapse-inner-section">

                        <individual-paper-details
                                :product-subtype="subtype"
                                :propagate-force-refresh="true"
                                @force-refresh="forceRefresh"
                                :section-name-options="sectionNameOptions"
                                :paper="orderLocal.paper[i]"></individual-paper-details>

                    </div>
                    <!-- / Update wrapper -->
                </el-collapse-item>
            </el-collapse>

            <!-- Add new paper -->
            <a-button icon="plus" @click="addPaper">Add paper section</a-button>
            <!-- / Add new paper -->
        </div>
        <!-- / Multi Section -->
    </div>
</template>

<script>
    import IndividualPaperDetails from "./PaperDetails/IndividualPaperDetails";

    let _ = require('lodash');

    const PAPER_DATA_TEMPLATE = {
        section_name: 'Body',
        number_of_pages: '',
        paper_weight: '',
        paper_weight_unit: 'gsm',

        paper_size_type: 'standard',
        paper_size: null,
        custom_paper_size_width: '',
        custom_paper_size_width_unit: 'mm',
        custom_paper_size_height: '',
        custom_paper_size_height_unit: 'mm',

        colour_type: 'process', // process, spot, both
        number_of_process_colours: null,
        number_of_spot_colours: null,

        is_coating_applied: false,
        coating_type: null,
        coating_finish: null,
        coating_applied: null,
        sides_coated: 1,

        is_embellished: false,
        embellishment_type: null,

        die_cutting_required: true
    };
    const SECTION_NAME_OPTIONS = [
        {
            value: 'Body',
            label: 'Body'
        },
        {
            value: 'Cover',
            label: 'Cover'
        }
    ];

    export default {
        name: "PaperDetails",
        props: ['orderLocal'],
        data() {
            return {
                updateKey: 1,
                activePanel: undefined,

                sectionNameOptions: SECTION_NAME_OPTIONS
            }
        },
        components: {IndividualPaperDetails},
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
        computed: {
            subtype() {
                return this.orderLocal.product_subtype;
            }
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

<style scoped lang="scss">
    .el-collapse {
        margin-bottom: 20px;
    }
</style>
