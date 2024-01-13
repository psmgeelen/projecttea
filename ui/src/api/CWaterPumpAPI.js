import axios from 'axios';
import { CWaterPumpAPIImpl } from './CWaterPumpAPIImpl.js';

// helper function to preprocess the API host
function preprocessApiHost(apiHost) {
  let url = apiHost;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }
  if (!url.endsWith('/')) url += '/';
  return url;
}

class CWaterPumpAPI {
  constructor({ URL }) {
    // quick hack to add headers to axios client
    // this is needed to prevent CORS error
    const axiosClient = axios.create({ baseURL: preprocessApiHost(URL) });
    const fakeClient = {
      get: async (path, params) => {
        params = params || {};
        params.headers = params.headers || {};
        params.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        return await axiosClient.get(path, params);
      }
    };
    this._impl = new CWaterPumpAPIImpl({
      client: fakeClient,
    });
  }

  async start(runTimeMs) { return await this._impl.start(runTimeMs); }
  async stop() { return await this._impl.stop(); }
  async status() { return await this._impl.status(); }
}

export default CWaterPumpAPI;
export { CWaterPumpAPI };