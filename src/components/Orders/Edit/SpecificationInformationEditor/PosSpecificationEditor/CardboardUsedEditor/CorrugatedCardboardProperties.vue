<template>
    <div>
        <div class="ant-col ant-form-item-label"><label title="Type of Cardboard" class="">Number Of Walls</label></div>
        <number-of-walls-selector :cardboard="cardboard"
                                  @property-updated="handlePropertyUpdated"></number-of-walls-selector>

        <!-- Wall Details -->
        <div class="wall-details" :key="updateKey">
            <wall-details :cardboard="cardboard" v-for="wall in walls" :wall="wall" :is-last-wall="wall === walls.length"
                          :key="wall"></wall-details>
        </div>
        <!-- / Wall Details -->
    </div>
</template>

<script>
    import NumberOfWallsSelector from "./CorrugatedCardboardProperties/NumberOfWallsSelector";
    import WallDetails from "./CorrugatedCardboardProperties/WallDetails";

    export default {
        name: "CorrugatedCardboardProperties",
        props: ['cardboard'],
        components: {NumberOfWallsSelector, WallDetails},
        data() {
            return {
                updateKey: 1,
                walls: []
            }
        },
        methods: {
            handlePropertyUpdated() {
                this.$emit('property-updated');
                this.determineWalls();
                this.incrementUpdateKey();
            },

            incrementUpdateKey() {
                this.updateKey = this.updateKey + 1;
            },

            determineWalls() {
                let walls = [];
                let i = 1;
                for (i = 1; i <= this.cardboard.number_of_walls; i++) {
                    walls.push(i);
                }
                this.walls = walls;
            }
        }
    }
</script>

<style scoped>
    .ant-descriptions {
        margin-top: 20px;
    }
</style>
