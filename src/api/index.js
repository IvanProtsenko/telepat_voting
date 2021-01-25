import axios from 'axios';

//v1.0
export const apiInstance = axios.create({
  baseURL: "http://localhost:8102"
});
apiInstance.defaults.headers.common['Authorization'] = localStorage.getItem('token');

export default {
    async sendConfig(data) {
        return await apiInstance.post(`/send_config`, data);
    }
}