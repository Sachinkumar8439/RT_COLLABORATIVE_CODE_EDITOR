import apiRequest from "../API/api";
const BASE_URL = "http://localhost:4000/rtcce/version-1.0";

const createuser = async (route,data) => {

  try {
    const response = await apiRequest("post", `${BASE_URL}${route}`, data);
    return response;
    
  } catch (error) {
    console.error("Error in createProgram:", error.message);
    throw error;
  }
};


const loginuser = async (route,data) => {

  try {
    const response = await apiRequest("post", `${BASE_URL}${route}`, data);
    return response;

  } catch (error) {
    console.error("Error login user:", error.message);
    throw error;
  }
};

const edituser = async (route, userkey, editingdata) => {
  if (!route || !userkey || !editingdata) {
    throw new Error("All parameters (userkey,editingdata) are required.");
  }

  try {
    const response = await apiRequest("patch", `${BASE_URL}${route}`, {
      userkey,
      editingdata,
    });
    return response;
  } catch (error) {
    console.error("Error in createProgram:", error.message);
    throw error;
  }
};

const deleteuser = async (route, userkey) => {
  if (!route || !userkey) {
    throw new Error("All parameters (userkey,) are required.");
  }

  try {
    const response = await apiRequest("delete", `${BASE_URL}${route}`, {
      userkey,
    });
    return response;
  } catch (error) {
    console.error("Error in createProgram:", error.message);
    throw error;
  }
};

const userControllers = {
  loginuser,
  createuser,
  edituser,
  deleteuser,
};

export default userControllers;
