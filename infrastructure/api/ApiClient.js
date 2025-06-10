import axios from 'axios';

export class ApiClient {
  constructor(baseURL, apiKey = '') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'X-Api-Key': apiKey }),
      },
    });
  }

  async get(url) {
    try {
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`API GET error: ${error.message}`);
    }
  }

  async post(url, data) {
    try {
      const response = await this.client.post(url, data);
      return response.data;
    } catch (error) {
      throw new Error(`API POST error: ${error.message}`);
    }
  }
}