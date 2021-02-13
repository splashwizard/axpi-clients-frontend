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
                    <!--                    <router-link to="/">-->
                    <!--                        <img src="/img/axiom.png" alt="">-->
                    <!--                    </router-link>-->
                    <div class="logo-circle">
                        <img src="/img/icons/axiom-icon.png" alt="">
                    </div>
                    <span>
                        {{ user.client.name }}
                    </span>
                </div>
                <a-menu
                        @click="handleMenuItemClicked"
                        :selected-keys="[selectedMenuKey]"
                        mode="inline"
                        theme="light"
                >
                    <a-menu-item key="" class="menu-space-below">
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
                        <goals-icon class="nav-icon"></goals-icon>
                        Goals
                    </a-menu-item>
                    <a-menu-item key="optimisation">
                        <optimise-icon class="nav-icon"></optimise-icon>
                        Optimisation
                    </a-menu-item>
                    <a-menu-item key="analytics">
                        <analytics-icon class="nav-icon"></analytics-icon>
                        Analytics
                    </a-menu-item>
                    <a-menu-item key="reports" class="menu-space-below">
                        <reports-icon class="nav-icon"></reports-icon>
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
                        <developers-icon class="nav-icon"></developers-icon>
                        Developers
                    </a-menu-item>
                    <a-menu-item key="account">
                        <account-icon class="nav-icon"></account-icon>
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
                                <a-button class="feedback-icon">
                                    <div>
                                        <feedback-icon></feedback-icon>
                                        <span>Feedback?</span>
                                    </div>
                                </a-button>
                                <a-button>
                                    <div>
                                        <bell-icon></bell-icon>
                                    </div>
                                </a-button>
                                <a-button>
                                    <div>
                                        <question-mark-icon></question-mark-icon>
                                    </div>
                                </a-button>
                                <a-popover title="Account" trigger="click" placement="bottomRight">
                                    <div slot="content">
                                        <div v-if="user.client" class="company-property">
                                            {{ user.client.name }}
                                        </div>
                                        <a @click="logout">Logout</a>
                                    </div>
                                    <a-button>
                                        <div>
                                            <user-icon></user-icon>
                                        </div>
                                    </a-button>
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
    import GoalsIcon from "./components/Icons/GoalsIcon";
    import OptimiseIcon from "./components/Icons/OptimiseIcon";
    import AnalyticsIcon from "./components/Icons/AnalyticsIcon";
    import ReportsIcon from "./components/Icons/ReportsIcon";
    import DevelopersIcon from "./components/Icons/DevelopersIcon";
    import AccountIcon from "./components/Icons/AccountIcon";
    import UserIcon from "./components/Icons/UserIcon";
    import QuestionMarkIcon from "./components/Icons/QuestionMarkIcon";
    import BellIcon from "./components/Icons/BellIcon";
    import FeedbackIcon from "./components/Icons/FeedbackIcon";

    export default {
        components: {
            HomeIcon,
            OrdersIcon,
            SuppliersIcon,
            GoalsIcon,
            OptimiseIcon,
            AnalyticsIcon,
            ReportsIcon,
            DevelopersIcon,
            AccountIcon,
            UserIcon,
            QuestionMarkIcon,
            BellIcon,
            FeedbackIcon
        },
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
        height: 57px !important;
        line-height: 57px !important;

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
                line-height: 60px;

                .ant-btn {
                    /*margin-left: 5px;*/
                    border: none;
                    box-shadow: none;
                    color: rgb(135, 146, 162);
                    padding-left: 8px;
                    padding-right: 8px;

                    div {
                        display: flex;
                        align-items: center;
                    }
                }

                .feedback-icon {
                    padding-left: 15px;
                    padding-right: 15px;

                    svg {
                        margin-right: 10px;
                    }
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
            align-items: center;
            display: flex;

            .logo-circle {
                background-color: #fff;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                text-align: center;
                box-shadow: 0 2px 5px 0 rgb(60 66 87 / 8%), 0 1px 1px 0 rgb(0 0 0 / 12%);
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                    width: 19px;
                    height: 19px;
                }
            }

            span {
                padding-left: 10px;
                font-size: 16px;
                color: #1a1f36;
            }
        }

        .nav-icon {
            margin-right: 15px;
        }

        .logo img {
            max-width: 140px;
        }

        .ant-menu li {
            display: flex;
            align-items: center;
        }

        .ant-menu, .ant-menu-submenu {
            border: 0;
            background: none !important;
        }

        .ant-menu-item {
            height: 23px !important;
            line-height: 23px !important;
        }

        .ant-menu-item.ant-menu-item-selected {
            background-color: unset !important;
            font-weight: 600;
            color: #3735B3;

            &:after {
                display: none;
            }
        }

        .menu-space-below {
            margin-bottom: 25px !important;
        }
    }
</style>
