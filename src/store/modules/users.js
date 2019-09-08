import firebase from 'firebase'
import Vue from 'vue'
import { countObjectProperty } from "@/utils";
import { makeAppendChildToParentNutation } from "@/store/assetHelpers";
import { removeEmptyProperties } from '@/utils'

export default {
    namespaced: true,
    state: {
        items: {}
    },
    getters: {
        userPosts: (state, getters, rootState) => id => {
            const user = state.items[id]
            if (user.posts) {
                return Object.values(rootState.posts.items).filter(
                    post => post.userId === id
                );
            }
            return [];
        },
        userPostsCount: state => id => countObjectProperty(state.items[id].posts),
        userThreadsCount: state => id => countObjectProperty(state.items[id].threads)
    },
    mutations: {
        appendPostToUser: makeAppendChildToParentNutation({ parent: 'users', child: 'posts' }),
        appendThreadToUser: makeAppendChildToParentNutation({ parent: 'users', child: 'threads' }),
        setUser(state, { user, userId }) {
            Vue.set(state.items, userId, user);
        },
    },
    actions: {
        createUser({ state, commit }, { id, email, name, username, avatar = null }) {
            return new Promise((resolve, reject) => {
                const registeredAt = Math.floor(Date.now() / 1000)
                const usernameLower = username.toLowerCase()
                email = email.toLowerCase()
                const user = { email, name, username, avatar, registeredAt, usernameLower }
                firebase.database().ref('users').child(id).set(user)
                    .then(() => {
                        commit('setItem', { resource: 'users', item: user, id: id }, { root: true })
                        resolve(state.items[id])
                    })
            })
        },
        updateUser({ commit }, user) {
            const updates = {
                avatar: user.avatar,
                name: user.name,
                username: user.username,
                bio: user.bio,
                website: user.website,
                email: user.email,
                location: user.location
            }
            return new Promise((resolve, reject) => {
                firebase.database().ref('users').child(user['.key']).update(removeEmptyProperties(updates))
                    .then(() => {
                        commit('setUser', { userId: user['.key'], user })
                        resolve(user)
                    })
            })
        },
        fetchUser({ dispatch }, { id }) {
            return dispatch('fetchItem', { resource: 'users', id }, { root: true })
        },
        fetchUsers({ dispatch }, { ids }) {
            return dispatch('fetchItems', { resource: 'users', ids }, { root: true })
        }
    }
}