<template>
    <div class="axpi-form">
        <!-- Product Type -->
        <div class="form-section">
           <div class="form-header">
               <h2>Product Type</h2>
           </div>
            <product-type-selector :order-local="orderLocal"></product-type-selector>
        </div>
        <!-- / Product Type -->

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

    export default {
        name: "SpecificationInformationEditor",
        props: ['orderLocal'],
        components: {ProductTypeSelector},
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
