<template>
    <div>
        <el-collapse v-model="activePanel" accordion :key="updateKey">
            <el-collapse-item v-for="(material, i) in orderLocal.pos_material" :key="i"
                              :title="getSectionNameLabel(material.material)" :name="i">
                <!-- Update wrapper -->
                <div class="collapse-inner-section">
                    <a-row :gutter="70">
                        <a-col :span="12">
                            <a-form layout="vertical">
                                <!-- Material -->
                                <a-form-item label="Material">
                                    <a-cascader size="large"
                                                style="width: 100%"
                                                @change="forceRefresh"
                                                :options="materialOptions"
                                                v-model="orderLocal.pos_material[i].material">
                                    </a-cascader>
                                </a-form-item>
                                <!-- / Material -->

                                <!-- Mass -->
                                <a-form-item label="Mass">
                                    <a-input-group compact>
                                        <a-input size="large" style="width: 70%" @blur="forceRefresh" v-model="orderLocal.pos_material[i].mass"/>
                                        <a-select default-value="g" style="width: 30%" size="large"
                                                  @change="forceRefresh"
                                                  v-model="orderLocal.pos_material[i].mass_unit">
                                            <a-select-option value="g">
                                                g
                                            </a-select-option>
                                            <a-select-option value="lbs">
                                                lbs
                                            </a-select-option>
                                        </a-select>
                                    </a-input-group>
                                </a-form-item>
                                <!-- / Mass -->
                            </a-form>
                        </a-col>
                    </a-row>
                </div>
                <!-- / Update wrapper -->
            </el-collapse-item>
        </el-collapse>

        <!-- Add new paper -->
        <a-button icon="plus" @click="addMaterial">Add material</a-button>
        <!-- / Add new paper -->
    </div>
</template>

<script>
    let _ = require('lodash');

    const MATERIAL_DATA_TEMPLATE = {
        material: null,
        mass: null,
        mass_unit: 'g'
    };

    const MATERIAL_OPTIONS = [
        {
            label: 'Aluminum',
            value: 'Aluminium'
        },
        {
            label: 'Steel',
            value: 'Steel'
        },
        {
            label: 'Wood',
            value: 'Wood'
        },
        {
            label: 'Fiberboard',
            value: 'Fiberboard'
        },
        {
            label: 'PVC',
            value: 'PVC'
        },
        {
            label: 'Acrylic',
            value: 'Acrylic'
        }
    ];

    export default {
        name: "MaterialUsedEditor",
        props: ['orderLocal'],
        data() {
            return {
                updateKey: 1,
                activePanel: undefined,

                materialOptions: MATERIAL_OPTIONS
            }
        },
        mounted() {
            if (!this.orderLocal.pos_material) {
                this.orderLocal.pos_material = [
                    {
                        ...MATERIAL_DATA_TEMPLATE
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
                this.$nextTick(() => {
                    this.$forceUpdate();
                });
            },

            addMaterial() {
                this.orderLocal.pos_material.push(
                    {
                        ...MATERIAL_DATA_TEMPLATE
                    }
                );
                this.$forceUpdate();
                this.activePanel = Number(this.orderLocal.pos_material.length - 1);
            },

            deleteMaterial(i) {
                this.orderLocal.pos_material = _.filter(this.orderLocal.pos_material, function (material, ii) {
                    return String(ii) !== String(i);
                })
                this.forceRefresh();
            },

            getSectionNameLabel(value) {
                if (!value) {
                    return 'Please select a material';
                }
                return value.join(' / ');
            }
        }
    }
</script>

<style scoped lang="scss">
    .el-collapse {
        margin-bottom: 20px;
    }
</style>
