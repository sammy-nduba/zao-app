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
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        error.response = { data: errorData, status: response.status };
        throw error;
      }
      return { data: await response.json() };
    } catch (error) {
      throw error;
    }
  }
}