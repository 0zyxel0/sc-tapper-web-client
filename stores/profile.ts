import { defineStore } from 'pinia'
import { useRouter } from 'nuxt/app'
import axios from 'axios'
const router = useRouter()
export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null,
    emergencyContacts: null,
  }),
  getters: {
    myProfile(state) {
      return state.profile
    },
    myEmergencyContacts(state) {
      return state.emergencyContacts
    },
  },
  actions: {
    async getEmergencyContactDetails(profile_publicid: string) {
      const result = await axios.post('/api/profile/emergencyContactDetails', {
        profile_publicid: profile_publicid,
      })
      if (result) {
        console.log(result.data);
        this.emergencyContacts = result.data
      }
    },
  },
})
