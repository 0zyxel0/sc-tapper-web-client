<template>
  <div class="p-4 sm:p-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

    <div class="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Upload Encrypted Configuration</h2>
      <p class="text-gray-600 mb-6">
        Upload a JSON file containing encrypted configuration values to update your backend settings.
        This file should contain sensitive data and must be correctly formatted.
      </p>

      <form @submit.prevent="handleFileUpload">
        <div class="mb-5">
          <label for="jsonFile" class="block text-sm font-medium text-gray-700 mb-2">
            Select JSON File
          </label>
          <div class="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L40 32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only"
                         accept=".json" @change="handleFileChange" ref="fileInputRef">
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">
                JSON files only (up to 10MB)
              </p>
              <p v-if="selectedFile" class="text-sm font-medium text-gray-700 mt-2">
                Selected: <span class="text-indigo-600">{{ selectedFile.name }}</span>
              </p>
            </div>
          </div>
        </div>

        <div v-if="uploadError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline ml-2">{{ uploadError }}</span>
        </div>

        <div v-if="uploadStatus" :class="['px-4 py-3 rounded relative mb-4', uploadStatus === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-blue-100 border border-blue-400 text-blue-700']" role="alert">
          <strong class="font-bold">Info!</strong>
          <span class="block sm:inline ml-2">{{ uploadStatus === 'success' ? 'File uploaded successfully!' : 'Uploading file...' }}</span>
        </div>

        <button
          type="submit"
          :disabled="!selectedFile || uploading"
          class="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
          :class="{ 'opacity-50 cursor-not-allowed': !selectedFile || uploading }"
        >
          <span v-if="uploading" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
          {{ uploading ? 'Uploading...' : 'Upload Configuration' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

definePageMeta({
  layout: "admin",
});

// State variables
const selectedFile = ref<File | null>(null);
const uploading = ref(false);
const uploadStatus = ref<'success' | 'error' | 'uploading' | ''>('');
const uploadError = ref<string | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null); // Ref to clear the file input

// Function to handle file selection
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    // Basic client-side validation for file type and size
    if (file.type !== 'application/json') {
      uploadError.value = 'Please select a valid JSON file.';
      selectedFile.value = null;
      if (fileInputRef.value) fileInputRef.value.value = ''; // Clear input
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      uploadError.value = 'File size exceeds 10MB limit.';
      selectedFile.value = null;
      if (fileInputRef.value) fileInputRef.value.value = ''; // Clear input
      return;
    }

    selectedFile.value = file;
    uploadError.value = null; // Clear any previous error
    uploadStatus.value = ''; // Clear previous status
  } else {
    selectedFile.value = null;
    uploadError.value = null;
    uploadStatus.value = '';
  }
};

// Function to handle file upload
const handleFileUpload = async () => {
  if (!selectedFile.value) {
    uploadError.value = 'No file selected for upload.';
    return;
  }

  uploading.value = true;
  uploadStatus.value = 'uploading';
  uploadError.value = null;

  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      const fileContent = e.target?.result as string;
      const parsedJson = JSON.parse(fileContent);

      // --- IMPORTANT: Replace this with your actual API endpoint for uploading ---
      // Example using Nuxt's useFetch. Adjust URL and body structure as per your backend API.
      // You might need to import useUtils if you have getBackendUrl()
      // const backendUrl = await useUtils().getBackendUrl();
      const uploadUrl = '/api/settings/upload-config'; // Example: Your Nuxt API route or direct backend URL

      const { error } = await useFetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers if needed, e.g., 'Authorization': `Bearer ${yourAuthToken}`
        },
        body: parsedJson, // Send the parsed JSON object
      });

      if (error.value) {
        uploadError.value = error.value.data?.message || 'Failed to upload file to backend.';
        uploadStatus.value = 'error';
      } else {
        uploadStatus.value = 'success';
        selectedFile.value = null; // Clear selected file
        if (fileInputRef.value) fileInputRef.value.value = ''; // Clear the input field
      }

    } catch (parseError: any) {
      uploadError.value = `Error parsing JSON file: ${parseError.message}`;
      uploadStatus.value = 'error';
    } finally {
      uploading.value = false;
    }
  };

  reader.onerror = () => {
    uploadError.value = 'Failed to read file.';
    uploadStatus.value = 'error';
    uploading.value = false;
  };

  reader.readAsText(selectedFile.value);
};
</script>

<style scoped>
/* Spinner from your previous components */
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

/* Hide default file input */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>