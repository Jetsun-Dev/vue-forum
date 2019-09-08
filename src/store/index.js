import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import categories from './modules/categories'
import forums from './modules/forums'
import auth from './modules/auth'
import posts from './modules/posts'
import threads from './modules/threads'
import users from './modules/users'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    getters,
    mutations,
    actions,
    modules: {
        categories,
        forums,
        auth,
        posts,
        threads,
        users
    }
});