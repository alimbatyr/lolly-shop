<template>
  <div class="categories">
    <v-data-table :headers="headers" :items="items" sort-by="calories" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="black" dark class="mb-2" v-bind="attrs" v-on="on">
                <span class="mr-3">Создать</span>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5" v-text="form_title"></span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="edited_item.name"
                        label="Название категории"
                        color="black"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="black" text @click="close"> Отмена </v-btn>
                <v-btn color="black" text @click="save"> Сохранить </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialog_delete" max-width="500px">
            <v-card>
              <v-card-title class="text-h6 text-center">
                Вы уверены что хотите удалить данную категорию?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="black" text @click="close_delete">Отмена</v-btn>
                <v-btn color="black" text @click="delete_item_confirm">ОК</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="edit_item(item)"> mdi-pencil </v-icon>
        <v-icon small @click="delete_item(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data: () => ({
    dialog: false,
    dialog_delete: false,
    headers: [
      {
        text: 'ID Категории',
        align: 'start',
        sortable: true,
        value: 'category_id',
      },
      { text: 'Название', value: 'name' },
      { text: 'Действия', value: 'actions', sortable: false },
    ],
    items: [],
    edited_index: -1,
    edited_item: {
      name: '',
    },
    default_item: {
      name: '',
    },
  }),

  computed: {
    ...mapGetters('product', ['available_categories']),
    form_title() {
      return this.edited_index === -1 ? 'Создать категорию' : 'Редактировать категорию';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialog_delete(val) {
      val || this.close_delete();
    },
  },

  async created() {
    this.setup_items();
  },

  methods: {
    ...mapActions('product', ['categories_get', 'category_upsert', 'category_delete']),

    async setup_items() {
      await this.categories_get();
      this.items = [...this.available_categories];
    },

    edit_item(item) {
      this.edited_index = this.items.indexOf(item);
      this.edited_item = Object.assign({}, item);
      this.dialog = true;
    },

    delete_item(item) {
      this.edited_index = this.items.indexOf(item);
      this.edited_item = Object.assign({}, item);
      this.dialog_delete = true;
    },

    async delete_item_confirm() {
      this.items.splice(this.edited_index, 1);
      await this.category_delete(this.edited_item);
      this.close_delete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.edited_item = Object.assign({}, this.default_item);
        this.edited_index = -1;
      });
    },

    close_delete() {
      this.dialog_delete = false;
      this.$nextTick(() => {
        this.edited_item = Object.assign({}, this.default_item);
        this.edited_index = -1;
      });
    },

    async save() {
      if (this.edited_index > -1) {
        Object.assign(this.items[this.edited_index], this.edited_item);
      } else {
        console.log(this.edited_item)
      }
      await this.category_upsert(this.edited_item);
      await this.setup_items();
      this.close();
    },
  },
};
</script>

<style></style>
