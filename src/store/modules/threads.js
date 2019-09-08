import firebase from 'firebase'
import Vue from 'vue'
import { countObjectProperty } from "@/utils";
import { makeAppendChildToParentNutation } from "@/store/assetHelpers";

export default {
    namespaced: true,
    state: {
        items: {},
    },
    getters: {
        threadRepliesCount: state => id => countObjectProperty(state.items[id].posts) - 1
    },
    mutations: {
        appendPostToThread: makeAppendChildToParentNutation({ parent: 'threads', child: 'posts' }),
        appendContributorToThread: makeAppendChildToParentNutation({ parent: 'threads', child: 'contributors' }),
        setThread(state, { thread, threadId }) {
            Vue.set(state.items, threadId, thread);
        },
    },
    actions: {
        createThread({ state, commit, dispatch, rootState }, { title, text, forumId }) {

            return new Promise((resolve, reject) => {
                const threadId = firebase.database().ref('threads').push().key
                const postId = firebase.database().ref('posts').push().key
                const userId = rootState.auth.authId
                const publishedAt = Math.floor(Date.now() / 1000)
                const thread = {
                    title,
                    forumId,
                    publishedAt,
                    userId,
                    firstPostId: postId,
                    posts: {}
                }
                thread.posts[postId] = postId
                const post = {
                    text,
                    threadId,
                    publishedAt,
                    userId
                }

                const updates = {}
                updates[`threads/${threadId}`] = thread
                updates[`forums/${forumId}/threads/${threadId}`] = threadId
                updates[`users/${userId}/threads/${threadId}`] = threadId

                updates[`posts/${postId}`] = post
                updates[`users/${userId}/posts${postId}`] = postId
                firebase.database().ref().update(updates)
                    .then(() => {
                        //update thread
                        commit('setItem', { resource: 'threads', id: threadId, item: thread }, { root: true })
                        commit('forums/appendThreadToForum', { parentId: forumId, childId: threadId }, { root: true })
                        commit('users/appendThreadToUser', { parentId: userId, childId: threadId }, { root: true })
                        //update post
                        commit('setItem', { resource: 'posts', item: post, id: postId }, { root: true })
                        commit('appendPostToThread', { parentId: post.threadId, childId: postId })
                        commit('users/appendPostToUser', { parentId: post.userId, childId: postId }, { root: true })

                        resolve(state.items[threadId])
                    })
            })
        },
        updateThread({ state, commit, dispatch, rootState }, { title, text, id }) {
            return new Promise((resolve, reject) => {
                const thread = state.items[id]
                const post = rootState.posts.items[thread.firstPostId]

                const edited = {
                    at: Math.floor(Date.now() / 1000),
                    by: rootState.auth.authId
                }

                const updates = {}
                updates[`posts/${thread.firstPostId}/text`] = text
                updates[`posts/${thread.firstPostId}/edited`] = edited
                updates[`threads/${id}/title`] = title
                firebase.database().ref().update(updates)
                    .then(() => {
                        commit('setThread', { thread: { ...thread, title }, threadId: id })
                        commit('posts/setPost', { postId: thread.firstPostId, post: { ...post, text, edited } }, { root: true })
                        resolve(post)
                    })
            });

        },
        fetchThread({ dispatch }, { id }) {
            return dispatch('fetchItem', { resource: 'threads', id }, { root: true })
        },
        fetchThreads({ dispatch }, { ids }) {
            return dispatch('fetchItems', { resource: 'threads', ids }, { root: true })
        }
    }
}