<template>
  <div>
    <v-card>
      <v-card-text>
        <!-- <input type="file" @change="handleFileUpload" /> -->
        <v-file-input accept="image/png, image/jpeg, image/bmp" label="Image" required
          @change="onFileChange"></v-file-input>
        <!-- <div v-if="uploadResult">
          <p>Upload Successful: {{ uploadResult }}</p>
        </div> -->
        <v-btn @click="uploadImage">Upload</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import axios from 'axios';
const file = ref(null);
const selectedFile = ref(null);

const handleFileUpload = async (event) => {
  file.value = event.target.files[0];
}

async function uploadImg() {

  const formData = new FormData();
  formData.append('file', file.value);
  const payload = {
    studentno: "061132",
    lastname: "gomez",
    img: file.value
  }
  await $fetch('/api/file/uploadLocal', {
    method: 'POST',
    body: formData
  }
  )
}

const onFileChange = (event) => {
  selectedFile.value = event.target.files[0];
}

const uploadImage = async () => {
  if (!selectedFile.value) {
    alert('Please select a file!');
  }

  const formData = new FormData();
  formData.append('image', selectedFile.value);
  
  try {
    const response = await axios.post('/api/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log('Image uploaded successfully:', response.data);

 
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}

</script>

<style></style>