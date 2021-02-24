<template>
    <div class="axpi-form width-medium">
        <!-- Customer Information -->
        <div class="form-section">
            <div class="form-header">
                <h2>Customer Information</h2>
            </div>
            <customer-information
                    :client="orderLocal.client"
                    :organisational-unit="orderLocal.organisational_unit"></customer-information>
        </div>
        <!-- /Customer Information -->

        <!-- Product Information -->
        <div class="form-section">
            <div class="form-header">
                <h2>Product Information</h2>
            </div>
            <product-information :order-local="orderLocal"></product-information>
        </div>
        <!-- / Product Information -->

        <!-- Order Information -->
        <div class="form-section">
            <div class="form-header">
                <h2>Order Information</h2>
            </div>
            <order-information :order-local="orderLocal"></order-information>
        </div>
        <!-- / Order Information -->

        <!-- Form footer -->
        <div class="form-footer">
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

    import CustomerInformation from "./GeneralInformationEditor/CustomerInformation";
    import ProductInformation from "./GeneralInformationEditor/ProductInformation";
    import OrderInformation from "./GeneralInformationEditor/OrderInformation";

    export default {
        name: "GeneralInformationEditor",
        props: ['orderLocal'],
        components: {CustomerInformation, ProductInformation, OrderInformation},
        methods: {
            ...mapActions('orderEditor', {
                goToNextStage: 'goToNextStage'
            })
        }
    }
</script>

<style scoped>

</style>
