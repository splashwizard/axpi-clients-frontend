<template>
    <div class="axpi-form width-large">

        <!-- Basic Details -->
        <div class="form-section">
            <div class="form-header">
                <h2>Basic Details</h2>
            </div>
            <t-shirt-details v-if="orderLocal.product_subtype === 't-shirt'"
                             :order-local="orderLocal"></t-shirt-details>

            <hoodie-details v-if="orderLocal.product_subtype === 'hoodie'"
                            :order-local="orderLocal"></hoodie-details>

            <sweater-details v-if="orderLocal.product_subtype === 'sweater'"
                             :order-local="orderLocal"></sweater-details>

            <!-- Item Mass -->
            <a-form layout="vertical">
                <a-row :gutter="70">
                    <a-col span="12">
                        <a-form-item label="Mass">
                            <a-input-group compact>
                                <a-input size="large" style="width: 70%" v-model="orderLocal.apparel_mass"/>
                                <a-select default-value="GBP" style="width: 30%" size="large" v-model="orderLocal.apparel_mass_unit">
                                    <a-select-option value="g">
                                        g
                                    </a-select-option>
                                    <a-select-option value="lbs">
                                        lbs
                                    </a-select-option>
                                </a-select>
                            </a-input-group>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <!-- / Item Mass -->
        </div>
        <!-- / Basic Details -->

        <!-- Materials -->
        <div class="form-section">
            <div class="form-header">
                <h2>Materials</h2>
            </div>
            <material-used-editor :order-local="orderLocal"></material-used-editor>
        </div>
        <!-- / Materials -->
    </div>
</template>

<script>
    import HoodieDetails from "./ApparelSpecificationEditor/HoodieDetails";
    import SweaterDetails from "./ApparelSpecificationEditor/SweaterDetails";
    import TShirtDetails from "./ApparelSpecificationEditor/TShirtDetails";
    import MaterialUsedEditor from "./ApparelSpecificationEditor/MaterialUsedEditor";

    export default {
        name: "ApparelSpecificationEditor",
        components: {HoodieDetails, SweaterDetails, TShirtDetails, MaterialUsedEditor},
        props: ['orderLocal']
    }
</script>

<style scoped>

</style>
