// src/store.js

import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            user: null,
        };
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
    },
    actions: {
        login({ commit }, user) {
            commit('setUser', user);
        },
    },
});

export default store;
