<template>
    <div :key="updateKey">
        <!-- EACH CARDBOARD USED REPEATER -->
        <div v-for="(cardboard, i) in orderLocal.pos_cardboard_used" :key="i">
            <a-card :title="getCardboardCardTitle(i)">
                <a v-if="orderLocal.pos_cardboard_used.length > 1" slot="extra" href="#" @click="deleteCardboard(i)">
                    <a-icon type="close"></a-icon>
                </a>

                <a-form layout="vertical">
                    <!-- Type of cardboard -->
                    <a-form-item label="Type of Cardboard">
                        <a-select v-model="orderLocal.pos_cardboard_used[i].cardboard_type" size="large"
                                  @change="incrementUpdateKey">
                            <a-select-option value="corrugated-cardboard">
                                Corrugated Cardboard
                            </a-select-option>
                            <a-select-option value="paper-board">
                                Paper Board
                            </a-select-option>
                            <a-select-option value="matt-board">
                                Matt Board
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <!-- / Type of cardboard -->

                    <corrugated-cardboard-properties v-if="orderLocal.pos_cardboard_used[i].cardboard_type === 'corrugated-cardboard'"
                    :cardboard="orderLocal.pos_cardboard_used[i]" @property-changed="incrementUpdateKey">
                    </corrugated-cardboard-properties>
                </a-form>
            </a-card>
        </div>
        <!-- / EACH CARDBOARD USED REPEATER -->

        <!-- Add new cardboard button -->
        <a-button icon="plus" @click="addCardboard">Add cardboard</a-button>
        <!-- / Add new cardboard button -->
    </div>
</template>

<script>
    import CorrugatedCardboardProperties from "./CardboardUsedEditor/CorrugatedCardboardProperties";
    let _ = require('lodash');

    const CARDBOARD_USED_DATA_TEMPLATE = {
        cardboard_type: null,

        lining_one_details: {},
        fluting_one_details: {},

        lining_two_details: {},
        fluting_two_details: {},

        lining_three_details: {},
        fluting_three_details: {}
    };
    export default {
        name: "CardboardUsedEditor",
        components: {CorrugatedCardboardProperties},
        props: ['orderLocal'],
        data() {
            return {
                updateKey: 1
            }
        },
        mounted() {
            if (!this.orderLocal.pos_cardboard_used) {
                this.orderLocal.pos_cardboard_used = [
                    {
                        ...CARDBOARD_USED_DATA_TEMPLATE
                    }
                ];
                this.incrementUpdateKey();
            }
        },
        methods: {
            incrementUpdateKey() {
                this.updateKey += 1;
            },

            getCardboardCardTitle(i) {
                return 'Cardboard ' + (i + 1);
            },

            addCardboard() {
                this.orderLocal.pos_cardboard_used.push(
                    {
                        ...CARDBOARD_USED_DATA_TEMPLATE
                    }
                );
                this.incrementUpdateKey();
            },

            deleteCardboard(i) {
               this.orderLocal.pos_cardboard_used = _.filter(this.orderLocal.pos_cardboard_used, function(cardboard, ii) {
                   return String(ii) !== String(i);
               })
                this.incrementUpdateKey();
            }
        }
    }
</script>

<style scoped>
    .ant-card {
        margin-bottom: 20px;
    }
</style>
