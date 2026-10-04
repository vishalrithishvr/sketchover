import axios from 'axios'
import { toast } from 'react-toastify'

export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
export const currency = '₹'

// Every admin call carries the token in the same header, and reports a failure
// the same way, so pages only deal with the data.
export const api = async (path, body = {}, token, options = {}) => {
    try {
        const isForm = body instanceof FormData
        const { data } = await axios.post(`${backendUrl}${path}`, body, {
            headers: { token, ...(isForm ? {} : { 'Content-Type': 'application/json' }) },
            ...options,
        })
        if (!data.success && data.message && !options.quiet) toast.error(data.message)
        return data
    } catch (error) {
        const message = error?.response?.data?.message || error.message
        if (!options.quiet) toast.error(message)
        return { success: false, message }
    }
}

export const apiGet = async (path) => {
    try {
        const { data } = await axios.get(`${backendUrl}${path}`)
        return data
    } catch (error) {
        return { success: false, message: error.message }
    }
}

// GridFS urls come back relative, so they work whatever host the API is on.
export const mediaSrc = (url) => (!url ? '' : /^https?:/.test(url) ? url : `${backendUrl}${url}`)

export const inr = (n) => `${currency}${Number(n || 0).toLocaleString('en-IN')}`

export const formatDate = (ms) => new Date(ms).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: '2-digit',
})

export const formatDateTime = (ms) => new Date(ms).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
})
