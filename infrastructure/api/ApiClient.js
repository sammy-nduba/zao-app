export class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(endpoint, config = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (config.params) {
      Object.keys(config.params).forEach((key) =>
        url.searchParams.append(key, config.params[key])
      );
    }
    try {
      console.log(`ApiClient.get: Sending request to ${url.toString()}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      console.log(`ApiClient.get: Response status ${response.status} for ${url.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        error.response = { data: errorData, status: response.status };
        throw error;
      }
      const data = await response.json();
      console.log(`ApiClient.get: Response data`, data);
      return { data };
    } catch (error) {
      console.error(`ApiClient.get: Error for ${url.toString()}`, {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      throw error;
    }
  }

  async post(endpoint, body, config = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    try {
      console.log(`ApiClient.post: Sending request to ${url.toString()} with body`, body);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.headers || {}),
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      console.log(`ApiClient.post: Response status ${response.status} for ${url.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        error.response = { data: errorData, status: response.status };
        throw error;
      }
      const data = await response.json();
      console.log(`ApiClient.post: Response data`, data);
      return { data };
    } catch (error) {
      console.error(`ApiClient.post: Error for ${url.toString()}`, {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }
}