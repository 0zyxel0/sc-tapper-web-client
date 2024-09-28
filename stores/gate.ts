import { defineStore } from 'pinia';
import { useRouter } from 'nuxt/app'
import axios from 'axios'
const router = useRouter()
export const useGateStore = defineStore('gate', {
    state: () => ({
      historyList:[]
    }),
    getters: {
     
    },
    actions: {
      async getGateHistory(){
        try{

        }catch(err){
          console.log(err);
        }
      }
    }
  })
  