<template>
    <div>
        <a-table v-show="localChemicals && localChemicals.length" bordered :columns="columns"
                 :data-source="localChemicals" :pagination="false">
            <template slot="type" slot-scope="text, record">
                <div>
                    <a-select v-if="record.editable"
                              :default-value="text" style="width: 120px"
                              @change="val => handleChange(val, record.key, 'type')">
                        <a-select-option v-for="(option, i) in typeOptions" :key="i" :value="option.value">
                            {{ option.label }}
                        </a-select-option>
                    </a-select>

                    <template v-else>
                        {{ getTypeLabel(text) }}
                    </template>
                </div>
            </template>

            <template slot="brand" slot-scope="text, record">
                <div>
                    <a-select v-if="record.editable"
                              :default-value="text" style="width: 120px"
                              @change="val => handleChange(val, record.key, 'brand')">
                        <a-select-option v-for="(option, i) in brandOptions" :key="i" :value="option.value">
                            {{ option.label }}
                        </a-select-option>
                    </a-select>

                    <template v-else>
                        {{ getBrandLabel(text) }}
                    </template>
                </div>
            </template>

            <template slot="actions" slot-scope="text, record">
                <div class="editable-row-actions">
                     <span v-if="record.editable">
                      <a @click="() => save(record.key)">Save</a>
                      <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
                         <a>Cancel</a>
                      </a-popconfirm>
                    </span>
                    <span v-else>
                        <a :disabled="editingKey !== ''" @click="() => edit(record.key)">Edit</a>

                       <a-popconfirm :disabled="editingKey !== ''" title="Sure want to delete?"
                                     @confirm="() => deleteRow(record.key)">
                         <a :disabled="editingKey !== ''">Delete</a>
                      </a-popconfirm>
                    </span>
                </div>
            </template>
        </a-table>

        <div class="bottom-actions">
            <a-button @click.native="addChemical" icon="plus">Add Chemical</a-button>
        </div>
    </div>
</template>

<script>
    let _ = require('lodash');

    const COLUMNS = [
        {
            title: 'Type',
            dataIndex: 'type',
            scopedSlots: {
                customRender: 'type'
            }
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            scopedSlots: {
                customRender: 'brand'
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            scopedSlots: {
                customRender: 'name'
            }
        },
        {
            title: 'Product Code',
            dataIndex: 'product_code',
            scopedSlots: {
                customRender: 'product-code'
            }
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            scopedSlots: {
                customRender: 'amount'
            }
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            scopedSlots: {customRender: 'actions'},
        },
    ];

    const TYPE_OPTIONS = [
        {
            value: 'ink',
            label: 'Ink'
        },
        {
            value: 'toner',
            label: 'Toner'
        }
    ];

    const BRAND_OPTIONS = [
        {
            value: 'brand-1',
            label: 'Brand 1'
        },
        {
            value: 'brand-2',
            label: 'Brand 2'
        }
    ];

    export default {
        name: "ChemicalEditor",
        props: ['chemicals'],
        data() {
            return {
                columns: COLUMNS,
                typeOptions: TYPE_OPTIONS,
                brandOptions: BRAND_OPTIONS,
                editingKey: '',
                localChemicals: null,
                cacheData: null
            }
        },
        created() {
            this.localChemicals = (this.chemicals && this.chemicals.length) ? {...this.chemicals} : []
            this.cacheData = this.localChemicals.map(item => ({...item}));
        },
        watch: {
            localChemicals(newChemicalData) {
                this.$emit('chemicals-updated', newChemicalData);
            }
        },
        methods: {
            handleChange(value, key, column) {
                const newChemicals = [...this.localChemicals];
                const target = newChemicals.filter(item => key === item.key)[0];
                if (target) {
                    target[column] = value;
                    this.localChemicals = newChemicals;
                }
            },

            edit(key) {
                const newChemicals = [...this.localChemicals];
                const target = newChemicals.filter(item => key === item.key)[0];
                this.editingKey = key;
                if (target) {
                    target.editable = true;
                    this.localChemicals = newChemicals;
                }
            },

            save(key) {
                const newChemicals = [...this.localChemicals];
                const newCacheData = [...this.cacheData];
                const target = newChemicals.filter(item => key === item.key)[0];
                const targetCache = newCacheData.filter(item => key === item.key)[0];
                if (target && targetCache) {
                    delete target.editable;
                    this.localChemicals = newChemicals;
                    Object.assign(targetCache, target);
                    this.cacheData = newCacheData;
                }
                this.editingKey = '';
            },

            cancel(key) {
                const newChemicals = [...this.localChemicals];
                const target = newChemicals.filter(item => key === item.key)[0];
                this.editingKey = '';
                if (target) {
                    Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
                    delete target.editable;
                    this.localChemicals = newChemicals;
                }
            },

            deleteRow(key) {
                this.localChemicals = this.localChemicals.filter(item => key !== item.key);
            },

            addChemical() {
                let newKey = (this.localChemicals && this.localChemicals.length) ? (this.localChemicals.length) : 0;
                let newChemical = {
                    key: newKey
                };

                this.localChemicals.push(newChemical);
                this.cacheData.push(newChemical);

                this.edit(newKey);
            },

            getTypeLabel(value) {
                let r = _.find(this.typeOptions, {value: value});
                return r ? r.label : value;
            },

            getBrandLabel(value) {
                let r = _.find(this.brandOptions, {value: value});
                return r ? r.label : value;
            }
        }
    }
</script>

<style scoped>
    .bottom-actions {
        margin-top: 20px;
    }

    .editable-row-actions a {
        margin-right: 8px;
    }
</style>
