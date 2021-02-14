<template>
    <div>
        <!-- EACH CARDBOARD USED REPEATER -->
        <div v-for="(cardboard, i) in orderLocal.pos_cardboard_used" :key="i">
            test
        </div>
        <!-- / EACH CARDBOARD USED REPEATER -->
    </div>
</template>

<script>
    const CARDBOARD_USED_DATA_TEMPLATE = {
        cardboard_type: null
    };
    export default {
        name: "CardboardUsedEditor",
        props: ['orderLocal'],
        mounted() {
            if (!this.orderLocal.pos_cardboard_used) {
                this.orderLocal.pos_cardboard_used = [
                    {
                        ...CARDBOARD_USED_DATA_TEMPLATE
                    }
                ];
            }
        }
    }
</script>

<style scoped>

</style>
