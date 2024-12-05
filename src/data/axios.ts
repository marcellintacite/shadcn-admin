import axios from 'axios'

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your JSON Server URL
  timeout: 10000, // Optional: Set a timeout in milliseconds
  headers: {
    'Content-Type': 'application/json', // Default content type for JSON data
  },
})

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Directly return the response if successful
    return response
  },
  (error) => {
    // Handle response errors
    if (error.response?.status === 401) {
      // Optionally redirect to login or handle unauthorized errors
      console.error('Unauthorized! Redirecting to login...')
      window.location.href = '/' // Adjust this based on your app's routing
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
