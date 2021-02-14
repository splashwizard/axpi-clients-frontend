<template>
    <a-descriptions bordered :key="updateKey">
        <a-descriptions-item :label="liningLabel" :span="3">
            <!-- Lining (Wall) Details -->
            <a-form layout="vertical">
                <a-form-item label="Paper Type">
                    <a-select v-model="cardboard[liningProperty].paper_type"
                              show-search

                              @change="handlePropertyUpdated">
                        <a-select-option value="kraft">
                            Kraft
                        </a-select-option>
                        <a-select-option value="test-2">
                            Test 2
                        </a-select-option>
                        <a-select-option value="test-3">
                            Test 3
                        </a-select-option>
                        <a-select-option value="chip">
                            Chip
                        </a-select-option>
                        <a-select-option value="fully-bleached-white">
                            Fully Bleached White
                        </a-select-option>
                        <a-select-option value="white-top">
                            White Top
                        </a-select-option>
                        <a-select-option value="mottled-kraft">
                            Mottled Kraft
                        </a-select-option>
                        <a-select-option value="oyster">
                           Oyster
                        </a-select-option>
                        <a-select-option value="semi-chem">
                            Semi Chem
                        </a-select-option>
                        <a-select-option value="waste-based">
                            Waste Based
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
            <!-- / Lining (Wall) Details -->
        </a-descriptions-item>
        <a-descriptions-item :label="flutingLabel" v-if="!isLastWall" :span="3">
            Cloud Database
        </a-descriptions-item>
    </a-descriptions>
</template>

<script>
    export default {
        name: "WallDetails",
        props: ['wall', 'cardboard', 'isLastWall'],
        data() {
            return {
                updateKey: 1
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
