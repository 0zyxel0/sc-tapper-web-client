<template>
    <v-form @submit.prevent="handleSubmit">
      <v-text-field label="Image File" type="file" accept="image/*" v-model="imageFile" />
      <v-btn type="submit" color="primary">Upload</v-btn>
    </v-form>
  </template>
  
  <script>
  import { useSupabase } from '@supabase/nuxt';
  
  export default {
    setup() {
      const supabase = useSupabase();
      const imageFile = ref(null);
  
      const handleSubmit = async () => {
        if (!imageFile.value) return;
  
        const { data, error } = await supabase.storage
          .from('mybucket')
          .upload(imageFile.value.name, imageFile.value);
  
        if (error) {
          console.error(error);
          return;
        }
  
        console.log('Image uploaded successfully:', data.publicUrl);
      };
  
      return { supabase, imageFile, handleSubmit };
    },
  };
  </script>