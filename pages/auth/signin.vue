<template>
  <div class="d-flex align-center justify-center px-10" style="height: 100vh">

    <!-- <v-img class="mx-auto my-6 mb-10" max-width="228"
    src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"></v-img> -->
    <v-card class="mx-auto pa-8" elevation="6" width="448" rounded="lg">
      <!-- <v-img class="mx-auto my-6 mb-10" max-width="228"
        src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"></v-img> -->
      <div class="login-icon"><v-icon>mdi-account-lock-open-outline</v-icon></div>

      <div class="login-text">Welcome back, please sign in</div>
      <v-form ref="loginForm" v-model="valid" lazy-validation @submit.prevent="login">
        <div class="text-subtitle-1 text-medium-emphasis">Username</div>

        <v-text-field placeholder="Enter your username" prepend-inner-icon="mdi-account-outline" variant="outlined"
          v-model="user.identifier" :rules="usernameRules"></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password
        </div>

        <v-text-field :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'" :type="visible ? 'text' : 'password'"
          placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
          v-model="user.password" :rules="passwordRules" @click:append-inner="visible = !visible"></v-text-field>

        <v-btn :loading="loading" class="mb-8 mt-5 font-weight-bold" color="primary" size="large" variant="tonal" block type="submit">
          Log In
        </v-btn>

        <!-- <v-card-text class="text-center">
          <a class="text-deep-purple text-decoration-none" href="#" rel="noopener noreferrer" target="_blank">
            Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
          </a>
        </v-card-text> -->
      </v-form>
    </v-card>

    <v-snackbar v-model="snackbar" location="top" color="red" variant="tonal">
      <v-icon start>mdi-alert-outline</v-icon> {{ text }}

      <template v-slot:actions>
        <v-btn variant="icon" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useMyAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "auth",
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
const visible = ref(false);
const user = ref({
  identifier: "",
  password: "",
});
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
      //console.log("authenticate: ", authenticated.value)
      loading.value = false;
      // Navigate to admin pagee
      router.push("/admin");
    }
    if (errorLogin.value == true) {
      loading.value = false;
      snackbar.value = true;
      if (errorMessage.value == "") {
        text.value = "Invalid identifier or password";
      } else {
        text.value = errorMessage.value;
      }
    }
  } else {
    loading.value = false;
  }
}
</script>
<style scoped>
.login-text {
  font-size: 15px;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 30px;
}

.login-icon {
  font-size: 60px;
  text-align: center;
  color: #673AB7;
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
