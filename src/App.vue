<template>
    <div id="app">
        <a-layout id="components-layout-demo-responsive">
            <a-layout-sider
                    width="275"
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
                >
                    <a-menu-item key="1">
                        <a-icon type="mail"/>
                        Navigation One
                    </a-menu-item>
                    <a-menu-item key="2">
                        <a-icon type="calendar"/>
                        Navigation Two
                    </a-menu-item>
                    <a-sub-menu key="sub1">
                        <span slot="title"><a-icon type="appstore"/><span>Navigation Three</span></span>
                        <a-menu-item key="3">
                            Option 3
                        </a-menu-item>
                        <a-menu-item key="4">
                            Option 4
                        </a-menu-item>
                        <a-sub-menu key="sub1-2" title="Submenu">
                            <a-menu-item key="5">
                                Option 5
                            </a-menu-item>
                            <a-menu-item key="6">
                                Option 6
                            </a-menu-item>
                        </a-sub-menu>
                    </a-sub-menu>
                    <a-sub-menu key="sub2">
                        <span slot="title"><a-icon type="setting"/><span>Navigation Four</span></span>
                        <a-menu-item key="7">
                            Option 7
                        </a-menu-item>
                        <a-menu-item key="8">
                            Option 8
                        </a-menu-item>
                        <a-menu-item key="9">
                            Option 9
                        </a-menu-item>
                        <a-menu-item key="10">
                            Option 10
                        </a-menu-item>
                    </a-sub-menu>
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
                                <a-button icon="user"></a-button>
                            </div>
                        </div>
                    </div>
                </a-layout-header>
                <a-layout-content :style="{ padding: '30px', background: '#fff' }">
                    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
                        <router-view/>
                    </div>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </div>
</template>
<script>
    export default {
        methods: {
            onCollapse(collapsed, type) {
                console.log(collapsed, type);
            },
            onBreakpoint(broken) {
                console.log(broken);
            },
        }
    }
</script>
<style lang="scss">
    #app, .ant-layout {
        height: 100%;
    }

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

    .ant-layout-sider {
        .logo {
            text-align: left;
            padding-left: 20px;
            padding-top: 20px;
            padding-bottom: 20px;
        }

        .logo img {
            max-width: 130px;
        }

        .ant-menu, .ant-menu-submenu {
            border: 0;
            background: none !important;
        }
    }
</style>
