import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import store from "../store";

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            auth: true
        }
    },
    {
        path: '/suppliers',
        name: 'Suppliers',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "suppliers" */ '../views/Suppliers.vue')
    },
    {
        path: '/goals',
        name: 'goals',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "suppliers" */ '../views/Goals.vue')
    },
    {
        path: '/optimisations',
        name: 'Optimisations',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "optimisations" */ '../views/Optimisations.vue')
    },
    {
        path: '/optimisations/:id',
        name: 'Optimisation',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "optimisation" */ '../views/Optimisations/Show.vue')
    },
    {
        path: '/optimisations/:optimisationId/specifications/:id',
        name: 'Optimisation Specification Details',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "optimisation" */ '../views/Optimisations/Specifications/Show.vue')
    },
    {
        path: '/optimisations/:id/analytics',
        name: 'Optimisation Analytics',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "optimisation" */ '../views/Optimisations/Analytics.vue')
    },
    {
        path: '/optimisations/:id/scenarios',
        name: 'Optimisation Scenarios',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "optimisation" */ '../views/Optimisations/Scenarios.vue')
    },
    {
        path: '/optimisations/:id/scenarios/:scenarioId/review',
        name: 'Optimisation Scenario Review',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "optimisation" */ '../views/Optimisations/Review.vue')
    },
    {
        path: '/orders',
        name: 'Orders',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "orders" */ '../views/Orders.vue')
    },
    {
        path: '/orders/:id',
        name: 'View Order',
        component: () => import(/* webpackChunkName: "orders" */ '../views/Orders/Show.vue')
    },
    {
        path: '/specifications',
        name: 'Specifications',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "orders" */ '../views/Specifications.vue')
    },
    {
        path: '/developers',
        name: 'Developers',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "reports" */ '../views/Developers.vue')
    },
    {
        path: '/reports',
        name: 'Reports',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "reports" */ '../views/Reports.vue')
    },
    {
        path: '/reports/:id',
        name: 'Report',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "report-show" */ '../views/Reports/Show.vue')
    },
    {
        path: '/analytics',
        name: 'Analytics',
        component: () => import(/* webpackChunkName: "analytics" */ '../views/Analytics.vue')
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// Wait for Vuex Persist to do it's thing
const waitForStorageToBeReady = async (to, from, next) => {
    await store.restored
    next()
}
router.beforeEach(waitForStorageToBeReady)

// Auth Guard
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.auth)) {
        if (store.getters['auth/loggedIn']) {
            next()
            return
        }
        next('/login?to=' + to.path)
    } else {
        next()
    }
})

export default router
