import _ from 'lodash';

export default {
  name: 'PaginationMixin',
  data: () => ({
    page: 1,
    page_count: 0,
    all_items: [],
    items: [],
  }),
  methods: {
    setup_pagination(all_items, page_size) {
      this.all_items = _.chunk(all_items, page_size);
      this.page_count = _.size(this.all_items);
      this.items = this.all_items[this.page - 1] || this.all_items[0] || [];
      this.page = +this.$route.query.page || 1;
    },
    page_change_handler(page) {
      this.$router.push(`${this.$route.path}?page=${page}`);
      this.items = this.all_items[page - 1] || this.all_items[0];
    },
  },
};
