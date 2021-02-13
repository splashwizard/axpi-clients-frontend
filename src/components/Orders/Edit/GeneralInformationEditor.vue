<template>
    <div class="axpi-form">
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
    </div>
</template>

<script>
    import CustomerInformation from "./GeneralInformationEditor/CustomerInformation";
    import ProductInformation from "./GeneralInformationEditor/ProductInformation";
    import OrderInformation from "./GeneralInformationEditor/OrderInformation";

    export default {
        name: "GeneralInformationEditor",
        props: ['orderLocal'],
        components: {CustomerInformation, ProductInformation, OrderInformation},
    }
</script>

<style scoped>

</style>
