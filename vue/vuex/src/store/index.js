import { createStore, createLogger } from "vuex";
import VuexPersistence from "vuex-persist";
import localForage from "localforage";

const debug = process.env.NODE_ENV
  ? process.env.NODE_ENV !== "production"
  : import.meta.env.MODE !== "production";

const vuexLocal = new VuexPersistence({
  key: "template_vuex",
  storage: localForage,
});

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  strict: debug,
  plugins: debug ? [createLogger(), vuexLocal.plugin] : [vuexLocal.plugin],
});