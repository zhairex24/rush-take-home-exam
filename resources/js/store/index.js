import Vue from 'vue'
import Vuex from 'vuex'
import repository from '../api/repository';

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth: {
            state: () => ({
                user: sessionStorage.user ? JSON.parse(sessionStorage.getItem('user')) : null
            }),

            getters: {
                user: state => state.user,
                authenticated: state => state.user !== null,
            },

            mutations: {
                SET_USER(state, user) {
                    state.user = user;
                }
            },

            actions: {
                async login({ commit }, user) {
                    await repository.createSession();
                    const { data } = await repository.login(user);
                    
                    if(typeof data.errors !== 'undefined') {
                        console.log(data.errors.message[0]);
                    } else {
                        commit('SET_USER', data)
                        sessionStorage.user = JSON.stringify(data);
                    }
                },

                async logout({ commit }) {
                    await repository.logout();
                    commit('SET_USER', null);
                    sessionStorage.removeItem('user');
                },

                // async saveUser(params) {
                //     await repository.createSession();
                //     const { data } = await repository.saveUser(params);
                //     console.log('data => ', data);
                // },

                async getAllUsers() {
                    return await repository.getAllUsers();
                }
            }
        }
    }
})