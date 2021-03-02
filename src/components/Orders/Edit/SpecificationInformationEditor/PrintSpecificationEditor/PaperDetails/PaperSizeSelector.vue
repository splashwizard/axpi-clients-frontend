<template>
    <div class="page-size-selector">

        <div class="paper-selector" :class="{'has-selection': selected}">
            <div class="paper-background a0"></div>
            <div @click.prevent="selectSize('a0')" class="paper a0" :class="{'selected': isSizeSelected('a0')}">
            </div>
            <div class="paper-size-label a0">A0</div>

            <div class="paper-background a1"></div>
            <div @click.prevent="selectSize('a1')" class="paper a1" :class="{'selected': isSizeSelected('a1')}">
            </div>
            <div class="paper-size-label a1">A1</div>

            <div class="paper-background a2"></div>
            <div @click.prevent="selectSize('a2')" class="paper a2" :class="{'selected': isSizeSelected('a2')}">
            </div>
            <div class="paper-size-label a2">A2</div>

            <div class="paper-background a3"></div>
            <div @click.prevent="selectSize('a3')" class="paper a3" :class="{'selected': isSizeSelected('a3')}">
            </div>
            <div class="paper-size-label a3">A3</div>

            <div class="paper-background a4"></div>
            <div @click.prevent="selectSize('a4')" class="paper a4" :class="{'selected': isSizeSelected('a4')}">
            </div>
            <div class="paper-size-label a4">A4</div>

            <div class="paper-background a5"></div>
            <div @click.prevent="selectSize('a5')" class="paper a5" :class="{'selected': isSizeSelected('a5')}">
            </div>
            <div class="paper-size-label a5">A5</div>

            <div class="paper-background a6"></div>
            <div @click.prevent="selectSize('a6')" class="paper a6" :class="{'selected': isSizeSelected('a6')}">
            </div>
            <div class="paper-size-label a6">A6</div>

            <!--        <div class="paper a7">-->
            <!--            <div class="paper-size-label">A7</div>-->
            <!--        </div>-->
        </div>
    </div>
</template>

<script>
    export default {
        name: "PaperSizeSelector",
        props: ['initialSize'],
        data() {
            return {
                selected: this.initialSize
            }
        },
        methods: {
            selectSize(size) {
                if (this.selected === size) {
                    this.selected = null;
                } else {
                    this.selected = size;
                }
            },

            isSizeSelected(size) {
                return this.selected === size;
            }
        },
        watch: {
            selected(newSelected) {
                this.$emit('paper-size-selected', newSelected);
            }
        }
    }
</script>

<style scoped lang="scss">
    $scaling: 0.43;

    .page-size-selector {
        margin: 0 auto;
        width: 841px * $scaling;
        height: 1189px * $scaling;
        position: relative;
    }

    .paper-selector {
        margin-top: 10px;

        width: 841px * $scaling;
        height: 1189px * $scaling;
        position: relative;

        .paper-background {
            background: #fff;
            position: absolute;
            bottom: 0;
            left: 0;

            &.a0 {
                width: 841px * $scaling;
                height: 1189px * $scaling;
            }

            &.a1 {
                width: 594px * $scaling;
                height: 841px * $scaling;
            }

            &.a2 {
                width: 420px * $scaling;
                height: 594px * $scaling;
            }

            &.a3 {
                width: 297px * $scaling;
                height: 420px * $scaling;
            }

            &.a4 {
                width: 210px * $scaling;
                height: 297px * $scaling;
            }

            &.a5 {
                width: 148px * $scaling;
                height: 210px * $scaling;
            }

            &.a6 {
                width: 105px * $scaling;
                height: 148px * $scaling;
            }

            &.a7 {
                width: 74px * $scaling;
                height: 105px * $scaling;
            }
        }

        &.has-selection {
            .paper {
                opacity: 0.3;
            }
        }

        .paper {
            position: absolute;
            bottom: 0;
            left: 0;

            opacity: 0.8;

            &:hover, &.selected {
                border: 2px solid #fff;
                border-left-width: 0;
                border-bottom-width: 0;
                cursor: pointer;
            }

            &.selected {
                opacity: 1;
            }

            &.a0 {
                width: 841px * $scaling;
                height: 1189px * $scaling;
                background: #D4302A;
            }

            &.a1 {
                width: 594px * $scaling;
                height: 841px * $scaling;
                background: #DE6D35;
            }

            &.a2 {
                width: 420px * $scaling;
                height: 594px * $scaling;
                background: #EFC84F;
            }

            &.a3 {
                width: 297px * $scaling;
                height: 420px * $scaling;
                background: #A0C052;
            }

            &.a4 {
                width: 210px * $scaling;
                height: 297px * $scaling;
                background: #2A6339;
            }

            &.a5 {
                width: 148px * $scaling;
                height: 210px * $scaling;
                background: #55BAE8;
            }

            &.a6 {
                width: 105px * $scaling;
                height: 148px * $scaling;
                background: #1C2750;
            }

            &.a7 {
                width: 74px * $scaling;
                height: 105px * $scaling;
                background: #7F3483;
            }
        }

        .paper-size-label {
            color: #fff;
            position: absolute;
            font-size: 12px;
            font-weight: bold;
            left: 5px;

            &.a0 {
                top: 0;
            }

            &.a1 {
                top: 348px * $scaling;
            }

            &.a2 {
                top: 595px * $scaling;
            }

            &.a3 {
                top: 769px * $scaling;
            }

            &.a4 {
                top: 892px * $scaling;
            }

            &.a5 {
                top: 979px * $scaling;
            }

            &.a6 {
                top: 1041px * $scaling;
            }
        }
    }
</style>
