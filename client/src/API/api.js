import Swal from "sweetalert2";

const checkOnlineStatus = async () => {
  try {
    const response = await fetch('https://www.google.com/', {
      method: 'HEAD',
      mode: 'no-cors',
    });
    return true;
  } catch {
    return false; 
  }
};

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
     const isonline = await checkOnlineStatus()
      if(!isonline)
      {
        console.log("i am offline now");
        Swal.fire({
          icon: "error",
          title: "Oops... you are Offline",
          text: "check your internet connection!",
          confirmButtonText: "okay",
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

        return {success:false ,message:'you are offline'}
      }
      const response = await fetch(URL, options);
  
      if (!response.ok) {
        if (response.status === 404) {
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

      }
      const data = await response.json();
      return data; 
    } catch (error) {

      console.error('API Request Error:', error.message);
  
      throw error;
    }
  };

  export default apiRequest;
