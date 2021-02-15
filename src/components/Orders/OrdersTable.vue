<template>
    <a-table
            :columns="columns"
            :row-key="record => record.id"
            :data-source="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
    >
        <a href="#" slot="name" slot-scope="name, record" @click.prevent="handleRecordSelected(record)">{{ name }}</a>
    </a-table>
</template>
<script>
    import axios from 'axios';

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            scopedSlots: {customRender: 'name'}
        },
        {
            title: 'Type',
            dataIndex: 'product_type',
            sorter: true,
        },
        {
            title: 'Cost',
            dataIndex: 'cost',
            sorter: true,
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier.name',
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: true
        },
        {
            title: 'Order Date',
            dataIndex: 'order_date',
            sorter: true,
        },
        {
            title: 'Last Updated',
            dataIndex: 'updated_at',
            sorter: true,
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
                this.loading = true;
                axios.post(window.API_BASE + '/orders/search', {
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
                    this.$message.error('Error loading orders');
                });
            },

            handleRecordSelected(order) {
                this.$emit('selected', order);
            }

            // getInformationRequestUrl(informationRequest) {
            //    return '/information-requests/' + informationRequest.id + '/edit';
            // }
        },
    };
</script>
