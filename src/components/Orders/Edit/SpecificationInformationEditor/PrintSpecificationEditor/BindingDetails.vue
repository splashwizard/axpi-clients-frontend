<template>
    <div class="pill-selector">
        <a-button :class="{'selected': isSelected(bindingType)}" shape="round" :key="bindingType"
                  v-for="bindingType in bindingTypes" @click="select(bindingType)">
            {{ getHumanReadableSubtype(bindingType) }}
        </a-button>
    </div>
</template>

<script>
    let _ = require('lodash');

    const BINDING_TYPES = {
        'leaflet': [
            'saddle_stitched',
            'perfect_bound',
            'pur_bound',
            'case_bound',
            'screw_post_binding',
            '3_hole_punch_binding',
            'thermal_binding',
            'spiral_bound',
            'wire-o_bound',
            'plastic_comb_bound',
            'board_bound',
            'glued_fold_bound',
            'thread_swen_binding',
            'burst_bound',
            'lock_bound',
            'section_sewn',
            'case_bound_section_sewn'
        ],
        'brochure': [
            'saddle_stitched',
            'perfect_bound',
            'pur_bound',
            'case_bound',
            'screw_post_binding',
            '3_hole_punch_binding',
            'thermal_binding',
            'spiral_bound',
            'wire-o_bound',
            'plastic_comb_bound',
            'board_bound',
            'glued_fold_bound',
            'thread_swen_binding'
        ],
        'book': [
            'saddle_stitched',
            'perfect_bound',
            'pur_bound',
            'case_bound',
            'screw_post_binding',
            '3_hole_punch_binding',
            'thermal_binding',
            'spiral_bound',
            'wire-o_bound',
            'plastic_comb_bound',
            'board_bound',
            'glued_fold_bound',
            'thread_swen_binding'
        ]
    };

    export default {
        name: "ProductSubtypeSelector",
        props: ['orderLocal'],
        data() {
            return {
                selected: null
            }
        },
        computed: {
            subtype() {
                return this.orderLocal.product_subtype;
            },

            bindingTypes() {
                if (this.subtype in BINDING_TYPES) {
                    return BINDING_TYPES[this.subtype];
                }
                return [];
            }
        },
        mounted() {
            this.selected = this.orderLocal.print_binding_type;
        },
        watch: {
            selected(newSelection) {
                this.orderLocal.print_binding_type = newSelection;
                this.$emit('property-updated');
            }
        },
        methods: {
            getHumanReadableSubtype(bindingType) {
                let parts = bindingType.split('_');
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
