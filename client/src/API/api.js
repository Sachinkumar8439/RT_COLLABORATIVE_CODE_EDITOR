const apiRequest = async (method = 'GET', URL, body = null, headers = {}) => {
    try {
      const defaultHeaders = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
  
      const finalHeaders = { ...defaultHeaders, ...headers };
  
      const options = {
        method: method.toUpperCase(), 
        headers: finalHeaders,
      };

      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase()) && body) {
        options.body = JSON.stringify(body); 
      }
  
      
      const response = await fetch(URL, options);
  
      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText} at ${URL}`
        );
      }
      const data = await response.json();
      return data; 
    } catch (error) {

      console.error('API Request Error:', error.message);
  
      throw error;
    }
  };

  export default apiRequest;