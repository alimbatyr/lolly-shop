<template>
  <div class="login-form">
    <v-sheet class="login-form__container">
      <form @submit.prevent="submit">
        <h3 class="login-form__title">Welcome</h3>
        <v-text-field
          v-model="userid"
          :error-messages="useridErrors"
          label="Логин"
          filled
          rounded
          required
          @input="$v.userid.$touch()"
          @blur="$v.userid.$touch()"
        />
        <v-text-field
          v-model="password"
          :error-messages="passwordErrors"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          label="Пароль"
          filled
          rounded
          required
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
          @click:append="showPassword = !showPassword"
        />
        <v-btn
          width="20%"
          color="#6187EE"
          dark
          rounded
          type="submit"
          :loading="isLoading">
          Sign in
        </v-btn>
      </form>
    </v-sheet>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

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
    isLoading: false,
  }),

  computed: {
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push('Пароль обязателен.');
      return errors;
    },
    useridErrors() {
      const errors = [];
      if (!this.$v.userid.$dirty) return errors;
      !this.$v.userid.required && errors.push('Логин обязателен.');
      return errors;
    },
  },

  methods: {
    async submit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      const payload = {
        userid: this.userid,
        password: this.password,
      };
      this.isLoading = true;
      console.log(payload);
      this.isLoading = false;
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
</style>
