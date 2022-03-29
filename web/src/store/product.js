import axios from 'axios';
const api = `${window.location.origin}/api`;

export default {
  namespaced: true,

  state: {
    products: [],
    product_selected: null,

    filters: {
      search: '',
      categories: [],
    },

    sort: [
      {
        name: 'По названию',
        field: 'name',
        order: 'asc',
        icon: 'mdi-alpha-a-box',
      },
      {
        name: 'По цене',
        field: 'price',
        order: 'asc',
        icon: 'mdi-currency-kzt',
      },
      {
        name: 'По дате',
        field: 'created_at',
        order: 'asc',
        icon: 'mdi-calendar-clock',
      },
      {
        name: 'По количеству',
        field: 'amount',
        order: 'asc',
        icon: 'mdi-numeric',
      },
    ],

    available_categories: [],
    cart: [],
    form_data: null,
  },
  getters: {
    cart: state => state.cart,
    cart_total: state => state.cart.length,
    cart_total_price: state => state.cart.reduce((acc, it) => acc + it.price, 0),
    products: state => {
      let products = state.products
      products = products.sort((a, b) => {
        const { field = 'name' } = state.sort.find(it => it.order === 'asc') || {};
        if (a[field] < b[field]) return -1;
        if (a[field] > b[field]) return 1;
        return 0;
      });
      return products;
    },
    product_selected: state => state.product_selected,
    filters: state => state.filters,
    sort: state => state.sort,
    form_data: state => state.form_data,
    available_categories: state => state.available_categories,
  },
  mutations: {
    set_products(state, products) {
      state.products = products;
    },
    set_product_selected(state, product) {
      state.product_selected = product;
    },
    set_filters(state, filters) {
      state.filters = {
        ...state.filters,
        ...filters,
      };
    },
    set_form_data(state, form_data) {
      state.form_data = form_data;
    },
    set_cart(state, cart) {
      state.cart = cart;
    },
    cart_push(state, product) {
      state.cart.push(product);
    },
    cart_remove(state, product) {
      state.cart = state.cart.filter(it => it.product_id != product.product_id);
    },
    set_available_categories(state, categories) {
      state.available_categories = categories;
    },
    set_sort_order(state, index) {
      state.sort[index].order = state.sort[index].order === 'asc' ? 'desc' : 'asc';
    },
  },
  actions: {
    async products_get({ commit }) {
      try {
        const { data } = await axios.get(api + '/products');
        commit('set_products', data);
      } catch (error) {
        console.log('products_get error', error);
      }
    },
    async product_upsert({ dispatch, rootGetters }, { product, categories, previous_categories }) {
      const { token } = rootGetters;
      console.log(categories, previous_categories);
      try {
        const { data } = await axios.post(api + '/product_upsert', product, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        const { product_id } = data;

        if (product.images.length) {
          await dispatch('product_images_upload', { product_id, images: product.images });
        }

        if (previous_categories.length) {
          const categories_to_unlink = previous_categories
            .filter(
              ({ category_id }) => !categories.map(it => it.category_id).includes(category_id)
            )
            .map(e => e.category_id);

          await dispatch('product_category_unlink', {
            product_id,
            categories_ids: categories_to_unlink,
          });
        }

        if (categories.length) {
          const categories_to_link = categories
            .filter(
              ({ category_id }) =>
                !previous_categories.map(it => it.category_id).includes(category_id)
            )
            .map(e => e.category_id);

          await dispatch('product_category_link', {
            product_id,
            categories_ids: categories_to_link,
          });
        }

        console.log(product_id);
      } catch (error) {
        console.log(error);
      }
    },
    async product_images_upload({ rootGetters }, { product_id, images }) {
      const { token } = rootGetters;
      try {
        const form = new FormData();
        form.append('product_id', product_id);
        images.forEach(image => form.append('images', image));

        const { data } = await axios.post(api + '/product_images_upload', form, {
          headers: {
            'Content-Type': 'multipart/form-data; boundary=--WebKitFormBoundary7MA4YWxkTrZu0gW',
            Authorization: 'Bearer ' + token,
          },
        });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    async images_delete({ rootGetters }, images) {
      const { token } = rootGetters;
      try {
        const { data } = await axios.post(
          api + '/images_delete',
          { images },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    async product_get({ commit }, product_id) {
      try {
        const { data } = await axios.post(api + '/product_get', { product_id });
        commit('set_product_selected', data);
      } catch (error) {
        console.log(error);
      }
    },
    async product_delete({ rootGetters }, product_id) {
      const { token } = rootGetters;
      try {
        const { data } = await axios.post(
          api + '/product_delete',
          { product_id },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    async product_category_link({ rootGetters }, { product_id, categories_ids = [] }) {
      const { token } = rootGetters;
      try {
        const { data } = await axios.post(
          api + '/product_category_link',
          { product_id, categories_ids },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    async product_category_unlink({ rootGetters }, { product_id, categories_ids = [] }) {
      const { token } = rootGetters;
      try {
        const { data } = await axios.post(
          api + '/product_category_unlink',
          { product_id, categories_ids },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },

    product_select({ commit }, product) {
      commit('set_product_selected', product);
    },
    set_form_data({ commit }, form_data) {
      commit('set_form_data', form_data);
    },

    async categories_get({ commit }) {
      try {
        const { data } = await axios.get(api + '/categories_get');
        commit('set_available_categories', data);
      } catch (error) {
        console.log(error);
      }
    },
    async category_upsert({ rootGetters }, { category_id, name }) {
      const { token } = rootGetters;
      console.log(token);
      try {
        const { data } = await axios.post(
          api + '/category_upsert',
          { category_id, name },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    async category_delete({ rootGetters }, { category_id }) {
      const { token } = rootGetters;
      try {
        const { data } = await axios.post(
          api + '/category_delete',
          { category_id },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },

    async set_filters({ commit }, filters) {
      commit('set_filters', filters);
    },

    set_sort_order({ commit }, index) {
      commit('set_sort_order', index);
    },

    async generate_wa_order({ getters }) {
      const { cart } = getters;
      if (!cart.length) {
        return;
      }
      const new_line = '%0A';
      let wa_link = 'https://api.whatsapp.com/send?phone=7764882858&text=';
      const product_link = `${window.location.origin}/product/`;
      cart.map(({ product_id, name, price }) => {
        const link_to_product = encodeURI(`${product_link}${product_id}`);
        const one_order = `Товар №${product_id}${new_line}Название: ${name}${new_line}Цена: ${price}${new_line}Ссылка: ${link_to_product}${new_line}Количество: 1${new_line}${new_line}`;
        wa_link += one_order;
      });
      console.log(wa_link);
      window.open(wa_link, '_blank');
      // var encodedURL = encodeURIComponent(some_url);
    },

    async cart_clear({ commit }) {
      commit('set_cart', []);
      localStorage.removeItem('cart');
    }
  },
};
