import Vue from "vue";
import Vuex from "vuex";
import apiUrl from "./modules/apiUrl"; //预约
Vue.use(Vuex);

export default new Vuex.Store({
	state: {},
	mutations: {},
	actions: {},
	modules: {
		apiUrl,
	},
});
