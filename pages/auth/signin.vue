<template>
  <div class="flex items-center justify-center px-4 md:px-10 min-h-screen bg-gray-100">

    <div class="bg-white mx-auto p-8 shadow-lg w-full max-w-md rounded-lg">
      <div class="text-6xl text-center text-purple-700 mb-5">
        <i class="mdi mdi-account-lock-open-outline"></i>
      </div>

      <div class="text-base text-center mt-5 mb-8 text-gray-700">Welcome back, please sign in</div>
      
      <form ref="loginForm" @submit.prevent="login">
        <div class="text-sm font-medium text-gray-700 mb-2">Username</div>

        <div class="relative mb-6">
          <div class="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-purple-500">
            <i class="mdi mdi-account-outline text-gray-500 ml-3"></i>
            <input
              type="text"
              placeholder="Enter your username"
              v-model="user.identifier"
              class="flex-grow p-2 rounded-r-md focus:outline-none"
            />
          </div>
          <p v-if="!user.identifier && attemptedSubmit" class="text-red-500 text-xs mt-1">Username is required</p>
        </div>


        <div class="text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
          Password
        </div>

        <div class="relative mb-8">
          <div class="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-purple-500">
            <i class="mdi mdi-lock-outline text-gray-500 ml-3"></i>
            <input
              :type="visible ? 'text' : 'password'"
              placeholder="Enter your password"
              v-model="user.password"
              class="flex-grow p-2 focus:outline-none"
            />
            <button
              type="button"
              @click="visible = !visible"
              class="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <i :class="visible ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"></i>
            </button>
          </div>
          <p v-if="!user.password && attemptedSubmit" class="text-red-500 text-xs mt-1">Password is required</p>
        </div>


        <button
          type="submit"
          :disabled="loading"
          class="w-full px-6 py-3 bg-purple-600 text-white rounded-md font-bold hover:bg-purple-700 transition-colors normal-case"
          :class="{ 'opacity-50 cursor-not-allowed': loading }"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
          Log In
        </button>
      </form>
    </div>

    <!-- Custom Snackbar -->
    <transition name="fade">
      <div v-if="snackbar"
        :class="['fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg text-white flex items-center', { 'bg-red-500': snackbar_color === 'red' }]">
        <i class="mdi mdi-alert-outline mr-2"></i> {{ text }}

        <button @click="snackbar = false" class="ml-auto text-white opacity-75 hover:opacity-100">
          <i class="mdi mdi-close text-sm"></i>
        </button>
      </div>
    </transition>
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
const { authenticateUser } = useMyAuthStore();
const { authenticated, userInfo, errorLogin, errorMessage } = storeToRefs(useMyAuthStore());

const loading = ref(false);
const visible = ref(false); // Controls password visibility
const user = ref({
  identifier: "",
  password: "",
});
const loginForm = ref(null); // Reference to the form element (not a Vuetify component)
const snackbar = ref(false);
const text = ref("An error occurred."); // Default snackbar message
const snackbar_color = ref("red"); // Set default color for the custom snackbar
const attemptedSubmit = ref(false); // To track if submit was attempted for manual validation display

// Login function
async function login() {
  attemptedSubmit.value = true; // Mark that submit was attempted

  // Manual validation
  if (!user.value.identifier || !user.value.password) {
    snackbar.value = true;
    text.value = "Please enter both username and password.";
    return; // Stop if validation fails
  }

  loading.value = true;

  try {
    await authenticateUser(user.value); // Call authenticateUser action

    if (authenticated.value === true) {
      loading.value = false;
      router.push("/admin");
    } else if (errorLogin.value === true) {
      loading.value = false;
      snackbar.value = true;
      text.value = errorMessage.value || "Invalid username or password.";
    }
  } catch (err) {
    loading.value = false;
    snackbar.value = true;
    text.value = "An unexpected error occurred during login. Please try again.";
    console.error("Login error:", err);
  }
}
</script>

<style scoped>
/* Spinner for loading state on buttons */
.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: -0.125em;
  border: 0.125em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: .75s linear infinite spinner-border;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}

/* Transition for Snackbar */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>