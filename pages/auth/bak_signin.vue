<template>
  <div class="d-flex align-center justify-center px-10" style="height: 100vh">
      <v-card width="450" class="mx-auto card-border elevation-0 pt-10">
          <div class="login-text">Sign In</div>
          <v-form ref="loginForm" v-model="valid" lazy-validation class="mx-10 mt-4 mb-10" @submit.prevent="login">
              <v-text-field v-model="user.identifier" :rules="usernameRules" variant="outlined" label="Username"
                  prepend-inner-icon="mdi-account" required></v-text-field>
              <v-text-field v-model="user.password" :rules="passwordRules"
                  :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" variant="outlined" label="Password"
                  :type="showPass ? 'text' : 'password'" @click:append-inner="showPass = !showPass"
                  prepend-inner-icon="mdi-lock" required></v-text-field>

              <v-btn :disabled="!valid" color="primary" class="mt-5" size="large" :loading="loading" block
                  type="submit">
                  Sign In
              </v-btn>
          </v-form>
      </v-card>

      <v-snackbar v-model="snackbar" location="top" color="red" variant="tonal">
          {{ text }}

          <template v-slot:actions>
              <v-btn variant="icon" @click="snackbar = false">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
          </template>
      </v-snackbar>
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia';
import { useMyAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'auth',
});
useHead({
  title: "Log In",
});

const router = useRouter();
const { authenticateUser } = useMyAuthStore(); // use authenticateUser action from auth store
const { authenticated } = storeToRefs(useMyAuthStore()); // make authenticated state reactive with storeToRefs
const { userInfo } = storeToRefs(useMyAuthStore()); // make userInfo state reactive
const { errorLogin } = storeToRefs(useMyAuthStore()); // make errorLogin state reactive
const { errorMessage } = storeToRefs(useMyAuthStore()); // make errorMessage state reactive

const valid = ref(true);
const loading = ref(false);
const showPass = ref(false);
const user = ref({
  identifier: "",
  password: "",
})
const loginForm = ref(null);
const usernameRules = [
(v) => !!v || "Username is required",
// (v) => /.+@.+\..+/.test(v) || "E-mail must be valid"
];
const passwordRules = [(v) => !!v || "Password is required"];
const snackbar = ref(false);
const text = ref("HHHHHH");

// Login function
async function login() {
  const { valid, errors } = await loginForm.value?.validate();
  loading.value = true;

  if (valid) {
      await authenticateUser(user.value); // call authenticateUser and pass the user object
      if (authenticated.value == true) {
        console.log("authenticate: ", authenticated.value)
          loading.value = false;
          // Navigate to admin pagee
          router.push("/admin");
      }
      if (errorLogin.value == true) {
          loading.value = false;
          snackbar.value = true;
          if(errorMessage.value == "") {
              text.value = "Invalid identifier or password";
          } else {
              text.value = errorMessage.value;
          }
      }
  }
}
</script>
<style scoped>
.login-text {
font-size: 22px;
text-align: center;
font-weight: bold;
margin-top: 50px;
margin-bottom: 30px;
}
.nuxt-link {
text-decoration: none;
padding-top: 5px;
color: #2196f3;
}

.card-border {
border-radius: 20px;
box-shadow: rgba(0, 0, 0, 0.3) 0px 7px 29px 0px;
}
</style>