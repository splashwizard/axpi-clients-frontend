<template>
    <a-descriptions bordered :key="updateKey">
        <a-descriptions-item :label="liningLabel" :span="3">
            <!-- Lining (Wall) Details -->
            <a-form layout="vertical">
                <a-form-item label="Paper Type">
                    <a-select v-model="cardboard[liningProperty].paper_type"
                              show-search

                              @change="handlePropertyUpdated">
                        <a-select-option v-for="paperType in paperTypeOptions" :value="paperType.value"
                                         :key="paperType.value">
                            {{ paperType.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Paper Weight">
                    <a-input-group compact>
                        <a-input style="width: 50%" v-model="cardboard[liningProperty].paper_weight"/>
                        <a-select style="width: 50%" v-model="cardboard[liningProperty].paper_weight_unit">
                            <a-select-option v-for="paperWeightUnit in paperWeightUnitOptions"
                                             :value="paperWeightUnit.value"
                                             :key="paperWeightUnit.value">
                                {{ paperWeightUnit.label }}
                            </a-select-option>
                        </a-select>
                    </a-input-group>
                </a-form-item>
            </a-form>
            <!-- / Lining (Wall) Details -->
        </a-descriptions-item>
        <a-descriptions-item :label="flutingLabel" v-if="!isLastWall" :span="3">
            <!-- Fluting Details -->
            <a-form layout="vertical">
                <a-form-item label="Paper Type">
                    <a-select v-model="cardboard[flutingProperty].paper_type"
                              show-search

                              @change="handlePropertyUpdated">
                        <a-select-option v-for="paperType in paperTypeOptions" :value="paperType.value"
                                         :key="paperType.value">
                            {{ paperType.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
            <!-- / Fluting Details -->
        </a-descriptions-item>
    </a-descriptions>
</template>

<script>
    const PAPER_TYPE_OPTIONS = [
        {
            value: 'kraft',
            label: 'Kraft'
        },
        {
            value: 'test-2',
            label: 'Test 2'
        },
        {
            value: 'test-3',
            label: 'Test 3'
        },
        {
            value: 'chip',
            label: 'Chip'
        },
        {
            value: 'fully-bleached-white',
            label: 'Fully Bleached White'
        },
        {
            value: 'white-top',
            label: 'White Top'
        },
        {
            value: 'mottled-kraft',
            label: 'Mottled Kraft'
        },
        {
            value: 'oyster',
            label: 'Oyster'
        },
        {
            value: 'semi-chem',
            label: 'Semi Chem'
        },
        {
            value: 'waste-based',
            label: 'Waste Based'
        }
    ];
    const PAPER_WEIGHT_UNIT_OPTIONS = [
        {
            label: 'g',
            value: 'g'
        },
        {
            label: 'lbs',
            value: 'lbs'
        }
    ];
    export default {
        name: "WallDetails",
        props: ['wall', 'cardboard', 'isLastWall'],
        data() {
            return {
                updateKey: 1,
                paperTypeOptions: PAPER_TYPE_OPTIONS,
                paperWeightUnitOptions: PAPER_WEIGHT_UNIT_OPTIONS
            }
        },
        methods: {
            handlePropertyUpdated() {
                this.updateKey += 1;
            }
        },
        computed: {
            liningLabel() {
                return 'Lining ' + this.wall;
            },

            flutingLabel() {
                return 'Fluting ' + this.wall;
            },

            wallNumberText() {
                if (this.wall === 1) {
                    return 'one';
                } else if (this.wall === 2) {
                    return 'two';
                } else if (this.wall === 3) {
                    return 'three';
                } else {
                    return null;
                }
            },

            liningProperty() {
                return 'lining_' + this.wallNumberText + '_details';
            },

            flutingProperty() {
                return 'fluting_' + this.wallNumberText + '_details';
            }
        }
    }
</script>

<style scoped>

</style>
