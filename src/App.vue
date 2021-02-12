<template>
    <div id="app">
        <a-layout id="components-layout-demo-responsive" v-if="loggedIn">
            <a-layout-sider
                    width="250"
                    breakpoint="lg"
                    theme="dark"
                    collapsed-width="0"
                    @collapse="onCollapse"
                    @breakpoint="onBreakpoint"
                    :style="{ background: '#f7fafc', borderRight: '1px solid #e3e8ee' }"
            >
                <div class="logo">
                    <router-link to="/">
                        <img src="/img/axiom.png" alt="">
                    </router-link>
                </div>
                <a-menu
                        @click="handleMenuItemClicked"
                        :selected-keys="[selectedMenuKey]"
                        mode="inline"
                        theme="light"
                >
                    <a-menu-item key="">
                        <home-icon class="nav-icon"></home-icon>
                        Home
                    </a-menu-item>
                    <a-menu-item key="orders">
                        <orders-icon class="nav-icon"></orders-icon>
                        Orders
                    </a-menu-item>
                    <a-menu-item key="suppliers">
                        <suppliers-icon class="nav-icon"></suppliers-icon>
                        Suppliers
                    </a-menu-item>
                    <a-menu-item key="goals">
                        <a-icon type="rise"/>
                        Goals
                    </a-menu-item>
                    <a-menu-item key="optimisation">
                        <a-icon type="dashboard"/>
                        Optimisation
                    </a-menu-item>
                    <a-menu-item key="analytics">
                        <a-icon type="eye"/>
                        Analytics
                    </a-menu-item>
                    <a-menu-item key="reports">
                        <a-icon type="bar-chart"/>
                        Reports
                    </a-menu-item>
                    <!--                    <a-sub-menu key="sub1">-->
                    <!--                        <span slot="title"><a-icon type="appstore"/><span>Navigation Three</span></span>-->
                    <!--                        <a-menu-item key="3">-->
                    <!--                            Option 3-->
                    <!--                        </a-menu-item>-->
                    <!--                        <a-menu-item key="4">-->
                    <!--                            Option 4-->
                    <!--                        </a-menu-item>-->
                    <!--                        <a-sub-menu key="sub1-2" title="Submenu">-->
                    <!--                            <a-menu-item key="5">-->
                    <!--                                Option 5-->
                    <!--                            </a-menu-item>-->
                    <!--                            <a-menu-item key="6">-->
                    <!--                                Option 6-->
                    <!--                            </a-menu-item>-->
                    <!--                        </a-sub-menu>-->
                    <!--                    </a-sub-menu>-->
                    <!--                    <a-sub-menu key="sub2">-->
                    <!--                        <span slot="title"><a-icon type="chart"/><span>Reports</span></span>-->
                    <!--                        <a-menu-item key="7">-->
                    <!--                            Option 7-->
                    <!--                        </a-menu-item>-->
                    <!--                        <a-menu-item key="8">-->
                    <!--                            Option 8-->
                    <!--                        </a-menu-item>-->
                    <!--                        <a-menu-item key="9">-->
                    <!--                            Option 9-->
                    <!--                        </a-menu-item>-->
                    <!--                        <a-menu-item key="10">-->
                    <!--                            Option 10-->
                    <!--                        </a-menu-item>-->
                    <!--                    </a-sub-menu>-->
                    <a-menu-item key="developer">
                        <a-icon type="code"/>
                        Developers
                    </a-menu-item>
                    <a-menu-item key="account">
                        <a-icon type="user"/>
                        Account
                    </a-menu-item>
                </a-menu>
            </a-layout-sider>
            <a-layout>
                <a-layout-header :style="{ background: '#fff', padding: '0 30px', borderBottom: '1px solid #e3e8ee' }">
                    <div class="top-nav">
                        <div class="top-nav-search-bar">
                            <a-input ref="userNameInput" placeholder="Search..." size="large">
                                <a-icon slot="prefix" type="search"/>
                            </a-input>
                        </div>
                        <div class="top-nav-links">
                            <div id="nav">
                                <a-button icon="message">Feedback</a-button>
                                <a-button icon="bell"></a-button>
                                <a-button icon="question"></a-button>
                                <a-popover title="Account" trigger="click" placement="bottomRight">
                                    <div slot="content">
                                        <div v-if="user.client" class="company-property">
                                        {{ user.client.name }}
                                         </div>
                                        <a @click="logout">Logout</a>
                                    </div>
                                    <a-button icon="user"></a-button>
<!--                                    <a-button icon="user">{{ user.name }}</a-button>-->
                                </a-popover>
                            </div>
                        </div>
                    </div>
                </a-layout-header>
                <a-layout-content :style="{ padding: '30px', background: '#fff' }">
                    <router-view/>
                </a-layout-content>
            </a-layout>
        </a-layout>
        <router-view v-else/>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from "vuex";
    import HomeIcon from "./components/Icons/HomeIcon";
    import OrdersIcon from "./components/Icons/OrdersIcon";
    import SuppliersIcon from "./components/Icons/SuppliersIcon";

    export default {
        components: {HomeIcon, OrdersIcon, SuppliersIcon},
        data() {
            return {
                selectedMenuKey: this.$router.currentRoute.path.split("/")[1]
            }
        },
        mounted() {
            this.selectedMenuKey = this.$router.currentRoute.path.split("/")[1]
        },
        watch: {
            '$route'(to) {
                this.selectedMenuKey = to.path.split("/")[1]
            }
        },
        methods: {
            ...mapActions('auth', {
                logout: 'logout'
            }),
            onCollapse(collapsed, type) {
                console.log(collapsed, type);
            },
            onBreakpoint(broken) {
                console.log(broken);
            },
            handleMenuItemClicked(e) {
               let navigateTo = e.key;
               this.$router.push("/" + navigateTo);
            }
        },
        computed: {
            ...mapGetters('auth', {
                loggedIn: 'loggedIn',
                user: 'user'
            })
        }
    }
</script>
<style lang="scss">
    #app, .ant-layout {
        height: 100%;
    }

    .ant-layout-header {
        height: 60px !important;
        line-height: 60px !important;

        .top-nav {
            display: flex;

            .top-nav-search-bar {
                flex-grow: 1;

                input {
                    border: 0;
                    font-size: 15px;

                    &:hover, &:focus {
                        box-shadow: none;
                    }
                }
            }

            .top-nav-links {
                flex-shrink: 1;

                .ant-btn {
                    /*margin-left: 5px;*/
                    border: none;
                    box-shadow: none;
                    /*padding-left: 0;*/
                    /*padding-right: 0;*/
                }
            }
        }
    }

    .company-property {
        margin-bottom: 10px;
    }

    .ant-layout-sider {
        .logo {
            text-align: left;
            padding-left: 20px;
            padding-top: 16px;
            padding-bottom: 30px;
        }

        .nav-icon {
            margin-right: 10px;
        }

        .logo img {
            max-width: 140px;
        }

        .ant-menu, .ant-menu-submenu {
            border: 0;
            background: none !important;
        }

        .ant-menu-item {
            height: 24px !important;
            line-height: 24px !important;
        }

        .ant-menu-item.ant-menu-item-selected {
            background-color: unset !important;
            font-weight: 600;
            color: #3735B3;

            &:after {
                display: none;
            }
        }
    }
</style>
