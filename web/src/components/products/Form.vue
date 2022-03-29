<template>
  <form ref="form">
    <v-text-field
      v-model="name"
      :error-messages="name_errors"
      :counter="50"
      label="Название"
      color="black"
      required
      @input="$v.name.$touch()"
      @blur="$v.name.$touch()"
    ></v-text-field>

    <v-textarea
      v-model="description"
      :error-messages="description_errors"
      label="Описание"
      color="black"
      auto-grow
      :counter="1000"
      required
      rows="2"
      @input="$v.description.$touch()"
      @blur="$v.description.$touch()"
    ></v-textarea>

    <v-text-field
      v-model="price"
      :error-messages="price_errors"
      label="Цена"
      type="number"
      color="black"
      required
      @input="$v.price.$touch()"
      @blur="$v.price.$touch()"
    ></v-text-field>

    <v-text-field
      v-model="amount"
      :error-messages="amount_errors"
      label="Количество товара"
      type="number"
      color="black"
      required
      @input="$v.amount.$touch()"
      @blur="$v.amount.$touch()"
    >
    </v-text-field>

    <v-combobox v-model="sizes" :items="[]" label="Размеры" color="black" multiple chips>
      <template v-slot:selection="{ attrs, item, select, selected }">
        <v-chip
          v-bind="attrs"
          :input-value="selected"
          close
          @click="select"
          @click:close="remove_size(item)"
        >
          <strong v-text="item"></strong>
        </v-chip>
      </template>
    </v-combobox>

    <v-select
      v-model="selected_categories"
      :items="available_categories"
      label="Категории"
      multiple
      chips
      color="black"
      item-text="name"
      return-object
    ></v-select>

    <v-file-input
      v-model="images"
      id="uploaded_images"
      accept="image/png, image/jpeg, image/bmp"
      counter
      multiple
      show-size
      color="black"
      truncate-length="15"
      label="Изображения"
      clearable
      @change="image_input_changed"
    >
      <template v-slot:selection="{ index, text }">
        <v-chip dark label small close @click:close="remove_image(index)">
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>

    <v-row class="my-3" v-if="preview_images.length">
      <v-col v-for="image in preview_images" :key="image.image_id" cols="auto">
        <v-img class="form__image" :src="image.src" height="250" width="250">
          <v-btn class="form__image-remove" icon @click="product_image_remove(image.image_id)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-img>
      </v-col>
    </v-row>

    <div class="form__controllers">
      <v-btn color="black" dark class="mr-4" @click="submit"> Сохранить </v-btn>
      <v-btn color="black" dark @click="clear"> Очистить </v-btn>

      <v-btn
        v-if="this.product_id"
        color="black"
        dark
        class="ml-auto"
        @click="product_delete(product_id), $router.push('/products')"
      >
        Удалить
      </v-btn>
    </div>
  </form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, maxLength } from 'vuelidate/lib/validators';
import { mapActions, mapGetters } from 'vuex';

export default {
  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(50) },
    description: { required, maxLength: maxLength(1000) },
    price: { required },
    amount: { required },
  },

  data: () => ({
    product_id: null,
    name: '',
    description: '',
    price: '',
    amount: '',
    sizes: [],
    colors: [],
    images: [],
    to_delete_images: [],
    previous_images: [],
    preview_images: [],
    selected_categories: [],
    previous_categories: [],
  }),

  computed: {
    ...mapGetters('product', ['form_data', 'available_categories']),
    name_errors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength && errors.push('Название должно содержать не более 50 символов');
      !this.$v.name.required && errors.push('Название обязательно.');
      return errors;
    },
    description_errors() {
      const errors = [];
      if (!this.$v.description.$dirty) return errors;
      !this.$v.description.maxLength &&
        errors.push('Описание должно содержать не более 1000 символов');
      !this.$v.description.required && errors.push('Описание обязательно.');
      return errors;
    },
    price_errors() {
      const errors = [];
      if (!this.$v.price.$dirty) return errors;
      !this.$v.price.required && errors.push('Цена обязательна.');
      return errors;
    },
    amount_errors() {
      const errors = [];
      if (!this.$v.amount.$dirty) return errors;
      !this.$v.amount.required && errors.push('Количество товара обязательно.');
      return errors;
    },
  },

  methods: {
    ...mapActions('product', [
      'product_upsert',
      'product_delete',
      'images_delete',
      'categories_get',
    ]),
    async submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      await this.product_upsert({
        product: {
          ...((this.product_id && { product_id: this.product_id }) || {}),
          name: this.name,
          description: this.description,
          price: this.price,
          amount: this.amount,
          sizes: this.sizes,
          images: this.images,
          colors: this.colors,
        },
        categories: this.selected_categories,
        previous_categories: this.previous_categories || [],
      });
      if (this.to_delete_images.length) {
        await this.images_delete(this.to_delete_images);
      }
      this.$router.push('/products');
    },
    clear() {
      this.$v.$reset();
      // clear all form data
      this.product_id = null;
      this.name = '';
      this.description = '';
      this.price = '';
      this.amount = '';
      this.sizes = [];
      this.colors = [];
      this.images = [];
      this.previous_images = [];
      this.selected_categories = [];
    },
    remove_category(item) {
      this.selected_categories.splice(this.selected_categories.indexOf(item), 1);
      this.selected_categories = [...this.selected_categories];
    },
    remove_size(item) {
      this.sizes.splice(this.sizes.indexOf(item), 1);
      this.sizes = [...this.sizes];
    },
    remove_image(index) {
      this.previous_images.splice(index, 1);
      this.images = this.previous_images;
    },
    image_input_changed() {
      this.images = [];
      const uploaded_images = this.$refs.form.querySelector('#uploaded_images').files;
      for (let i = 0; i < uploaded_images.length; i++) {
        if (
          this.previous_images !== undefined &&
          this.previous_images !== null &&
          this.previous_images.length <= 0
        ) {
          this.previous_images.push(uploaded_images[i]);
        } else {
          const index = this.previous_images.findIndex(x => x.name === uploaded_images[i].name);
          if (index >= 0) {
            this.previous_images.splice(index, 1);
          }
          this.previous_images.push(uploaded_images[i]);
        }
      }
      this.images = this.previous_images;
    },

    product_image_remove(id) {
      this.to_delete_images.push(id);
      this.preview_images = this.preview_images.filter(({ image_id }) => image_id !== id);
    },

    setup_form_values() {
      if (!this.form_data) {
        return;
      }
      const { product_id, name, description, price, amount, sizes, colors, categories, images } =
        this.form_data;
      this.product_id = product_id;
      this.name = name;
      this.description = description;
      this.price = price;
      this.amount = amount;
      this.sizes = sizes || [];
      this.colors = colors || [];
      this.preview_images = images;
      this.previous_categories = categories;
      this.selected_categories = categories;
    },
  },

  async created() {
    this.setup_form_values();
    await this.categories_get();
  },
  beforeDestroy() {
    this.clear();
  },
};
</script>

<style lang="scss">
.form {
  &__controllers {
    display: flex;
    margin-top: 1em;
  }

  &__image {
    position: relative;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  &__image-remove {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
