<template>
    <div>
        <a-form layout="vertical">
            <a-form-item label="Width">
                <a-input-group compact>
                    <a-input size="large" style="width: 50%" v-model="orderLocal.pos_product_width"  />
                    <a-select default-value="GBP" size="large" v-model="orderLocal.pos_product_width_unit">
                        <a-select-option value="cm">
                            cm
                        </a-select-option>
                        <a-select-option value="inch">
                            inch
                        </a-select-option>
                    </a-select>
                </a-input-group>
            </a-form-item>

            <a-form-item label="Depth">
                <a-input-group compact>
                    <a-input size="large" style="width: 50%" v-model="orderLocal.pos_product_depth"  />
                    <a-select default-value="GBP" size="large" v-model="orderLocal.pos_product_depth_unit">
                        <a-select-option value="cm">
                            cm
                        </a-select-option>
                        <a-select-option value="inch">
                            inch
                        </a-select-option>
                    </a-select>
                </a-input-group>
            </a-form-item>

            <a-form-item label="Height">
                <a-input-group compact>
                    <a-input size="large" style="width: 50%" v-model="orderLocal.pos_product_height"  />
                    <a-select default-value="GBP" size="large" v-model="orderLocal.pos_product_height_unit">
                        <a-select-option value="cm">
                            cm
                        </a-select-option>
                        <a-select-option value="inch">
                            inch
                        </a-select-option>
                    </a-select>
                </a-input-group>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
    export default {
        name: "ProductDetails",
        props: ['orderLocal']
    }
</script>

<style scoped>

</style>
