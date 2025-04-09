export default defineNuxtRouteMiddleware((to, from) => {
    const { authenticated } = storeToRefs(useMyAuthStore());
    const { userData } = storeToRefs(useMyAuthStore());
    const token = useCookie("token");
  
    if (process.client) {
      // Safely try to get user-data
      let user_data = null;
      try {
        user_data = JSON.parse(localStorage.getItem("user-data") || "null");

      } catch (err) {
        console.warn("Failed to parse user-data:", err);
      }
  
      // Clean up if there's a token but no user-data
      if (token.value && !user_data) {
        token.value = null;
        localStorage.removeItem("user-data");
        authenticated.value = false;
        return navigateTo("/");
      }
  
      // Set authenticated state if both token and user-data exist
      if (token.value && user_data) {
        authenticated.value = true;
        userData.value = user_data;
      
        // Redirect admin away from auth pages
        if (user_data.user.user_role === "admin" && to.meta.layout === "auth") {
          return navigateTo("/admin");
        }
      }
  
      // Not logged in and trying to access admin layout
      if (!token.value && to.meta.layout === "admin") {
        abortNavigation();
        return navigateTo("/");
      }
    }
  });
  