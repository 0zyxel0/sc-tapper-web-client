<template>
    <div class="pa-4">
      <h1 class="text-h5 mb-4">Time In / Time Out Report</h1>
  
      <!-- Date Picker -->
      <v-row class="mb-4" align="center">
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="selectedDate"
            label="Select Date"
            type="date"
            @change="fetchReportData"
          ></v-text-field>
        </v-col>
      </v-row>
  
      <!-- Action Buttons -->
      <v-row class="mb-4">
        <v-btn @click="downloadCSV">Download as CSV</v-btn>
        <v-btn @click="downloadExcel">Download as Excel</v-btn>
      </v-row>
  
      <!-- Data Table -->
      <v-data-table
        :headers="headers"
        :items="reportData"
        :items-per-page="5"
        class="elevation-1"
      >
        <template #item.avatar="{ item }">
          <v-avatar size="40">
            <v-img :src="item.image_url" :alt="item.first_name" />
          </v-avatar>
        </template>
  
        <template #item.name="{ item }">
          {{ item.first_name }} {{ item.last_name }}
        </template>
  
        <template #item.time_in="{ item }">
          {{ formatDate(item.time_in) }}
        </template>
  
        <template #item.time_out="{ item }">
          {{ formatDate(item.time_out) }}
        </template>
      </v-data-table>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { useFetch } from '#app'
  import * as XLSX from 'xlsx'
  
  definePageMeta({
    layout: "admin",
  })
  
  const selectedDate = ref(new Date().toISOString().slice(0, 10)) // default to today
  const reportData = ref([])
  
  const headers = [
    { title: "Avatar", key: "avatar", sortable: false },
    { title: "Name", key: "name" },
    { title: "Student No.", key: "studentno" },
    { title: "Time In", key: "time_in" },
    { title: "Time Out", key: "time_out" },
  ]
  
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleString()
  }
  
  async function fetchReportData() {
    if (!selectedDate.value) return
  
    try {
      const { data, error } = await useFetch(
        `http://localhost:1337/api/gate-history/generate-time-in-out-history`,
        {
          query: { date: selectedDate.value },
        }
      )
  
      if (error.value) {
        console.error("Failed to fetch report:", error.value)
        reportData.value = []
      } else {
        reportData.value = data.value || []
      }
    } catch (err) {
      console.error("Error fetching report:", err)
      reportData.value = []
    }
  }
  
  // Initial fetch
  onMounted(fetchReportData)
  
  // CSV Download function
  function downloadCSV() {
    const rows = reportData.value.map(item => ({
      Avatar: item.image_url,
      Name: `${item.first_name} ${item.last_name}`,
      'Student No': item.studentno,
      'Time In': formatDate(item.time_in),
      'Time Out': formatDate(item.time_out)
    }))
    
    let csvContent = "data:text/csv;charset=utf-8,"
    const headersRow = ["Avatar", "Name", "Student No", "Time In", "Time Out"].join(",") + "\n"
    csvContent += headersRow
    rows.forEach(row => {
      const rowValues = Object.values(row).join(",")
      csvContent += rowValues + "\n"
    })
  
    // Create a download link and trigger it
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "report.csv")
    link.click()
  }
  
  // Excel Download function
  function downloadExcel() {
    const ws = XLSX.utils.json_to_sheet(reportData.value.map(item => ({
      Avatar: item.image_url,
      Name: `${item.first_name} ${item.last_name}`,
      'Student No': item.studentno,
      'Time In': formatDate(item.time_in),
      'Time Out': formatDate(item.time_out)
    })))
  
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Report")
    XLSX.writeFile(wb, "report.xlsx")
  }
  </script>
  
  <style scoped>
  .v-data-table {
    border-radius: 12px;
    overflow: hidden;
  }
  </style>
  