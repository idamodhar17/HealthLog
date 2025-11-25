import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('healthlog_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('healthlog_token');
      localStorage.removeItem('healthlog_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  verifyEmail: (data: { email: string; otp: string }) =>
    api.post('/auth/verify-email-otp', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  resendOTP: (email: string) =>
    api.post('/auth/resend-otp', { email }),
};

// Records APIs
export const recordsAPI = {
  getAll: () => api.get('/records/all'),
  upload: (formData: FormData) =>
    api.post('/records/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getById: (id: string) => api.get(`/records/${id}`),
  delete: (id: string) => api.delete(`/records/${id}`),
};

// OCR API
export const ocrAPI = {
  extract: (formData: FormData) =>
    api.post('/ocr/extract', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Timeline API
export const timelineAPI = {
  get: () => api.get('/timeline'),
};

// QR APIs
export const qrAPI = {
  generateDoctor: () => api.post('/qr/generate'),
  generateHospital: () => api.post('/hospital/generate'),
};

// Doctor APIs
export const doctorAPI = {
  viewPatient: (token: string) => api.get(`/doctor/view/${token}`),
  addNote: (token: string, data: {
    doctorName: string;
    diagnosis: string;
    recommendation: string;
    followUpDate?: string;
  }) => api.post(`/notes/add/${token}`, data),
};

// Hospital APIs
export const hospitalAPI = {
  upload: (token: string, formData: FormData) =>
    api.post(`/hospital/upload/${token}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ICE (Emergency) APIs
export const iceAPI = {
  saveProfile: (data: {
    name: string;
    bloodGroup: string;
    allergies: string[];
    medicalConditions: string;
    currentMedications: string;
    emergencyContacts: Array<{
      name: string;
      relation: string;
      phone: string;
    }>;
  }) => api.post('/ice/save', data),
  getProfile: () => api.get('/ice/profile'),
  generateQR: () => api.post('/ice/generate'),
  viewPublic: (token: string) => api.get(`/ice/view/${token}`),
};

// Audit API
export const auditAPI = {
  getLogs: () => api.get('/audit'),
};

export default api;
