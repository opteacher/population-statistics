import home from "./pages/home.vue"

export default [{
    path: "/",
    redirect: "/population-statistics/home"
}, {
    path: "/population-statistics/home",
    component: home
}]