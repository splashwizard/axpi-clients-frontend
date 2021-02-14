<template>
    <div class="axpi-form">
        <!-- Product Type -->
        <div class="form-section">
           <div class="form-header">
               <h2>Product Type</h2>
           </div>
            <div class="form-margin-bottom">
                <product-type-selector :order-local="orderLocal"></product-type-selector>
            </div>

            <div class="form-header">
                <h2>Product Subtype</h2>
            </div>
            <product-subtype-selector :order-local="orderLocal"></product-subtype-selector>
        </div>
        <!-- / Product Type -->

        <!-- POS Specification Editor -->
        <pos-specification-editor v-if="orderLocal.product_type === 'pos'" :order-local="orderLocal"></pos-specification-editor>
        <!-- / POS Specification Editor -->

        <!-- Form footer -->
        <div class="form-footer">
            <a-button size="large" @click="goToPreviousStage" class="button-space-right">
                <a-icon type="arrow-left"></a-icon>
                Go Back
            </a-button>

            <a-button size="large" type="primary" @click="goToNextStage">
                Continue
                <a-icon type="arrow-right"></a-icon>
            </a-button>
        </div>
        <!-- / Form Footer -->
    </div>
</template>

<script>
    import {mapActions} from "vuex";
    import ProductTypeSelector from "./SpecificationInformationEditor/ProductTypeSelector";
    import ProductSubtypeSelector from "./SpecificationInformationEditor/ProductSubtypeSelector";
    import PosSpecificationEditor from "./SpecificationInformationEditor/PosSpecificationEditor";

    export default {
        name: "SpecificationInformationEditor",
        props: ['orderLocal'],
        components: {ProductTypeSelector, ProductSubtypeSelector, PosSpecificationEditor},
        methods: {
            ...mapActions('orderEditor', {
                goToNextStage: 'goToNextStage',
                goToPreviousStage: 'goToPreviousStage'
            })
        }
    }
</script>

<style scoped>

</style>
