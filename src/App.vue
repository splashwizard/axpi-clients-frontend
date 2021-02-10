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
                    <img src="/img/axiom.png" alt="">
                </div>
                <a-menu
                        :default-selected-keys="['1']"
                        :default-open-keys="['sub1']"
                        mode="inline"
                        theme="light"
                >
                    <a-menu-item key="home">
                        <a-icon type="home"/>
                        Home
                    </a-menu-item>
                    <a-menu-item key="orders">
                        <a-icon type="shopping-cart"/>
                        Orders
                    </a-menu-item>
                    <a-menu-item key="suppliers">
                        <a-icon type="bars"/>
                        Suppliers
                    </a-menu-item>
                    <a-menu-item key="goals">
                        <a-icon type="rise"/>
                        Goals
                    </a-menu-item>
                    <a-menu-item key="analytics">
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
                                    <a slot="content" @click="logout">Logout</a>
                                    <a-button icon="user">{{ user.name }}</a-button>
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

    export default {
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
                    margin-left: 5px;
                }
            }
        }
    }

    .ant-layout-sider {
        .logo {
            text-align: left;
            padding-left: 20px;
            padding-top: 30px;
            padding-bottom: 30px;
        }

        .logo img {
            max-width: 140px;
        }

        .ant-menu, .ant-menu-submenu {
            border: 0;
            background: none !important;
        }

        .ant-menu-item {
            height: 30px !important;
            line-height: 30px !important;
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
