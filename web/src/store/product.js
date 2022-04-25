import axios from 'axios';
const api = `${window.location.origin}/api`;

export default {
  namespaced: true,

  state: {
    products: [],
    product_selected: null,
    products_loading: false,

    current_sort_field: 'created_at',
    current_sort_direction: 'desc',

    filter_categories: [],
    search_query: '',

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

    available_categories: [
      { category_id: 1, name: 'Категория 1' },
      { category_id: 2, name: 'Категория 2' },
    ],
    cart: [],
    cart_product: null,
    is_cart_dialog_visible: false,
    form_data: null,
  },
  getters: {
    cart: state => state.cart,
    cart_total: state => state.cart.length,
    cart_total_cost: state => state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    is_cart_dialog_visible: state => state.is_cart_dialog_visible,
    cart_product: state => state.cart_product,
    products_loading: state => state.products_loading,
    products: state => {
      let products = state.products;
      // Фильтрация по категориям
      if (state.filter_categories.length > 0) {
        products = products.filter(product => {
          const categories_id = product.categories.map(category => category.category_id);
          return state.filter_categories.every(category_id => categories_id.includes(category_id));
        });
      }
      // Фильтрация по поиску
      if (state.search_query.length > 0) {
        products = products.filter(product =>
          product.name.toLowerCase().includes(state.search_query)
        );
      }
      // Сортировка
      if (state.current_sort_field) {
        products = products.sort((a, b) => {
          if (a[state.current_sort_field] < b[state.current_sort_field]) {
            return state.current_sort_direction === 'asc' ? -1 : 1;
          }
          if (a[state.current_sort_field] > b[state.current_sort_field]) {
            return state.current_sort_direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
      return products;
    },
    product_selected: state => state.product_selected,
    filters: state => state.filters,
    sort: state => state.sort,
    form_data: state => state.form_data,
    available_categories: state => state.available_categories,
    current_sort_field: state => state.current_sort_field,
    current_sort_direction: state => state.current_sort_direction,
    search_query: state => state.search_query,
    filter_categories: state => state.filter_categories,
    similiar_products: state => {
      const products = state.products;
      const product_selected = state.product_selected;
      if (product_selected) {
        // return product from products that has most similar categories
        const categories_id = product_selected.categories.map(category => category.category_id);
        const similiar_products = products.filter(product => {
          const categories_id_product = product.categories.map(category => category.category_id);
          return categories_id.some(category_id => categories_id_product.includes(category_id));
        });
        return similiar_products.filter(p => p.product_id !== product_selected.product_id);
      }
      return [];
    },
  },
  mutations: {
    set_products_loading(state, loading) {
      state.products_loading = loading;
    },
    set_products(state, products) {
      state.products = products;
    },
    set_product_selected(state, product) {
      state.product_selected = product;
    },
    toggle_category(state, category_id) {
      if (state.filter_categories.includes(category_id)) {
        state.filter_categories = state.filter_categories.filter(it => it !== category_id);
      } else {
        state.filter_categories.push(category_id);
      }
    },
    clear_filter_categories(state) {
      state.filter_categories = [];
    },
    set_form_data(state, form_data) {
      state.form_data = form_data;
    },
    set_cart(state, cart) {
      state.cart = cart;
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    cart_push(state, product) {
      state.cart.push({ ...product, cart_id: state.cart.length + 1 });
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    cart_remove(state, cart_id) {
      state.cart = state.cart.filter(it => it.cart_id != cart_id);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    set_cart_product_quantity(state, { cart_id, quantity }) {
      state.cart = state.cart.map(it => {
        if (it.cart_id === cart_id) {
          it.quantity = quantity;
        }
        return it;
      });
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    set_available_categories(state, categories) {
      state.available_categories = categories;
    },
    set_current_sort_field(state, field) {
      state.current_sort_field = field;
    },
    toggle_sort_order(state) {
      state.current_sort_direction = state.current_sort_direction === 'asc' ? 'desc' : 'asc';
    },
    set_search_query(state, query) {
      state.search_query = query;
    },
    set_is_cart_dialog_visible(state, visible) {
      state.is_cart_dialog_visible = visible;
    },
    set_cart_product(state, product) {
      state.cart_product = product;
    },
  },
  actions: {
    open_cart_dialog({ commit }, product) {
      commit('set_cart_product', product);
      commit('set_is_cart_dialog_visible', true);
    },
    close_cart_dialog({ commit, getters }) {
      const { is_cart_dialog_visible } = getters;
      if (is_cart_dialog_visible) {
        commit('set_is_cart_dialog_visible', false);
      }
    },
    set_cart_product_quantity({ commit }, { cart_id, quantity }) {
      if (quantity > 0) {
        commit('set_cart_product_quantity', { cart_id, quantity });
      } else {
        commit('cart_remove', cart_id);
      }
    },

    add_to_cart({ commit, getters, dispatch }, product) {
      const { cart } = getters;
      const cart_product = cart.find(
        it =>
          it.product_id === product.product_id &&
          it.selected_size === product.selected_size &&
          it.selected_color === product.selected_color
      );
      if (cart_product) {
        dispatch('set_cart_product_quantity', {
          cart_id: cart_product.cart_id,
          quantity: product.quantity,
        });
      } else {
        commit('cart_push', product);
      }
      dispatch('close_cart_dialog');
    },

    async init({ dispatch, commit }) {
      await dispatch('products_get');
      await dispatch('categories_get');
      const cart = JSON.parse(localStorage.getItem('cart'));
      if (cart) {
        commit('set_cart', cart);
      }
    },
    async products_get({ commit }) {
      try {
        commit('set_products_loading', true);
        const { data } = await axios.get(api + '/products');
        commit('set_products', data);
      } catch (error) {
      } finally {
        commit('set_products_loading', false);
      }
    },
    async product_upsert({ dispatch, rootGetters }, { product, categories, previous_categories }) {
      const { token } = rootGetters;
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
      } catch (error) {}
    },
    async product_images_upload({ rootGetters }, { product_id, images }) {
      const { token } = rootGetters;
      try {
        const form = new FormData();
        form.append('product_id', product_id);
        images.forEach(image => form.append('images', image));

        await axios.post(api + '/product_images_upload', form, {
          headers: {
            'Content-Type': 'multipart/form-data; boundary=--WebKitFormBoundary7MA4YWxkTrZu0gW',
            Authorization: 'Bearer ' + token,
          },
        });
      } catch (error) {}
    },
    async images_delete({ rootGetters }, images) {
      const { token } = rootGetters;
      try {
        await axios.post(
          api + '/images_delete',
          { images },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
      } catch (error) {}
    },
    async product_get({ commit }, product_id) {
      try {
        const { data } = await axios.post(api + '/product_get', { product_id });
        commit('set_product_selected', data);
      } catch (error) {}
    },
    async product_delete({ rootGetters }, product_id) {
      const { token } = rootGetters;
      try {
        await axios.post(
          api + '/product_delete',
          { product_id },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
      } catch (error) {}
    },
    async product_category_link({ rootGetters }, { product_id, categories_ids = [] }) {
      const { token } = rootGetters;
      try {
        await axios.post(
          api + '/product_category_link',
          { product_id, categories_ids },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
      } catch (error) {}
    },
    async product_category_unlink({ rootGetters }, { product_id, categories_ids = [] }) {
      const { token } = rootGetters;
      try {
        await axios.post(
          api + '/product_category_unlink',
          { product_id, categories_ids },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
      } catch (error) {}
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
      } catch (error) {}
    },
    async category_upsert({ rootGetters }, { category_id, name }) {
      const { token } = rootGetters;
      try {
        await axios.post(
          api + '/category_upsert',
          { category_id, name },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
      } catch (error) {}
    },
    async category_delete({ rootGetters }, { category_id }) {
      const { token } = rootGetters;
      try {
        await axios.post(
          api + '/category_delete',
          { category_id },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }
        );
      } catch (error) {}
    },

    toggle_category({ commit }, category) {
      commit('toggle_category', category);
    },

    clear_filter_categories({ commit }) {
      commit('clear_filter_categories');
    },

    sort_by_field({ commit }, field) {
      commit('set_current_sort_field', field);
      commit('toggle_sort_order');
    },

    async set_search_query({ commit }, query) {
      const search_query = query.toLowerCase().trim();
      if (!search_query.length) {
        commit('set_search_query', '');
        return;
      }
      commit('set_search_query', search_query);
    },

    async generate_wa_order({ getters }) {
      const { cart } = getters;
      if (!cart.length) {
        return;
      }
      const new_line = '%0A';
      let wa_link = 'https://api.whatsapp.com/send?phone=7764882858&text=';
      const product_link = `${window.location.origin}/product/`;
      cart.map(({ product_id, name, quantity, selected_size, selected_color, sizes, colors }) => {
        const link_to_product = encodeURI(`${product_link}${product_id}`);
        const size = sizes[selected_size] ? ('Размер: ' + sizes[selected_size] + new_line) : '';
        const color = colors[selected_color] ? ('Цвет: ' + colors[selected_color] + new_line) : '';
        const one_order = `Товар №${product_id}${new_line}Название: ${name}${new_line}${size}${color}Количество: ${quantity}${new_line}Ссылка: ${link_to_product}${new_line}${new_line}`;
        wa_link += one_order;
      });
      window.open(wa_link, '_blank');
    },

    async cart_clear({ commit }) {
      commit('set_cart', []);
      localStorage.removeItem('cart');
    },
  },
};
