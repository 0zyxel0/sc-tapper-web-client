<template>
  <v-theme-provider theme="dark">
    <v-app>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-text>
                <v-row justify="center">
                  <v-col cols="12" align="center">
                    <v-card>
                      <v-card-text>
                      <v-row justify="center">
                        <v-col cols="6" md="2" sm="4" xs="6">
                          <span class="nuxt-date">
                          <NuxtTime :datetime="Date.now()" year="numeric" month="long" day="numeric" />
                        </span>
                        </v-col>
                        <v-col cols="6" md="2" sm="4" xs="6">
                          <span class="nuxt-time">
                          <NuxtTime :datetime="date" hourCycle="h12" hour="numeric" minute="numeric" second="numeric" />
                        </span>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    </v-card>
                    <!-- <v-container v-if="!currentProfile">
                    <v-img :width="400" height="400px" aspect-ratio="1/1" cover
                      src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"></v-img>
                  </v-container>
                  <v-container v-else>
                    <v-img :width="400" height="400px" aspect-ratio="1/1" cover
                      :src="currentProfile.profiles.image_url"></v-img>
                  </v-container> -->
                    <v-card v-if="!currentProfile" elevation="0">
                      <v-img class="bg-grey-lighten-2" width="400" height="400" aspect-ratio="1/1"
                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" cover></v-img>
                      <v-card-title class="text-h6">
                        Waiting for Card


                      </v-card-title>
                    </v-card>
                    <v-card v-else elevation="0">
                      <v-img class="bg-grey-lighten-2 img-design" width="400" height="400" aspect-ratio="1/1"
                        :src="currentProfile.profiles.image_url" cover></v-img>
                      <!-- <v-card-title class="text-h6">
                      {{ currentProfile.profiles.studentno }}
                      <br>
                      {{ currentProfile.profiles.first_name }}
                      {{ currentProfile.profiles.last_name }}
                    </v-card-title> -->
                      <v-card width="400" elevation="0">
                        <v-table>
                          <tbody>
                            <tr>
                              <td class="studentno-title">Student No:</td>
                              <td class="studentno-value">{{ currentProfile.profiles.studentno }}</td>
                            </tr>
                            <tr>
                              <td class="student-name-title">Name:</td>
                              <td class="student-name-value">{{ currentProfile.profiles.first_name }} {{
                      currentProfile.profiles.last_name }}</td>
                            </tr>
                          </tbody>
                        </v-table>
                      </v-card>
                    </v-card>

                  </v-col>
                </v-row>
                <!-- <v-row>
                <v-col>
                  <v-btn v-if="!currentProfile" block variant="flat" disabled>Waiting for
                    Card</v-btn>
                  <v-btn v-else color="green" block variant="flat">{{
                    currentProfile.profiles.studentno }}</v-btn>
                </v-col>
              </v-row> -->

              </v-card-text>
            </v-card>

          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" align="center">
            <v-card>
              <v-card-title>
                <v-row>
                  <v-col align="center">
                    <v-form @submit.prevent="handleSubmit" style="opacity: 100%">
                      <v-text-field ref="cardInputRef" v-model="cardid" variant="outlined" label="Card ID"
                        :disabled="isSubmitting" @change="handleSubmit"></v-text-field>
                      <!-- <v-btn :disabled="isSubmitting" type="submit" color="primary">Submit</v-btn> -->
                    </v-form>
                  </v-col>
                </v-row>
              </v-card-title>
              <!-- <v-infinite-scroll direction="horizontal" side="start">
            <template v-for="(item, index) in historyList" :key="item">
              <v-card width="150px">
                <v-img height="100px" :src="item.profile_avatar" contain></v-img>
                <v-card-text>{{ item.profile_publicid || "asdf" }}</v-card-text>
              </v-card>
            </template>
<template v-slot:loading>
              ...
            </template>
</v-infinite-scroll> -->

              <v-infinite-scroll direction="horizontal">
                <template v-for="(item) in historyList" :key="item">
                  <div class="pa-1">
                    <v-card width="100px" class="elevation-0">
                      <v-img height="90px" :src="item.profile_avatar" contain></v-img>
                      <v-card-text>{{ item.profile_publicid || "asdf" }}</v-card-text>
                    </v-card>
                  </div>
                </template>
                <template v-slot:loading>
                  ...
                </template>
              </v-infinite-scroll>
            </v-card>
          </v-col>
        </v-row>



      </v-container>
    </v-app>
  </v-theme-provider>
</template>

<script setup>
import { createClient } from "@supabase/supabase-js";
// Create a single supabase client for interacting with your database
const SUPABASE_URL = "http://localhost:54321";
const supabase = createClient(
  SUPABASE_URL,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
);

const cardid = ref(null);
const currentProfile = ref(null);
const isSubmitting = ref(false);
const cooldownTimer = ref(null);
const historyList = ref([]);
//const historyList = Array.from({ length: 30 }, (k, v) => v + 1)


const submitCooldown = 2000; // 2 seconds in milliseconds
const cardInputRef = ref(null);

async function initialize() {
  try {
    //   Get the Card history on load of the page
    let { data: gate_history, error } = await supabase.from("gate_history").select("id, profileid, profile_publicid, profile_avatar");
    if (gate_history) {
      historyList.value = gate_history;
      //console.log("History List", historyList.value)
    }
  } catch (error) {
    // Handle errors (e.g., console.error or throw an error)
    console.error("Failed to insert document:", error);
    throw error;
  }
}

const date = ref(new Date())
const changeDate = () => {
  date.value = Date.now()
}


async function clearProfileReading() {
  currentProfile.value = null;
}

async function searchCardProfile(id) {
  if (id == "") {
    console.log("No ID Value");
    return;
  }
  const { data: cards, error } = await supabase
    .from("cards")
    .select("*, profiles(*)")
    // Filters
    .eq("cardid", id);
  if (cards) {
    currentProfile.value = cards[0];
    return cards;
  }
}

async function handleSubmit() {
  isSubmitting.value = true;

  // Your form submission logic here
  // (e.g., call an API, handle errors)
  const myProfileDetails = await searchCardProfile(cardid.value);
  if (myProfileDetails) {
    console.log(myProfileDetails);
    console.log("myProfileDetais", myProfileDetails)
  }
  // Simulate successful submission after 1 second
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await clearProfileReading();
  const { data, error } = await supabase
    .from("gate_history")
    .insert([
      {
        cardid: cardid.value,
        profileid: myProfileDetails[0].profileid,
        profile_publicid: myProfileDetails[0].profile_publicid,
        profile_avatar: myProfileDetails[0].profiles.image_url
      }
    ])
    .select();
  if (data) {
    console.log(data);
    console.log("Data", myProfileDetails[0])
  }
  // const response = await database.createDocument("65f3d82c462083be74d6", "65fcc0e0dcd20c23fced", ID.unique(), {
  // 	profile_publicid: "asdfadsfasdfadsf",
  // 	cardid: "asdfasdfasdf",
  // });
  clearInput();
  startCooldown();
}

function clearInput() {
  cardid.value = "";
}

function startCooldown() {
  cooldownTimer.value = setTimeout(() => {
    isSubmitting.value = false;
    cooldownTimer.value = null;
    initialize();
  }, submitCooldown);
}

watch(isSubmitting, () => {
  if (!isSubmitting.value) {
    nextTick(() => {
      if (cardInputRef.value) {
        cardInputRef.value.focus();
      } else {
        console.warn('Ref "cardInputRef" is not available for focusing the input field.');
      }
    });
  }
});

onBeforeUnmount(() => {
  clearTimeout(cooldownTimer.value);
});

onMounted(() => {
  setInterval(() => {
    date.value = Date.now();
  })
  initialize();
  nextTick(() => {
    if (cardInputRef.value) {
      // Check if the ref is available
      cardInputRef.value.focus();
    } else {
      console.warn('Ref "cardInputRef" is not available for focusing the input field.');
    }
  });
});
</script>
<style scoped>
.studentno-title {
  font-size: 16px;
  text-transform: uppercase;
}

.studentno-value {
  font-size: 18px;
  text-transform: uppercase;
  font-weight: bold;
}

.student-name-title {
  font-size: 16px;
  text-transform: uppercase;
}

.student-name-value {
  font-size: 18px;
  text-transform: uppercase;
  font-weight: bold;
}

.img-design {
  border: 5px solid white;
  border-radius: 10px;
}

.nuxt-date {
  font-size: 23px;
  text-transform: uppercase;
}
.nuxt-time {
  font-size: 23px;
  text-transform: uppercase;
}
</style>
