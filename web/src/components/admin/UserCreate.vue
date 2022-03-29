<template>
  <div class="register-form">
    <v-sheet class="register-form__container">
      <form @submit.prevent="submit">
        <h3 class="register-form__title">Зарегистрировать пользователя</h3>
        <v-text-field
          v-model="userid"
          :error-messages="userid_errors"
          label="Логин"
          color="black"
          required
          @input="$v.userid.$touch()"
          @blur="$v.userid.$touch()"
        />
        <v-text-field
          v-model="password"
          :error-messages="password_errors"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          label="Пароль"
          color="black"
          required
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
          @click:append="showPassword = !showPassword"
        />
        <v-text-field
          v-model="password_repeat"
          :error-messages="password_repeat_errors"
          :append-icon="showPasswordRepeat ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPasswordRepeat ? 'text' : 'password'"
          label="Повторите пароль"
          color="black"
          required
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
          @click:append="showPasswordRepeat = !showPasswordRepeat"
        />
        <div class="text-center">
        <v-btn
          class="mx-auto"
          width="50%"
          color="black"
          dark
          type="submit"
          :loading="is_loading">
          Зарегистрировать
        </v-btn>
        </div>
      </form>
    </v-sheet>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, sameAs } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

export default {
  mixins: [validationMixin],

  validations: {
    userid: { required },
    password: { required },
    password_repeat: { required, sameAs: sameAs('password') },
  },

  data: () => ({
    userid: '',
    password: '',
    password_repeat: '',
    showPassword: false,
    showPasswordRepeat: false,
    is_loading: false,
  }),

  computed: {
    password_errors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push('Пароль обязателен.');
      return errors;
    },
    password_repeat_errors() {
      const errors = [];
      if (!this.$v.password_repeat.$dirty) return errors;
      !this.$v.password_repeat.required && errors.push('Повторите пароль.');
      !this.$v.password_repeat.sameAs && errors.push('Пароли не совпадают.');
      return errors;
    },
    userid_errors() {
      const errors = [];
      if (!this.$v.userid.$dirty) return errors;
      !this.$v.userid.required && errors.push('Логин обязателен.');
      return errors;
    },
  },

  methods: {
    ...mapActions(['login', 'user_create']),
    async submit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      const payload = {
        userid: this.userid,
        password: this.password,
      };
      this.is_loading = true;
      await this.user_create(payload);
      this.is_loading = false;
    },
  },
};
</script>

<style lang="scss">
.register-form {
  display: flex;
  align-items: center;
  margin-top: 4em;
  &__container {
    background-color: #fff;
    padding-right: 20em;
    width: 1000px;
  }

  &__title {
    font-size: 1.5em;
    color: rgb(41, 41, 41);
    margin-bottom: 2em;
  }
}
</style>
