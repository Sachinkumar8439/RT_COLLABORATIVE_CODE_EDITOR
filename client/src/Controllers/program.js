import apiRequest from "../API/api";

const BASE_URL = "http://localhost:4000/rtcce/version-1.0";

const saveProgram = async (
  route,
  token,
  fileName, 
  extension,
  code,
  id ,
) => {
  console.log("code is ",code," id ",id,token)
  if (!route || !token ) {
    throw new Error("All parameters are required.",token,code);
  }
  console.log(fileName, extension, id);
  try {
    const response = await apiRequest("post", `${BASE_URL}${route}`, {
      token,
      fileName,
      extension,
      code,
      id,
    });
    return response;
  } catch (error) {
    console.error("Error in createProgram:", error.message);
    throw error;
  }
};

const deleteProgram = async (route, userKey, programkey) => {
  if (!route || !userKey || !programkey) {
    throw new Error("All parameters (userKey, programkey) are required.");
  }

  try {
    const response = await apiRequest("delete", `${BASE_URL}${route}`, {
      userKey,
      programkey,
    });
    return response;
  } catch (error) {
    console.error("Error in createProgram:", error.message);
    throw error;
  }
};

// const saveProgram = async (route, userKey, programkey, updatingdata) => {
//   if (!route || !userKey || !programkey || !updatingdata) {
//     throw new Error(
//       "All parameters (userKey,programkey, updatingdata) are required."
//     );
//   }

//   try {
//     const response = await apiRequest("post", `${BASE_URL}${route}`, {
//       userKey,
//       programkey,
//       updatingdata,
//     });
//     return response;
//   } catch (error) {
//     console.error("Error in saveProgram:", error.message);
//     throw error;
//   }
// };

const loadPrograms = async (route, token) => {
  if (!route) {
    throw new Error("All parameters (userKey,) are required.");
  }
  console.log("token arha hai", token);

  try {
    const response = await apiRequest("post", `${BASE_URL}${route}`, {
      token: token,
    });
    return response;
  } catch (error) {
    console.error("Error in saveProgram:", error.message);
    throw error;
  }
};

const getoutput = async (route, program, langCode, userStdin) => {
  console.log("program",program,langCode,userStdin)
  if (!route || !program ) {
    throw new Error("All parameters (userKey,) are required.");
  }

  // alert("userStdnin:",userStdin);

  try {
    const response = await apiRequest("post", `${BASE_URL}${route}`, {
      program,
      langCode,
      userStdin,
    });
    return response;
  } catch (error) {
    console.error("Error in saveProgram:", error.message);
    throw error;
  }
};

const getlanguages = async (route) => {
  if (!route) {
    throw new Error("All parameters are required.");
  }

  try {
    const response = await apiRequest("get", `${BASE_URL}${route}`);

    console.log(
      "Hello i am under getlanguage-----------------------",
      response.data
    );
    return response;
  } catch (error) {
    console.error("Error in saveProgram:", error.message);
    throw error;
  }
};

const getlink = async (route, programId) => {
  if (!route || !programId) {
    throw new Error("All parameters (userKey, programkey) are required.");
  }

  try {
    const response = await apiRequest("post", `${BASE_URL}${route}`, {
      programId,
     
    });
    return response;
  } catch (error) {
    console.error("Error in getlink:", error.message);
    throw error;
  }
};

const terminatelink = async (route, programId) => {
  if (!route || !programId ) {
    throw new Error("All parameters (route, programid) are required.");
  }

  try {
    const response = await apiRequest("post", `${BASE_URL}${route}`, {
      programId
  });
    return response;
  } catch (error) {
    console.error("Error in getlink:", error.message);
    throw error;
  }
};

const programControllers = {
  // createProgram,
  deleteProgram,
  saveProgram,
  loadPrograms,
  getoutput,
  getlanguages,
  terminatelink,
  getlink,
};

export default programControllers;
