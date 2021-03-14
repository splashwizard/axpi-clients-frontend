<template>
    <a-row :gutter="50">
        <a-col :span="12">
            <a-form layout="vertical">
                <a-form-item label="Order Date">
                    <a-date-picker style="width: 100%" size="large" v-model="orderLocal.order_date" placeholder="Order Date"/>
                </a-form-item>
                <a-form-item label="Date Delivered">
                    <a-date-picker  style="width: 100%" size="large" v-model="orderLocal.delivery_date" placeholder="Delivery Date"/>
                </a-form-item>
                <a-form-item label="Price">
                    <a-input-group compact>
                        <a-input size="large" style="width: 70%" v-model="orderLocal.cost"/>
                        <a-select default-value="GBP" size="large" style="width: 30%" v-model="orderLocal.cost_currency">
                            <a-select-option value="GBP">
                                GBP
                            </a-select-option>
                            <a-select-option value="USD">
                                USD
                            </a-select-option>
                        </a-select>
                    </a-input-group>
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>

<script>
    export default {
        name: "OrderInformation",
        props: ['orderLocal']
    }
</script>

<style scoped lang="scss">
</style>
