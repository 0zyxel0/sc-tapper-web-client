export default defineNuxtRouteMiddleware((to, from) => {
    const { authenticated } = storeToRefs(useMyAuthStore()); // make authenticated state reactive
    const { userData } = storeToRefs(useMyAuthStore()); // make userData state reactive
    const token = useCookie("token"); // get token from cookies

    const user_data = JSON.parse(localStorage.getItem("user-data")); // get user-data from localStorage

    // Remove the user data from the localStorage if token doesn't exist
    if (token.value === null && user_data) {
        localStorage.removeItem("user-data");
    }
    
    // if token exist but there is no user data store in the localStorage
    // then set the token value to null and authenticated to false
    if (token.value && user_data === null) {
        localStorage.removeItem("user-data");
        token.value = null;
        authenticated.value = false;
    }

    if (token.value) {
        authenticated.value = true; // update the state to authenticated
        userData.value = user_data; // update the userData state

        if (user_data.user.user_role === "admin") {
            //console.log("Admin Account");
            if (to.meta.layout === "auth") {
                return navigateTo("/admin");
            }
        }
    }

    // if (token.value && user_data.user.user_role === "admin") {
    //     console.log("Admin Account");
    //     // if (token.value && to.path !== "/admin/auth/signin") {
    //     //     return navigateTo("/admin");
    //     // }
    //     if (to.meta.layout === "auth") {
    //         return navigateTo("/admin");
    //     }
    // }

    if(!token.value && to.meta.layout === "admin") {
        abortNavigation();
        return navigateTo("/");
    }
})
