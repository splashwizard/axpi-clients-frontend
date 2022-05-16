import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import store from "../store";
import ForgotPassword from "../views/ForgotPassword";
import ResetPassword from "../views/ResetPassword";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/forgot-password",
    name: "Forgot Password",
    component: ForgotPassword,
  },
  {
    path: "/reset-password",
    name: "Reset Password",
    component: ResetPassword,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      auth: true,
    },
  },
  {
    path: "/roche",
    name: "Roche",
    component: () => import(/* webpackChunkName: "roche" */ "../views/Roche.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/suppliers",
    name: "Suppliers",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "suppliers" */ "../views/Suppliers.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/suppliers/:id",
    name: "View Supplier",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "view-supplier" */ "../views/Suppliers/Show.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/goals",
    name: "goals",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "suppliers" */ "../views/Goals.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/optimisations",
    name: "Optimisations",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "optimisations" */ "../views/Optimisations.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/optimisations/:id",
    name: "Optimisation",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "optimisation" */ "../views/Optimisations/Show.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/optimisations/:optimisationId/specifications/:id",
    name: "Optimisation Specification Details",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "optimisation" */ "../views/Optimisations/Specifications/Show.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/optimisations/:id/analytics",
    name: "Optimisation Analytics",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "optimisation" */ "../views/Optimisations/Analytics.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/optimisations/:id/scenarios",
    name: "Optimisation Scenarios",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "optimisation" */ "../views/Optimisations/Scenarios.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/optimisations/:id/scenarios/:scenarioId/review",
    name: "Optimisation Scenario Review",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "optimisation" */ "../views/Optimisations/Review.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/orders",
    name: "Orders",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "orders" */ "../views/Orders.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/orders/:id",
    name: "View Order",
    component: () => import(/* webpackChunkName: "orders" */ "../views/Orders/Show.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/specifications",
    name: "Specifications",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "specifications" */ "../views/Specifications.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/matcher",
    name: "Matcher",
    component: () => import(/* webpackChunkName: "matcher" */ "../views/Matcher.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/intelligence",
    name: "Intelligence",
    component: () => import(/* webpackChunkName: "intelligence" */ "../views/Intelligence.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/intelligence/clusters",
    name: "Clusters",
    component: () => import(/* webpackChunkName: "clusters" */ "../views/Intelligence/Clusters/Index.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/intelligence/clusters/:id",
    name: "View Cluster",
    component: () => import(/* webpackChunkName: "view-cluster" */ "../views/Intelligence/Clusters/Show.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/store",
    name: "Stores",
    component: () => import(/* webpackChunkName: "view-product" */ "../views/Store/Store.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/products/index",
    name: "Products",
    component: () => import(/* webpackChunkName: "view-product" */ "../views/Products/Products.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/products/category",
    name: "Product Category",
    component: () => import(/* webpackChunkName: "view-product" */ "../views/Products/Categories.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/products/attribute",
    name: "Product Attribute",
    component: () => import(/* webpackChunkName: "view-product" */ "../views/Products/Attributes.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/products/:id",
    name: "View Product",
    component: () => import(/* webpackChunkName: "view-product" */ "../views/Products/Show.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/developers",
    name: "Developers",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "reports" */ "../views/Developers.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/reports",
    name: "Reports",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "reports" */ "../views/Reports.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/reports/:id",
    name: "Report",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "report-show" */ "../views/Reports/Show.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/analytics",
    name: "Analytics",
    component: () => import(/* webpackChunkName: "analytics" */ "../views/Analytics.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/account",
    name: "Account",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "account" */ "../views/Account.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/shop",
    name: "Shop",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "shop" */ "../views/Shop.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/shop/landing",
    name: "Shop Landing",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "shop-landing" */ "../views/Shop/Landing.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/search/analytics",
    name: "Search Analytics",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "view-project" */ "../views/Search/Analytics.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/search/rules",
    name: "Search Rules",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "view-project" */ "../views/Search/Rules.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/search/rules/visual-editor/new",
    name: "Visual Editor",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "view-project" */ "../views/Search/Rules/VisualEditor.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/search/rules/visual-editor/edit/:id",
    name: "Edit Visual Editor",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "view-project" */ "../views/Search/Rules/EditVisualEditor.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/shop/basket",
    name: "Basket",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "basket" */ "../views/Shop/Basket.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/shop/lists",
    name: "Lists",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "basket" */ "../views/Shop/Lists.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/shop/lists/view/:id",
    name: "ViewList",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "basket" */ "../views/Shop/ViewList.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/projects",
    name: "Projects",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "projects" */ "../views/Projects/Index.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/projects/:id",
    name: "View Project",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "view-project" */ "../views/Projects/Show.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/projects/:id/team",
    name: "Project Team",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "view-project-team" */ "../views/Projects/Team.vue"),
    meta: {
      auth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// Wait for Vuex Persist to do it's thing
const waitForStorageToBeReady = async (to, from, next) => {
  await store.restored;
  next();
};
router.beforeEach(waitForStorageToBeReady);

// Auth Guard
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.auth)) {
    if (store.getters["auth/loggedIn"]) {
      next();
      return;
    }
    next("/login?to=" + to.path);
  } else {
    next();
  }
});

export default router;
