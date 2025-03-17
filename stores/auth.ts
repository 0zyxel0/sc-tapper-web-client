import { defineStore } from 'pinia'
import axios from 'axios';

interface UserPayloadInterface {
  identifier: string;
  password: string;
}

export const useMyAuthStore = defineStore({
  id: 'myAuthStore',
  state: () => ({
    authenticated: false,
    loading: false,
    userData: {},
    errorLogin: false,
    errorMessage: "",
  }),
  actions: {
    // Login Function
    async authenticateUser({ identifier, password }: UserPayloadInterface) {
      const backend = await axios.get('/api/settings/connectBackend');
      const baseUrl = backend.data;
      console.log(`Current Base URL : ${baseUrl}`);
      const loginEndpoint = `${baseUrl}/api/auth/local`;
      console.log(`Contacting Login Endpoint : ${loginEndpoint}`);
      const { data, pending, error }: any = await useFetch(loginEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          identifier,
          password,
        }
      });
      this.loading = pending;

      if (data.value) {
        let userRole = data?.value?.user.user_role;

        if (userRole !== 'admin') {
          this.errorLogin = true;
          return error;
        }

        localStorage.setItem('user-data', JSON.stringify(data.value)); // Set user-data to local storage
        const token = useCookie('token'); // useCookie new hook in nuxt 3
        token.value = data?.value?.jwt; // set token to cookie
        this.authenticated = true; // set authenticated state value to true
        this.errorLogin = false; // set errorLogin state value to false


      } else {
        this.errorLogin = true; // set errorLogin state value to true;
        this.errorMessage = error.value.data.error.message
        //this.errorMessage = error.value.data.error.message;
      }
    },

    // Logout Function
    logUserOut() {
      const token = useCookie('token'); // useCookie new hook in nuxt 3
      token.value = null; // clear the token cookie
      this.authenticated = false; // set authenticated state value to false
      this.userData = {}; // set the userData state value to empty
      localStorage.removeItem("user-data"); // remove the user-data to local storage
    }
  }
})
