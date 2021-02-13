<template>
    <div class="orders">

        <div class="page-header">
            <h1 class="page-title">Orders</h1>
            <div class="actions">
                <router-link to="/orders/create">
                    <a-button type="primary" icon="plus">Add Order</a-button>
                </router-link>
            </div>
        </div>

        <orders-table></orders-table>
    </div>
</template>

<script>
    import OrdersTable from "../components/Orders/OrdersTable";

    export default {
        name: 'Orders',
        computed: {},
        components: {OrdersTable},
        data() {
            return {}
        }
    }
</script>
