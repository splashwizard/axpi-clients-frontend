<template>
    <a-table class="axpi-table"
            :columns="columns"
            :row-key="record => record.id"
            :data-source="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
    >
        <template slot="country">
            United Kingdom
        </template>
        <template slot="rating">
            <a-rate :default-value="2" disabled/>
        </template>
        <template slot="last-order">
            10th February 2020
        </template>
    </a-table>
</template>
<script>
    import axios from 'axios';

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Country',
            dataIndex: 'country',
            sorter: true,
            scopedSlots: {
                customRender: 'country'
            }
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: true,
            scopedSlots: {
                customRender: 'rating'
            }
        },
        {
            title: 'Last Order',
            dataIndex: 'last_order',
            sorter: true,
            scopedSlots: {
                customRender: 'last-order'
            }
        }
    ];

    export default {
        data() {
            return {
                data: [],
                pagination: {},
                loading: false,
                columns,
            };
        },
        mounted() {
            this.fetch();
        },
        methods: {
            handleTableChange(pagination, filters, sorter) {
                const pager = {...this.pagination};
                pager.current = pagination.current;
                this.pagination = pager;
                this.fetch({
                    results_per_page: pagination.pageSize,
                    page: pagination.current,
                    sort_field: sorter.field,
                    sort_order: sorter.order,
                    ...filters,
                });
            },

            fetch(params = {}) {
                console.log('params:', params);
                this.loading = true;
                axios.post(window.API_BASE + '/suppliers/search', {
                    results_per_page: 10,
                    ...params
                }).then(r => {
                    const pagination = {...this.pagination};
                    // Read total count from server
                    pagination.total = r.data.total;
                    this.loading = false;
                    this.data = r.data.data;
                    this.pagination = pagination;
                }).catch(e => {
                    console.log(e);
                    this.$message.error('Error loading suppliers');
                });
            },
        },
    };
</script>
