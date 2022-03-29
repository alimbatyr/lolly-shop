<template>
  <div>
    <h1 class="mb-3 d-inline-flex">
      <span class="mr-4">Добавить товар</span>
      <v-icon color="black" large>mdi-plus</v-icon>
    </h1>
    <Form></Form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Form from '@/components/products/Form.vue';

export default {
  name: 'ProductCreate',
  components: {
    Form,
  },
  data: () => ({}),
  methods: {
    ...mapActions('product', ['set_form_data']),
  },
  created() {
    this.set_form_data(null);
  },
};
</script>

<style></style>
