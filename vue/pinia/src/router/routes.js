import Home from "@/views/HomeView.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
];

export default routes;
