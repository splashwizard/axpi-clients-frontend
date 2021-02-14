<template>
    <div class="pill-selector">
        <a-button :class="{'selected': isSelected(numberOfWalls)}" shape="round" :key="numberOfWalls"
                  v-for="numberOfWalls in numberOfWallsOptions" @click="select(numberOfWalls)">
            {{ getHumanReadableSubtype(subtype) }}
        </a-button>
    </div>
</template>

<script>
    let _ = require('lodash');

    const NUMBER_OF_WALLS_OPTIONS = [
        {
            value: 1,
            label: 'Single Wall'
        },
        {
            value: 2,
            label: 'Double Wall'
        },
        {
            value: 3,
            label: 'Triple Wall'
        }
    ];

    export default {
        name: "NumberOfWallsSelector",
        props: ['cardboard'],
        data() {
            return {
                selected: null,
                options: NUMBER_OF_WALLS_OPTIONS
            }
        },
        mounted() {
            this.selected = _.find(NUMBER_OF_WALLS_OPTIONS, function(option) {
               return String(option.value) === String(this.cardboard.number_of_walls);
            })
        },
        watch: {
            selected(newSelection) {
                this.selected.number_of_walls = newSelection.value;
                this.$emit('property-updated');
            }
        },
        computed: {
            subtypesForSelectedProductType() {
                return SUBTYPES[this.orderLocal.product_type];
            }
        },
        methods: {
            getHumanReadableSubtype(subtype) {
                let parts = subtype.split('_');
                parts = _.map(parts, part => {
                    return part.charAt(0).toUpperCase() + part.slice(1);
                });
                return parts.join(' ');
            },

            select(key) {
                this.selected = key;
            },

            isSelected(key) {
                return this.selected === key;
            }
        }
    }
</script>

<style scoped>

</style>
