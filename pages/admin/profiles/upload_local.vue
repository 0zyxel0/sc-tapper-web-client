<template>
	<div class="p-4">
		<!-- v-card equivalent -->
		<div class="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
			<!-- v-card-text equivalent -->
			<div class="mb-4">
				<!-- v-file-input equivalent -->
				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-700 mb-1">Image</label>
					<div class="mt-1 flex items-center">
						<input
							type="file"
							ref="fileInput"
							@change="onFileChange"
							accept="image/png, image/jpeg, image/bmp"
							class="hidden"
						/>
						<button
							@click="triggerFileInput"
							class="flex-grow px-4 py-2 border border-gray-300 rounded-l-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 normal-case"
						>
							Select File
						</button>
						<span
							class="flex-shrink-0 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm truncate max-w-[50%]"
						>
							{{ selectedFile ? selectedFile.name : 'No file chosen' }}
						</span>
					</div>
				</div>

				<!-- v-btn equivalent -->
				<button
					@click="uploadImage"
					class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors normal-case"
				>
					Upload
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import axios from 'axios';
import { useToast } from 'vue-toastification'; // Import useToast

const file = ref(null); // Seems unused in the current template's logic, could be removed.
const selectedFile = ref(null); // Stores the file selected by the user.
const fileInput = ref(null); // Reference to the hidden file input element.
const toast = useToast(); // Initialize toast

// Function to handle file input change
const onFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

// Function to programmatically trigger the hidden file input
const triggerFileInput = () => {
  fileInput.value.click();
};

// Original uploadImg function, seems unused in template. Kept for completeness.
async function uploadImg() {
  const formData = new FormData();
  formData.append('file', file.value); // Uses 'file.value' which is from handleFileUpload, not onFileChange. Be careful with this.

  const payload = { // This payload structure doesn't match formData usage.
    studentno: "061132",
    lastname: "gomez",
    img: file.value
  };

  try {
    await $fetch('/api/file/uploadLocal', {
      method: 'POST',
      body: formData
    });
    toast.success('File uploaded locally!');
  } catch (error) {
    console.error('Error uploading file locally:', error);
    toast.error('Error uploading file locally: ' + error.message);
  }
}

// Main image upload function
const uploadImage = async () => {
  if (!selectedFile.value) {
    toast.error('Please select a file to upload!');
    return; // Stop execution if no file is selected
  }

  const formData = new FormData();
  formData.append('image', selectedFile.value); // Ensure 'image' matches your backend's expected field name.
  
  try {
    const response = await axios.post('/api/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Image uploaded successfully:', response.data);
    toast.success('Image uploaded successfully!');
    // Optionally, clear the selected file after successful upload
    selectedFile.value = null;
    if (fileInput.value) {
        fileInput.value.value = ''; // Clear the actual file input display
    }

  } catch (error) {
    console.error('Error uploading image:', error);
    toast.error('Error uploading image: ' + (error.response?.data?.message || error.message));
  }
};
</script>

<style scoped>
/* No specific styles needed beyond Tailwind utilities for this component */
/* You might have global styles for Nuxt or specific layouts */
</style>