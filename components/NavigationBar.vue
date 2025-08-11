<template>
  <!-- 
    The main container for the navigation bar.
    - `h-screen`: Makes it take the full height of the viewport.
    - `w-64`: Sets a fixed width (width: 16rem). Adjust as needed.
    - `flex flex-col`: Establishes a flex container to position the nav list and the logout button.
    - `bg-gray-800 text-white`: Replicates the `theme="dark"` effect. A deep purple could be `bg-indigo-800`.
  -->
  <aside class="flex h-screen w-64 flex-col bg-gray-800 text-white">

    <!-- Navigation Links List -->
    <!-- `flex-grow`: Allows this list to take up all available space, pushing the logout button to the bottom. -->
    <div class="flex-grow">
      <nav>
        <ul>
          <li>
            <!-- 
              We use <NuxtLink> for internal routing.
              - `exact-active-class`: Applies a style only when the route is an exact match. Perfect for navigation.
              - `flex items-center ...`: Styles the link to look like a list item.
              - `hover:bg-gray-700`: Replicates the hover effect.
            -->
            <NuxtLink
              to="/"
              class="flex items-center gap-x-3 p-4 text-gray-300 hover:bg-gray-700 hover:text-white"
              exact-active-class="bg-gray-900 text-white"
            >
              <!-- 
                The <Icon> component from nuxt-icon.
                - The name format is `[icon-set]:[icon-name]`.
              -->
              <Icon name="mdi:view-dashboard" class="h-6 w-6" />
              <span>Dashboard</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/admin/cards"
              class="flex items-center gap-x-3 p-4 text-gray-300 hover:bg-gray-700 hover:text-white"
              active-class="bg-gray-900 text-white"
            >
              <Icon name="mdi:credit-card" class="h-6 w-6" />
              <span>Cards</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/admin/profiles"
              class="flex items-center gap-x-3 p-4 text-gray-300 hover:bg-gray-700 hover:text-white"
              active-class="bg-gray-900 text-white"
            >
              <Icon name="mdi:account" class="h-6 w-6" />
              <span>Profiles</span>
            </NuxtLink>
          </li>
          <li>
            <!-- Note: Your original code had two links to "/", which might be a typo. I'm keeping it for accuracy. -->
            <NuxtLink
              to="/"
              class="flex items-center gap-x-3 p-4 text-gray-300 hover:bg-gray-700 hover:text-white"
              exact-active-class="bg-gray-900 text-white"
            >
              <Icon name="mdi:gate" class="h-6 w-6" />
              <span>Gate</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Appended content (Logout Button) -->
    <!-- 
      This div is a direct child of the flex container. Since the list above has `flex-grow`,
      this will be pushed to the bottom. `p-4` replaces Vuetify's `pa-2` (Tailwind's spacing scale is different).
    -->
    <div class="p-4">
      <!-- 
        A standard button styled with Tailwind utilities.
        - `w-full`: Replicates `block`.
        - `rounded-md`: Gives it slightly rounded corners.
        - `transition-colors`: For a smooth hover effect.
      -->
      <button class="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 transition-colors">
        Logout
      </button>
    </div>
  </aside>
</template>

<style scoped>
/* 
  While Tailwind encourages utility classes, sometimes a little CSS can be cleaner.
  You could also define these active styles in a custom utility class inside your tailwind.css file.
  
  The `active-class` and `exact-active-class` on <NuxtLink> are very powerful and often
  remove the need for manual class binding.
*/
</style>