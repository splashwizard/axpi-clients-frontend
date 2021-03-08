<template>
    <div>
        <!-- Cardboard Used (Permanent) -->
        <div class="form-section" v-if="orderLocal.product_subtype === 'permanent'">
            <div class="form-header">
                <h2>Cardboard Used</h2>
            </div>
            <cardboard-used-editor :order-local="orderLocal"></cardboard-used-editor>
        </div>
        <!-- / Cardboard Used -->

        <!-- Semi Permanent Basic Details -->
        <div class="form-section" v-if="orderLocal.product_subtype === 'semi_permanent'">
            <div class="form-header">
                <h2>Basic Details</h2>
            </div>
            <a-row :gutter="70">
                <a-col span="12">
                    <!-- General Paper Details -->
                    <a-form layout="vertical">
                        <a-form-item label="POS Type">
                            <a-select v-model="orderLocal.semi_permanent_pos_type"
                                      show-search size="large">
                                <a-select-option v-for="type in posTypeOptions" :value="type.value"
                                                 :key="type.value">
                                    {{ type.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-form>
                </a-col>
            </a-row>
        </div>
        <!-- / Semi Permanent Basic Details -->

        <!-- Semi Permanent Material Used -->
        <div class="form-section" v-if="orderLocal.product_subtype === 'semi_permanent'">
            <div class="form-header">
                <h2>Material Used</h2>
            </div>
            <material-used-editor :order-local="orderLocal"></material-used-editor>
        </div>
        <!-- / Semi Permanent Material Used -->

        <!-- Product Details -->
        <div class="form-section">
            <div class="form-header">
                <h2>Product Details</h2>
            </div>
            <product-details :order-local="orderLocal"></product-details>
        </div>
        <!-- / Product Details -->
    </div>
</template>

<script>
    import CardboardUsedEditor from "./PosSpecificationEditor/CardboardUsedEditor";
    import ProductDetails from "./PosSpecificationEditor/ProductDetails";
    import MaterialUsedEditor from "./PosSpecificationEditor/MaterialUsedEditor";

    const POS_TYPE_OPTIONS = [
        {
            label: 'Dumpbin',
            value: 'dumpbin'
        },
        {
            label: 'Pallet Display',
            value: 'pallet-display'
        },
        {
            label: 'Floor Display',
            value: 'floor-display'
        },
        {
            label: 'Counter Display',
            value: 'counter-display'
        },
        {
            label: 'Powerwing Display',
            value: 'powerwing-display'
        }
    ];

    export default {
        name: "PosSpecificationEditor",
        components: {CardboardUsedEditor, ProductDetails, MaterialUsedEditor},
        props: ['orderLocal'],
        data() {
            return {
                posTypeOptions: POS_TYPE_OPTIONS
            }
        }
    }
</script>

<style scoped>

</style>
