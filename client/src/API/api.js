import Swal from "sweetalert2";
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
        if (response.status === 404) {
          // Show a popup if the server returns a 404 error
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Server is busy or not found. Please try again later!",
            confirmButtonText: "Try Again",
            confirmButtonColor: "#ff4b5c",
            background: "#fff",
            color: "#333",
            width: "400px",
            padding: "20px",
            showClass: {
              popup: "animate__animated animate__fadeInDown",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp",
            },
            customClass: {
              popup: "rounded-xl shadow-lg",
              title: "text-red-600 text-2xl font-bold",
              confirmButton: "bg-red-500 text-white rounded-full px-6 py-2 text-lg",
            },
          });
        }
        // throw new Error(
        //   `HTTP Error: ${response.status} ${response.statusText} at ${URL}`
        // );
      }
      const data = await response.json();
      return data; 
    } catch (error) {

      console.error('API Request Error:', error.message);
  
      throw error;
    }
  };

  export default apiRequest;