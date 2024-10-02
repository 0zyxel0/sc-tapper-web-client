import { defineStore } from 'pinia'
import { useRouter } from 'nuxt/app'
import axios from 'axios'
// Composable utility function import
const { getBackendUrl, formatCurImageUrl ,getImageServerUrl} = useUtils()
const router = useRouter()
export const useGateStore = defineStore('gate', {
  state: () => ({
    historyList: [],
  }),
  getters: {
    getGateHistoryList(state) {
      return state.historyList
    },
  },
  actions: {
    async getGateHistory() {
      try {
        const myBase = await getImageServerUrl()
        const result = await axios.get('/api/gate/history')
        if (result) {
          this.historyList = result.data.map((item) => {
            item.profile_avatar = myBase+item.profile_avatar
            return item
          })
          return this.historyList // Return the updated history list
        }
      } catch (err) {
        console.log(err)
      }
    },
  },
})
