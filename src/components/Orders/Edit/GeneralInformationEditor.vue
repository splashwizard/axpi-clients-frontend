<template>
    <div class="axpi-form" v-if="orderLocal">
        <!-- Customer Information -->
        <div class="form-section">
            <div class="form-header">
                <h2>Customer Information</h2>
            </div>
            <customer-information
                    :client="order.client"
                    :organisational-unit="order.organisational_unit"></customer-information>
        </div>
        <!-- /Customer Information -->

        <!-- Product Information -->
        <div class="form-section">
            <div class="form-header">
                <h2>Product Information</h2>
            </div>
            <product-information :order="orderLocal"></product-information>
        </div>
        <!-- / Product Information -->
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import CustomerInformation from "./GeneralInformationEditor/CustomerInformation";
    import ProductInformation from "./GeneralInformationEditor/ProductInformation";

    export default {
        name: "GeneralInformationEditor",

        components: {CustomerInformation, ProductInformation},

        computed: {
            ...mapGetters('orderEditor', {
                order: 'order'
            })
        },

        data() {
            return {
                orderLocal: null
            }
        },

        mounted() {
            this.orderLocal = this.order;
        }
    }
</script>

<style scoped>

</style>
