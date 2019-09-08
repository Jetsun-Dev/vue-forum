import { makeAppendChildToParentNutation } from "@/store/assetHelpers";

export default {
    namespaced: true,
    state: {
        items: {}
    },
    mutations: {
        appendThreadToForum: makeAppendChildToParentNutation({ parent: 'forums', child: 'threads' }),
    },
    actions: {
        fetchForums({ dispatch }, { ids }) {
            return dispatch('fetchItems', { resource: 'forums', ids }, { root: true })
        },
        fetchForum({ dispatch }, { id }) {
            return dispatch('fetchItem', { resource: 'forums', id }, { root: true })
        },
    }
}