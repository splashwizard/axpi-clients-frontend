<template>
    <div>
        <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="All"></a-tab-pane>
            <a-tab-pane key="3" tab="Information Provided"></a-tab-pane>
            <a-tab-pane key="2" tab="Information Requested" force-render></a-tab-pane>
        </a-tabs>

        <a-table class="axpi-table"
                 :columns="columns"
                 :row-key="record => record.id"
                 :data-source="data"
                 :pagination="pagination"
                 :loading="loading"
                 @change="handleTableChange"
        >
            <a href="#" slot="name" slot-scope="name, record" @click.prevent="handleRecordSelected(record)">{{ name
                }}</a>
            <div slot="actions" class="table-actions">
                <a-dropdown :trigger="['click']">
                    <a-button type="link" icon="ellipsis" @click.prevent="e => e.preventDefault()"></a-button>
                    <a-menu slot="overlay">
                        <a-menu-item>
                            <a href="#">Edit</a>
                        </a-menu-item>
                        <a-menu-item>
                            <a href="#" class="text-danger">Delete</a>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </div>
        </a-table>
    </div>
</template>
<script>
    import axios from 'axios';

    const columns = [
        {
            title: 'Name',
            dataIndex: 'product_name',
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
        },
        {
            title: '',
            scopedSlots: {customRender: 'actions'},
            width: 10
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
