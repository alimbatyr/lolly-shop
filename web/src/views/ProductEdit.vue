<template>
  <div>
    <div class="text-center" v-if="is_loading">
      <v-progress-circular
        :size="200"
        :width="20"
        color="black"
        class="mx-auto my-auto"
        indeterminate
      ></v-progress-circular>
    </div>
    <dir v-else>
      <h1 class="mb-3 d-inline-flex">
        <span class="mr-4">Редактировать товар</span>
        <v-icon color="black" large>mdi-pencil</v-icon>
      </h1>
      <Form></Form>
    </dir>
  </div>
</template>

<script>
import Form from '@/components/products/Form.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'ProductEdit',
  components: {
    Form,
  },
  data: () => ({
    is_loading: false,
  }),
  computed: {
    ...mapGetters('product', ['product_selected']),
  },
  methods: {
    ...mapActions('product', ['product_get', 'set_form_data']),
  },
  async created() {
    console.log('created');
    this.is_loading = true;
    await this.product_get(this.$route.params.id);
    this.set_form_data(this.product_selected);
    this.is_loading = false;
  },
};
</script>

<style></style>
