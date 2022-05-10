<template>
  <div id="app">
    <template v-if="loggedIn">
      <ais-instant-search
        :search-client="searchClient"
        :stalled-search-delay="100"
        :index-name="collectionName"
        v-if="hasCollectionName"
      >
        <ais-configure :hits-per-page.camel="12" />

        <a-layout>
          <a-layout-header
            :style="{
              background: '#fff',
              padding: '0 20px',
              borderBottom: '1px solid #e3e8ee',
            }"
            v-if="hasHeader"
          >
            <div class="top-nav">
              <div class="logo">
                <!--                    <router-link to="/">-->
                <!--                        <img src="/img/axiom.png" alt="">-->
                <!--                    </router-link>-->
                <div class="logo-circle">
                  <img v-if="user.client.logo" :src="getImageSrc(user.client.logo)" alt="" />
                  <img v-else src="/img/axiom-tab-icon.svg" alt="" />
                </div>

                <div class="organisation-unit-selector">
                  <a-dropdown :trigger="['click']">
                    <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                      {{ selectedOrganisationalUnit ? selectedOrganisationalUnit.name : "Please select a unit" }}
                      <a-icon type="down" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item v-for="(unit, key) in organisationalUnits" :key="key">
                        <a href="#" @click.prevent="selectOrganisationalUnit(unit)">{{ unit.name }}</a>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </div>

                <!--            <span>-->
                <!--                        {{ user.client.name }}-->
                <!--                    </span>-->
                <!--            <a-icon class="org-group-selector-arrow" type="down"/>-->
              </div>

              <product-categories-menu />
              <div class="top-nav-search-bar" v-click-outside="unfocusSearch">
                <!--            <a-input ref="userNameInput" placeholder="Search..." size="large">-->
                <!--              <a-icon slot="prefix" type="search"/>-->
                <!--            </a-input>-->
                <!--              <a-input-search placeholder="Search products..." style="width: 200px" @search="onSearch"/>-->

                <!-- eCom search bar -->
                <div class="search-bar-inner" v-if="$route.path !== '/analytics'">
                  <ais-search-box placeholder="">
                    <template v-slot="{ currentRefinement, refine }">
                      <a-input-search
                        :value="currentRefinement"
                        @focus="searchBarFocussed = true"
                        @pressEnter="$router.push('/shop')"
                        @search="$router.push('/shop')"
                        @input="refine($event.currentTarget.value)"
                        placeholder="Search products..."
                        style="width: 200px"
                      />
                      <!-- <span :hidden="!isSearchStalled">Loading...</span> -->
                    </template>
                  </ais-search-box>

                  <add-spec-to-basket-button-and-modal></add-spec-to-basket-button-and-modal>
                </div>
                <!-- / eCom search bar -->

                <!-- Amazon Q -->
                <div class="search-bar-inner" v-if="$route.path === '/analytics'">
                  <quicksight-q-bar></quicksight-q-bar>
                </div>
                <!-- / Amazon Q -->

                <div class="searchResults" v-if="shouldShowSearchResults">
                  <ais-hits>
                    <template slot="item" slot-scope="{ item }">
                      <li @click.prevent="() => handleSearchItemSelected(item)" class="ant-list-item">
                        <div class="ant-list-item-meta">
                          <div class="ant-list-item-meta-avatar">
                            <span class="ant-avatar ant-avatar-circle ant-avatar-image">
                              <img :src="getOrderImageSrc(item)" @error="onImgErr" />
                            </span>
                          </div>
                          <div class="ant-list-item-meta-content">
                            <h4 class="ant-list-item-meta-title" v-html="item.name" />
                          </div>
                        </div>
                      </li>
                    </template>
                  </ais-hits>
                </div>
              </div>

              <div class="top-nav-links">
                <div id="nav">
                  <feedback-popup></feedback-popup>
                  <a-popover title="Account" trigger="click" placement="bottomRight" v-model="userPopoverVisible">
                    <div slot="content">
                      <div class="popover-inner">
                        <div v-if="user.client" class="company-property">
                          {{ user.client.name }}
                        </div>
                        <div class="popover-menu">
                          <div>
                            <a @click="navigateToAccount">Account</a>
                          </div>
                          <div>
                            <a @click="navigateToDevelopers">Developers</a>
                          </div>
                          <div>
                            <a @click="navigateToSpecifications">Specifications</a>
                          </div>
                          <div>
                            <a href="#">Documentation</a>
                          </div>
                          <div>
                            <a href="https://enhanceable.stoplight.io/docs/axiom/YXBpOjE3NDg1NjY1-axiom-core"
                              >API Docs</a
                            >
                          </div>
                          <div>
                            <a @click="logout">Logout</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <a-button>
                      <div>
                        <user-icon></user-icon>
                      </div>
                    </a-button>
                    <!--                                    <a-button icon="user">{{ user.name }}</a-button>-->
                  </a-popover>
                  <a-button>
                    <router-link to="/shop/basket">
                      <a-badge :count="basketCount">
                        <a-icon :style="{ fontSize: '18px' }" type="shopping" theme="filled"></a-icon>
                      </a-badge>
                    </router-link>
                  </a-button>
                  <a-button>
                    <router-link to="/shop/lists">
                      <a-icon :style="{ fontSize: '18px' }" type="profile" theme="filled"></a-icon>
                    </router-link>
                  </a-button>
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
              :collapsed="true"
              :style="{ background: '#f7fafc', borderRight: '1px solid #e3e8ee' }"
              v-if="hasSider"
            >
              <a-menu
                @click="handleMenuItemClicked"
                :selected-keys="[selectedMenuKey]"
                mode="inline"
                theme="light"
                :class="{ 'menu-collapsed': menuCollapsed }"
              >
                <a-menu-item title="Home" key="" class="menu-space-below">
                  <home-icon class="nav-icon"></home-icon>
                  <span v-if="!menuCollapsed">Home</span>
                </a-menu-item>
                <a-menu-item title="Orders" key="matcher">
                  <orders-icon class="nav-icon"></orders-icon>
                  <span v-if="!menuCollapsed">Past Orders</span>
                </a-menu-item>
                <!-- <a-menu-item title="Stores" key="store">
                  <a-icon :style="{ fontSize: '17px', marginLeft: '1px', marginRight: '17px' }" type="shop" theme="filled"></a-icon>
                  <span v-if="!menuCollapsed">Store</span>
                </a-menu-item>
                <a-menu-item title="Products" key="products/index">
                  <a-icon :style="{ fontSize: '17px', marginLeft: '1px', marginRight: '17px' }" type="shopping-cart"></a-icon>
                  <span v-if="!menuCollapsed">Product</span>
                </a-menu-item> -->
                <!--            <a-menu-item title="Specifications" key="specifications">-->
                <!--              <a-icon :style="{ fontSize: '17px', marginLeft: '1px', marginRight: '17px' }" type="save"-->
                <!--                      theme="filled"></a-icon>-->
                <!--              <span v-if="!menuCollapsed">Specifications</span>-->
                <!--            </a-menu-item>-->
                <!-- <a-menu-item title="Projects" key="projects">
                  <a-icon :style="{ fontSize: '17px', marginLeft: '1px', marginRight: '17px' }" type="carry-out"
                          theme="filled"></a-icon>
                  <span v-if="!menuCollapsed">Projects</span>
                </a-menu-item> -->
                <!--              <a-menu-item title="Matcher" key="matcher">-->
                <!--                <a-icon :style="{ fontSize: '17px', marginLeft: '1px', marginRight: '17px' }" type="pushpin"-->
                <!--                        theme="filled"></a-icon>-->
                <!--                <span v-if="!menuCollapsed">Matcher</span>-->
                <!--              </a-menu-item>-->
                <a-menu-item title="Insights" key="intelligence">
                  <a-icon
                    :style="{
                      fontSize: '17px',
                      marginLeft: '1px',
                      marginRight: '17px',
                    }"
                    type="bulb"
                    theme="filled"
                  ></a-icon>
                  <span v-if="!menuCollapsed">Insights</span>
                </a-menu-item>
                <a-menu-item title="Suppliers" key="suppliers">
                  <suppliers-icon class="nav-icon"></suppliers-icon>
                  <span v-if="!menuCollapsed">Suppliers</span>
                </a-menu-item>
                <!-- <a-menu-item title="Strategy" key="goals">
                  <goals-icon class="nav-icon"></goals-icon>
                  <span v-if="!menuCollapsed">Strategy</span>
                </a-menu-item> -->
                <!--            <a-menu-item title="Optimisations" key="optimisations">-->
                <!--              <optimise-icon class="nav-icon"></optimise-icon>-->
                <!--              <span v-if="!menuCollapsed">Optimisations</span>-->
                <!--            </a-menu-item>-->
                <a-menu-item title="Analytics" key="analytics">
                  <analytics-icon class="nav-icon"></analytics-icon>
                  <span v-if="!menuCollapsed">Analytics</span>
                </a-menu-item>
                <!--            <a-menu-item title="Reports" key="reports" class="menu-space-below">-->
                <!--              <reports-icon class="nav-icon"></reports-icon>-->
                <!--              <span v-if="!menuCollapsed">Reports</span>-->
                <!--            </a-menu-item>-->
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
                <a-menu-item key="shop/landing" title="Shop">
                  <a-icon
                    :style="{
                      fontSize: '17px',
                      marginLeft: '1px',
                      marginRight: '17px',
                    }"
                    type="shopping-cart"
                  ></a-icon>
                  <span v-if="!menuCollapsed">Shop</span>
                </a-menu-item>
                <a-menu-item title="Search" key="search/analytics">
                  <a-icon
                    :style="{
                      fontSize: '17px',
                      marginLeft: '1px',
                      marginRight: '17px',
                    }"
                    type="search"
                  ></a-icon>
                  <span v-if="!menuCollapsed">Search</span>
                </a-menu-item>
                <!--            <a-menu-item key="developers" title="Developers">-->
                <!--              <developers-icon class="nav-icon"></developers-icon>-->
                <!--              <span v-if="!menuCollapsed">Developers</span>-->
                <!--            </a-menu-item>-->
                <!--            <a-menu-item key="account" title="Account">-->
                <!--              <account-icon class="nav-icon"></account-icon>-->
                <!--              <span v-if="!menuCollapsed">Account</span>-->
                <!--            </a-menu-item>-->
              </a-menu>
            </a-layout-sider>
            <a-layout>
              <a-layout-content
                :style="{
                  padding: noPadding ? 0 : '20px 30px',
                  background: '#fff',
                  height: '100%',
                }"
              >
                <router-view />
              </a-layout-content>
            </a-layout>
          </a-layout>
        </a-layout>
      </ais-instant-search>
    </template>
    <router-view v-else />
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import HomeIcon from "./components/Icons/HomeIcon";
import OrdersIcon from "./components/Icons/OrdersIcon";
import SuppliersIcon from "./components/Icons/SuppliersIcon";
// import GoalsIcon from "./components/Icons/GoalsIcon";
// import OptimiseIcon from "./components/Icons/OptimiseIcon";
import AnalyticsIcon from "./components/Icons/AnalyticsIcon";
// import ReportsIcon from "./components/Icons/ReportsIcon";
// import DevelopersIcon from "./components/Icons/DevelopersIcon";
// import AccountIcon from "./components/Icons/AccountIcon";
import UserIcon from "./components/Icons/UserIcon";
// import QuestionMarkIcon from "./components/Icons/QuestionMarkIcon";
// import BellIcon from "./components/Icons/BellIcon";
import FeedbackPopup from "./components/FeedbackPopup";
import ProductCategoriesMenu from "./components/ProductCategories/ProductCategoriesMenu";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import ClickOutside from "vue-click-outside";
import AddSpecToBasketButtonAndModal from "./views/Shop/AddSpecToBasketButtonAndModal";
import QuicksightQBar from "./components/QuicksightQBar";
import Images from "./mixins/Images";
import client from "@/api/client";

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "4Q7Xr61bB4jUyDpS7ER5TpybRm5uC74s", // Be sure to use an API key that only allows searches, in production
    nodes: [
      {
        host: "jcmib1wyvr5en7xap-1.a1.typesense.net",
        port: "443",
        protocol: "https",
      },
    ],
  },
  additionalSearchParameters: {
    query_by: "name,description",
    group_by: "product_identifier",
    group_limit: 1,
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

export default {
  components: {
    QuicksightQBar,
    HomeIcon,
    OrdersIcon,
    SuppliersIcon,
    // GoalsIcon,
    // OptimiseIcon,
    AnalyticsIcon,
    // ReportsIcon,
    UserIcon,
    // QuestionMarkIcon,
    FeedbackPopup,
    ProductCategoriesMenu,
    AddSpecToBasketButtonAndModal,
  },
  mixins: [Images],
  data() {
    return {
      selectedMenuKey: this.$router.currentRoute.path.split("/")[1],
      userPopoverVisible: false,
      settingsPopoverVisible: false,
      searchClient,
      searchBarFocussed: false,
      menuCollapsed: true,
      collectionName: "",
    };
  },
  created() {
    this.getCollections();
  },
  mounted() {
    this.selectedMenuKey = this.$router.currentRoute.path.split("/")[1];
  },
  watch: {
    $route(to) {
      this.selectedMenuKey = to.path.split("/")[1];
    },

    loggedIn(val) {
      if (val) {
        this.getCollections();
      }
    },
  },
  directives: {
    ClickOutside,
  },
  methods: {
    ...mapActions("auth", {
      logout: "logout",
      selectOrganisationalUnit: "selectOrganisationalUnit",
    }),
    handleSearchItemSelected(product) {
      this.searchBarFocussed = false;
      this.navigateToProduct(product);
    },
    unfocusSearch() {
      if (this.searchBarFocussed) {
        this.searchBarFocussed = false;
      }
    },
    onCollapse(collapsed, type) {
      console.log(collapsed, type);
    },
    navigateToProduct(product) {
      this.$router.push(this.getProductPageUrl(product));
    },
    getProductPageUrl(product) {
      return "/products/" + product["id"] + "?fromShop=1";
    },
    onBreakpoint(broken) {
      console.log(broken);
    },
    handleMenuItemClicked(e) {
      let navigateTo = e.key;
      this.$router.push("/" + navigateTo);
    },
    navigateToAccount() {
      this.$router.push("/account");
      this.userPopoverVisible = false;
    },
    navigateToDevelopers() {
      this.$router.push("/developers");
      this.userPopoverVisible = false;
    },
    navigateToSpecifications() {
      this.$router.push("/specifications");
      this.settingsPopoverVisible = false;
    },

    // to get image src for items in the search results list
    getOrderImageSrc(order) {
      if (order.image_urls && order.image_urls.length) {
        return order.image_urls[0];
      }
      return "/img/product_placeholder.png";
    },

    // to get collections
    async getCollections() {
      if (!this.loggedIn) {
        return;
      }

      try {
        const res = (await client.get("/get-collections")).data;
        if (res.message === "Success!") {
          const {
            collections: { collection_name },
          } = res.data;

          if (collection_name) {
            this.collectionName = collection_name;
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error(err);
        }
      }
    },

    // handle image load error
    onImgErr(e) {
      e.target.src = "/img/product_placeholder.png";
    },
  },
  computed: {
    ...mapGetters("auth", {
      loggedIn: "loggedIn",
      user: "user",
      selectedOrganisationalUnit: "selectedOrganisationalUnit",
      organisationalUnits: "organisationalUnits",
    }),

    ...mapGetters("shop", {
      basket: "basket",
    }),

    shouldShowSearchResults() {
      // return true;
      return this.$route.name !== "Shop" && this.searchBarFocussed;
    },

    hasHeader() {
      return !["Visual Editor", "Edit Visual Editor"].includes(this.$route.name);
    },

    hasSider() {
      return !["Visual Editor", "Edit Visual Editor"].includes(this.$route.name);
    },

    noPadding() {
      return [
        "View Project",
        "Project Team",
        "Optimisation Analytics",
        "Optimisation Scenarios",
        "Optimisation Scenario Review",
        "Optimisation Specification Details",
        "Matcher",
        "View Cluster",
        "View Product",
        "Shop",
        "Basket",
        "Lists",
        "Analytics",
        "Shop Landing",
        "Search Analytics",
        "Search Rules",
        "Visual Editor",
        "Edit Visual Editor",
        "Products",
        "Product Category",
        "Product Attribute",
      ].includes(this.$route.name);
    },

    // menuCollapsed() {
    //   // return ['View Project', 'Project Team', 'Optimisation Analytics', 'Optimisation Scenarios', 'Optimisation Scenario Review', 'Optimisation Specification Details', 'Matcher', 'View Cluster', 'View Product', 'Shop', 'Basket'].includes(this.$route.name);
    //   return true;
    // },

    basketCount() {
      return this.basket.length;
    },

    selectedSuppliers() {
      return false;
    },

    hasCollectionName() {
      return this.collectionName !== "";
    },
  },
};
</script>
<style lang="scss">
#app,
.ant-layout {
  height: 100%;
  background: #fff !important;
}

.ais-InstantSearch {
  height: 100%;
}

.ant-layout-header {
  height: 57px !important;
  line-height: 57px !important;

  .top-nav {
    display: flex;

    @media screen and (min-width: 1200px) {
      .logo {
        min-width: 300px;
        width: 300px;
        max-width: 300px;
      }

      .top-nav-links {
        min-width: 300px;
        width: 300px;
        max-width: 300px;
      }
    }

    .top-nav-search-bar {
      padding-left: 15px;
      padding-right: 35px;
      position: relative;

      flex-grow: 1;

      .search-bar-inner {
        display: flex;

        .ais-SearchBox {
          flex-grow: 1;
          padding-right: 10px;
        }

        .add-spec-to-basket-button-and-modal {
          flex-shrink: 1;

          .add-spec-btn {
            border-radius: 31px;
            width: 50px;
          }
        }
      }

      .ant-input-search,
      input {
        width: 100% !important;
        border-radius: 30px;
      }

      //input {
      //  border: 0;
      //  font-size: 15px;
      //
      //  &:hover, &:focus {
      //    box-shadow: none;
      //  }
      //}
    }

    .top-nav-links {
      flex-shrink: 1;
      line-height: 60px;
      text-align: right;

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
  height: 57px;
  //flex: 1;
  flex-shrink: 1;
  text-align: left;
  //padding-left: 20px;
  //padding-top: 16px;
  //padding-bottom: 30px;
  //padding-right: 170px;
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

  .ant-menu,
  .ant-menu-submenu {
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

  // .menu-space-below {
  //   margin-bottom: 25px !important;
  // }

  &.ant-layout-sider-collapsed {
    .menu-space-below {
      margin-bottom: 15px !important;
    }
  }
}

.organisation-unit-selector {
  padding-left: 15px;

  .ant-dropdown-trigger {
    color: rgba(0, 0, 0, 0.85);
  }

  .ant-dropdown-link {
    font-size: 17px;
  }
}

.popover-menu {
  div {
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.searchResults {
  position: absolute;
  top: 56x;
  left: 35px;
  right: 35px;
  //width: 100%;
  z-index: 9000;

  .ais-Hits-item {
    padding-top: 3px;
    padding-bottom: 3px;

    &:hover {
      background: rgb(247, 250, 252);
    }

    a:hover {
      color: rgba(0, 0, 0, 0.65) !important;
    }

    .ant-list-item {
      width: 100%;
      cursor: pointer;
    }
  }

  .ant-list-item-meta-title {
    margin-bottom: 0;
    line-height: 30px;
  }
}
</style>
