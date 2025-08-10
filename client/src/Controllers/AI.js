import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
let attempts = localStorage.getItem("count") ||  0;
export const handleGenerateCode = async (prompt,content) => {
 if (localStorage.getItem("cooldownUntil")) {
  const cooldownUntil = parseInt(localStorage.getItem("cooldownUntil"), 10);
  
  if (Date.now() >= cooldownUntil) {
    localStorage.removeItem("cooldownUntil"); 
    attempts=0;
  }else{
     return {success:false,message:"wait for cool down expire"}
  }
}
  if(attempts>5){
    const next30Min = Date.now() + (30 * 60 * 1000); 
    localStorage.setItem("cooldownUntil", next30Min.toString());
    return {success:false,message:"your limit exceed wait for 30min"}
  }
  if (!prompt.trim()) return;
  console.log(prompt)
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(
      `You are a coding assistant. Return only code unless explanation is asked. give code in single file only.
      ${content} if i talking about above content then remember that if not then follow bellow prompt ${prompt}`
    );
    attempts++;
    localStorage.setItem("count",attempts)
    //  console.log("full result", result);
    const aiCode = result.response.text();
    const match = aiCode.match(/```[a-z]*\n([\s\S]*?)```/);
    // console.log("ai code",aiCode)
    // console.log("match",match)
    return {success:true,message:"success",code:match ? match[1] : aiCode}
  } catch (err) {
    console.error(err);
    return {success:false,message:err.message}
  }
};
