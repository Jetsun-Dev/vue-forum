import firebase from 'firebase'

export default {
    namespaced: true,
    state: {
        items: {}
    },
    actions: {
        fetchCategory({ dispatch }, { id }) {
            return dispatch('fetchItem', { resource: 'categories', id }, { root: true })
        },
        fetchCategories({ dispatch }, { ids }) {
            return dispatch('fetchItems', { resource: 'categories', ids }, { root: true }, { root: true })
        },
        fetchAllCategories({ state, commit }) {
            return new Promise((resolve, reject) => {
                firebase.database().ref('categories').once('value', snapshot => {
                    const categoriesObject = snapshot.val()
                    Object.keys(categoriesObject).forEach(categoryId => {
                        const category = categoriesObject[categoryId]
                        commit('setItem', { resource: 'categories', id: categoryId, item: category }, { root: true })
                    })
                    resolve(Object.values(state.items))
                })
            })
        }
    }
}