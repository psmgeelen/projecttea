class CWaterPumpAPIImpl {
  constructor({ client, currentTime=null }) {
    this._client = client;
    this._currentTime = currentTime || Date.now;
  }

  async _execute(callback) {
    const start = this._currentTime();
    const response = await callback();
    const end = this._currentTime();
    return { response, requestTime: end - start };
  }

  async start(runTimeMs) {
    const { response: { data }, requestTime } = await this._execute(
      async () => await this._client.get('/pour_tea', { params: { milliseconds: runTimeMs } })
    );
    return this.preprocessResponse({ response: data, requestTime });
  }

  async stop() {
    const { response: { data }, requestTime } = await this._execute(
      async () => await this._client.get('/stop', { params: {} })
    );
    return this.preprocessResponse({ response: data, requestTime });
  }

  async status() {
    const { response: { data }, requestTime } = await this._execute(
      async () => await this._client.get('/status', { params: {} })
    );
    return this.preprocessResponse({ response: data, requestTime });
  }
  ///////////////////////
  // helper functions
  preprocessResponse({ response, requestTime }) {
    if(null == response) return null;
    if('error' in response) {
      throw new Error(response.error);
    }
    // make a deep copy of response
    response = JSON.parse(JSON.stringify(response));
    // normal response
    // convert "water threshold" to "waterThreshold"
    response.waterThreshold = response["water threshold"];
    delete response["water threshold"];
  
    // convert "time left" to "timeLeft" and adjust time
    response.pump.timeLeft = response.pump["time left"];
    delete response.pump["time left"];

    // adjust time by network delay
    const oneWayTripTime = Math.round(requestTime / 2);
    response.time += oneWayTripTime;
    response.pump.timeLeft -= oneWayTripTime;
  
    const now = this._currentTime();
    response.updated = now;
    response.pump.estimatedEndTime = response.pump.timeLeft + now;
    return response;
  }  
}

export default CWaterPumpAPIImpl;
export { CWaterPumpAPIImpl };