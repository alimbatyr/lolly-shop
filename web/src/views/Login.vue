<template>
  <div class="login-form">
    <v-sheet class="login-form__container">
      <form @submit.prevent="submit">
        <h3 class="login-form__title">Войдите в систему</h3>
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
        <div class="text-center">
        <v-btn
          class="mx-auto"
          width="50%"
          color="black"
          dark
          type="submit"
          :loading="is_loading">
          Войти
        </v-btn>
        </div>
      </form>
    </v-sheet>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

export default {
  mixins: [validationMixin],

  validations: {
    userid: { required },
    password: { required },
  },

  data: () => ({
    userid: '',
    password: '',
    showPassword: false,
    is_loading: false,
  }),

  computed: {
    password_errors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push('Пароль обязателен.');
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
    ...mapActions(['login']),
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
      await this.login(payload);
      this.is_loading = false;
      // redirect to home
      this.$router.push('/products');
    },
  },
};
</script>

<style lang="scss">
.login-form {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4em;
  &__container {
    background-color: #fff;
    padding: 7em 10em;
    width: 1000px;
  }

  &__title {
    font-size: 1.5em;
    color: rgb(41, 41, 41);
    margin-bottom: 2em;
  }
}

@media (max-width: 768px) {
  .login-form {
    &__container {
      padding: 0;
    }
  }
}
</style>
