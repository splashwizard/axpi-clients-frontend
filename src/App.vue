<template>
  <div id="app">
    <a-layout v-if="loggedIn">
      <a-layout-header :style="{ background: '#fff', padding: '0 20px', borderBottom: '1px solid #e3e8ee' }">
        <div class="top-nav">
          <div class="logo">
            <!--                    <router-link to="/">-->
            <!--                        <img src="/img/axiom.png" alt="">-->
            <!--                    </router-link>-->
            <div class="logo-circle">
              <img src="/img/axiom-tab-icon.svg" alt="">
            </div>
            <span>
                        {{ user.client.name }}
                    </span>
            <a-icon class="org-group-selector-arrow" type="down"/>
          </div>
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
              <a-popover title="Notifications" trigger="click" placement="bottomRight">
                <div slot="content">
                  <div>
                    No notifications
                  </div>
                </div>
                <a-button>
                  <div>
                    <bell-icon></bell-icon>
                  </div>
                </a-button>
              </a-popover>
              <a-popover title="Help" trigger="click" placement="bottomRight">
                <div slot="content">
                  <div>
                    <a href="#">Documentation</a>
                  </div>
                  <div>
                    <a href="#">API Docs</a>
                  </div>
                </div>
                <a-button>
                  <div>
                    <question-mark-icon></question-mark-icon>
                  </div>
                </a-button>
              </a-popover>
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
      <a-layout id="components-layout-demo-responsive">
        <a-layout-sider
            width="240"
            breakpoint="lg"
            theme="dark"
            :collapsed-width="70"
            :trigger="null"
            collapsible
            v-model="menuCollapsed"
            :style="{ background: '#f7fafc', borderRight: '1px solid #e3e8ee' }"
        >
          <a-menu
              @click="handleMenuItemClicked"
              :selected-keys="[selectedMenuKey]"
              mode="inline"
              theme="light"
              :class="{'menu-collapsed': menuCollapsed}"
          >
            <a-menu-item title="Home" key="" class="menu-space-below">
              <home-icon class="nav-icon"></home-icon>
              <span v-if="!menuCollapsed">Home</span>
            </a-menu-item>
            <a-menu-item title="Orders" key="orders">
              <orders-icon class="nav-icon"></orders-icon>
              <span v-if="!menuCollapsed">Past Orders</span>
            </a-menu-item>
            <a-menu-item title="Specifications" key="specifications">
              <a-icon :style="{ fontSize: '17px', marginLeft: '1px', marginRight: '17px' }" type="save" theme="filled"></a-icon>
              <span v-if="!menuCollapsed">Specifications</span>
            </a-menu-item>
            <a-menu-item title="Suppliers" key="suppliers">
              <suppliers-icon class="nav-icon"></suppliers-icon>
              <span v-if="!menuCollapsed">Suppliers</span>
            </a-menu-item>
            <a-menu-item title="Strategy" key="goals">
              <goals-icon class="nav-icon"></goals-icon>
              <span v-if="!menuCollapsed">Strategy</span>
            </a-menu-item>
            <a-menu-item title="Optimisations" key="optimisations">
              <optimise-icon class="nav-icon"></optimise-icon>
              <span v-if="!menuCollapsed">Optimisations</span>
            </a-menu-item>
            <a-menu-item title="Analytics" key="analytics">
              <analytics-icon class="nav-icon"></analytics-icon>
              <span v-if="!menuCollapsed">Analytics</span>
            </a-menu-item>
            <a-menu-item title="Reports" key="reports" class="menu-space-below">
              <reports-icon class="nav-icon"></reports-icon>
              <span v-if="!menuCollapsed">Reports</span>
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
            <a-menu-item key="developer" title="Developers">
              <developers-icon class="nav-icon"></developers-icon>
              <span v-if="!menuCollapsed">Developers</span>
            </a-menu-item>
            <a-menu-item key="account" title="Account">
              <account-icon class="nav-icon"></account-icon>
              <span v-if="!menuCollapsed">Account</span>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout>
          <a-layout-content :style="{ padding: (noPadding ? 0 : '20px 30px'), background: '#fff' }">
            <router-view/>
          </a-layout-content>
        </a-layout>
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
    }),

    noPadding() {
      return ['Optimisation Analytics', 'Optimisation Scenarios', 'Optimisation Scenario Review'].includes(this.$route.name);
    },

    menuCollapsed() {
      return ['Optimisation Analytics', 'Optimisation Scenarios', 'Optimisation Scenario Review'].includes(this.$route.name);
    }
  }
}
</script>
<style lang="scss">
#app, .ant-layout {
  height: 100%;
  background: #fff ! important;
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

.logo {
  text-align: left;
  //padding-left: 20px;
  //padding-top: 16px;
  //padding-bottom: 30px;
  padding-right: 170px;
  align-items: center;
  display: flex;

  .logo-circle {
    background-color: #fff;
    padding-left: 5px;
    //width: 35px;
    //height: 35px;
    //border-radius: 50%;
    text-align: center;
    //box-shadow: 0 2px 5px 0 rgb(60 66 87 / 8%), 0 1px 1px 0 rgb(0 0 0 / 12%);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 21px;
      height: 21px;
    }
  }

  span {
    padding-left: 10px;
    font-size: 18px;
    color: #1a1f36;
  }
}

.ant-layout-sider {

  .nav-icon {
    margin-right: 15px;
  }

  &.ant-layout-sider-collapsed {
    .nav-icon {
      margin-right: 0 !important;
    }
  }

  .logo img {
    max-width: 140px;
  }

  .ant-menu {
    padding-top: 15px;
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
    height: 27px !important;
    font-weight: 400;
    line-height: 27px !important;
    font-size: 15px !important;
    margin-bottom: 13px !important;
  }

  &.ant-layout-sider-collapsed {
    .ant-menu-item {
      padding-left: 24px !important;
      padding-right: 5px !important;
    }
  }

  .ant-menu-item.ant-menu-item-selected {
    background-color: unset !important;
    font-weight: 600;
    color: #5469d4;

    &:after {
      display: none;
    }
  }

  .ant-menu-item.submenu {
    padding-left: 55px !important;
  }

  .menu-space-below {
    //margin-bottom: 25px !important;
  }

  &.ant-layout-sider-collapsed {
    .menu-space-below {
      margin-bottom: 15px !important;
    }
  }
}

.org-group-selector-arrow {
  margin-left: 10px;
  font-size: 11px;
}
</style>
