<template>
    <a-row :gutter="70">
        <a-col span="12">
            <a-form layout="vertical">
                <a-form-item label="Printing Method">
                    <a-cascader
                            size="large"
                            :options="printingMethodTypeOptions"
                            :show-search="{ filter }"
                            placeholder="Please select a printing type"
                            @change="onChange"
                    />
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>

<script>
    const PRINTING_METHOD_TYPE_OPTIONS = [
        {
            value: 'offset-printer',
            label: 'Offset Printer',
            children: [
                {
                    value: 'coldset-web-offset',
                    label: 'Coldset Web Offset'
                },
                {
                    value: 'heatset-web-offset',
                    label: 'Heatset Web Offset'
                },
                {
                    value: 'others',
                    label: 'Others'
                },
                {
                    value: 'sheet-fed-offset',
                    label: 'Sheet Fed Offset'
                }
            ]
        },
        {
            value: 'digital-printing',
            label: 'Digital Printing',
            children: [
                {
                    value: 'inkjet',
                    label: 'Inkjet'
                },
                {
                    value: 'laser',
                    label: 'Laser'
                },
                {
                    value: 'digital-press',
                    label: 'Digital Press'
                }
            ]
        },
        {
            value: 'digital-large-format',
            label: 'Digital Large Format'
        },
        {
            value: 'gravure',
            label: 'Gravure',
            children: [
                {
                    value: 'publication-gravure',
                    label: 'Publication Gravure'
                },
                {
                    value: 'packaging-gravure',
                    label: 'Packaging Gravure'
                },
                {
                    value: 'dabber-printing',
                    label: 'Dabber Printing'
                },
                {
                    value: 'other',
                    label: 'Other'
                }
            ]
        },
        {
            value: 'relief',
            label: 'Relief',
            children: [
                {
                    value: 'letter-press',
                    label: 'Letter Press'
                },
                {
                    value: 'flexography',
                    label: 'Flexography'
                },
                {
                    value: 'other',
                    label: 'Other'
                }
            ]
        },
        {
            value: 'screen-printing',
            label: 'Screen Printing'
        }
    ];

    export default {
        name: "AdditionalInfo",

        data() {
            return {
                printingMethodTypeOptions: PRINTING_METHOD_TYPE_OPTIONS
            }
        },

        methods: {
            filter(inputValue, path) {
                return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
            }
        }
    }
</script>

<style scoped>

</style>
