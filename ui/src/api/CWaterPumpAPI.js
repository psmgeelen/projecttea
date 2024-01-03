import axios from 'axios';

class CWaterPumpAPI {
  constructor({ client=null, URL }) {
    this._client = client || axios.create({ baseURL: URL });
  }

  async start(runTimeMs) {
    const response = await this._client.get('/pour_tea', {
      milliseconds: runTimeMs,
    });
    return response.data;
  }

  async stop() {
    const response = await this._client.get('/stop');
    return response.data;
  }

  async status() {
    const response = await this._client.get('/status');
    return response.data;
  }
}

export default CWaterPumpAPI;
export { CWaterPumpAPI };