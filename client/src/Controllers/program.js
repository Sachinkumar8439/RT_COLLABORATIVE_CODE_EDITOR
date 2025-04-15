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
  if (!route || !token ) {
    throw new Error("All parameters are required.",token,code);
  }
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
    throw error;
  }
};


const loadPrograms = async (route, token) => {
  if (!route) {
    throw new Error("All parameters (userKey,) are required.");
  }

  try {
    const response = await apiRequest("post", `${BASE_URL}${route}`, {
      token: token,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const getoutput = async (route, program, langCode, userStdin) => {
  if (!route || !program ) {
    throw new Error("All parameters (program,) are required.");
  }


  try {
    const response = await apiRequest("post", `${BASE_URL}${route}`, {
      program,
      langCode,
      userStdin,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const getlanguages = async (route) => {
  if (!route) {
    throw new Error("All parameters are required.");
  }

  try {
    const response = await apiRequest("get", `${BASE_URL}${route}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const getlink = async (route, programId,token) => {
  if (!route || !programId) {
    throw new Error("All parameters (userKey, programkey) are required.");
  }

  try {
    const response = await apiRequest("post", `${BASE_URL}${route}`, {
      programId,
      token
     
    });
    return response;
  } catch (error) {
    console.error("Error in getlink:", error.message);
    throw error;
  }
};

const checklink = async (route, programId,userId) => {
  if (!route || !programId || !userId) {
    throw new Error("All parameters (userKey, programId,userId) are required.");
  }

  try {
    const response = await apiRequest("post", `${BASE_URL}${route}`, {
      programId,
      userId,
     
    });
    return response;
  } catch (error) {
    console.error("Error in getlink:", error.message);
    throw error;
  }
};

const verifymemeber = async (route, programId,code,username) => {
  if (!route || !programId || !code) {
    throw new Error("All parameters (userKey, programId,userId) are required.");
  }

  try {
    const response = await apiRequest("post", `${BASE_URL}${route}`, {
      programId,
      username,
      code,
     
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
  checklink,
  verifymemeber
};

export default programControllers;
