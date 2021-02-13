<template>
    <a-form layout="vertical">
        <a-form-item label="Order Date">
            <a-date-picker size="large" v-model="order.order_date" placeholder="Order Date"/>
        </a-form-item>
        <a-form-item label="Date Delivered">
            <a-date-picker size="large" v-model="order.delivery_date" placeholder="Delivery Date"/>
        </a-form-item>
        <a-form-item label="Price">
            <a-input-group compact>
                <a-input size="large" style="width: 50%" v-model="order.cost"  />
                <a-select default-value="GBP" size="large" v-model="order.cost_currency">
                    <a-select-option value="GBP">
                        GBP
                    </a-select-option>
                    <a-select-option value="Jiangsu">
                        Jiangsu
                    </a-select-option>
                </a-select>
            </a-input-group>
        </a-form-item>
    </a-form>
</template>

<script>
    export default {
        name: "OrderInformation",
        props: ['order']
    }
</script>

<style scoped lang="scss">
</style>
