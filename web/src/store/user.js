import axios from 'axios';
const api = `${window.location.origin}/api`;

export default {
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
  },
  getters: {
    token: _ => localStorage.getItem('token') || null,
    user: state => state.user,
  },
  mutations: {
    set_user(state, user) {
      state.user = user;
    },
    set_token(state, token) {
      state.token = token;
    },
  },
  actions: {
    async login({ commit }, { userid, password }) {
      try {
        const { data } = await axios.post(api + '/login', { userid, password });
        console.log(data);
        localStorage.setItem('token', data.token);
        commit('set_user', data.user);
      } catch (error) {
        console.log(error);
      }
    },
    async logout({ commit }) {
      localStorage.removeItem('token');
      commit('set_user', null);
      commit('set_token', null);
    },
    async user_create({ getters }, { userid, password }) {
      try {
        if (!(userid && password && getters.token)) {
          return;
        }
        await axios.post(
          api + '/user_create',
          { userid, password },
          {
            headers: {
              Authorization: 'Bearer ' + getters.token,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    async verify_token({ dispatch, commit }) {
      try {
        const token = localStorage.getItem('token') || null;
        if (!token) {
          await dispatch('logout');
          return false;
        }
        const { data } = await axios.get(api + '/verify_token', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        commit('set_token', token);
        commit('set_user', data.user);
        return true;
      } catch (error) {
        await dispatch('logout');
        return false;
      }
    }
  },
};
