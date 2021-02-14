<template>
    <a-descriptions bordered>
        <a-descriptions-item :label="liningLabel" :span="3">
            Cloud Database
        </a-descriptions-item>
        <a-descriptions-item :label="flutingLabel" v-if="!isLastWall">
            Cloud Database
        </a-descriptions-item>
    </a-descriptions>
</template>

<script>
    export default {
        name: "WallDetails",
        props: ['wall', 'cardboard', 'isLastWall'],
        computed: {
            liningLabel() {
                return 'Lining ' + this.wall;
            },

            flutingLabel() {
               return 'Fluting '  + this.wall;
            },

            wallNumberText() {
               if (this.wall === 1)  {
                   return 'one';
               } else if (this.wall === 2) {
                  return 'two';
               } else if (this.wall === 3) {
                   return 'three';
               } else {
                   return null;
               }
            },

            liningProperty() {
                return 'lining_' + this.wallNumberText + '_details';
            },

            flutingProperty() {
                return 'fluting_' + this.wallNumberText + '_details';
            }
        }
    }
</script>

<style scoped>

</style>
