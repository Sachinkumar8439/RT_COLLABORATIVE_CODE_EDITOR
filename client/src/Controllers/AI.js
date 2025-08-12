// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Initialize Gemini client
// const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
// let attempts = localStorage.getItem("count") ||  0;
// export const handleGenerateCode = async (prompt,content) => {
//  if (localStorage.getItem("cooldownUntil")) {
//   const cooldownUntil = parseInt(localStorage.getItem("cooldownUntil"), 10);
  
//   if (Date.now() >= cooldownUntil) {
//     localStorage.removeItem("cooldownUntil"); 
//     attempts=0;
//   }else{
//      return {success:false,message:"wait for cool down expire"}
//   }
// }
//   if(attempts>5){
//     const next30Min = Date.now() + (30 * 60 * 1000); 
//     localStorage.setItem("cooldownUntil", next30Min.toString());
//     return {success:false,message:"your limit exceed wait for 30min"}
//   }
//   if (!prompt.trim()) return;
//   console.log(prompt)
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
//     const result = await model.generateContent(
//       `You are a coding assistant. Return only code unless explanation is asked. give code in single file only.
//       ${content} if i talking about above content then remember that if not then follow bellow prompt ${prompt}`
//     );
//     attempts++;
//     localStorage.setItem("count",attempts)
//     //  console.log("full result", result);
//     const aiCode = result.response.text();
//     const match = aiCode.match(/```[a-z]*\n([\s\S]*?)```/);
//     // console.log("ai code",aiCode)
//     // console.log("match",match)
//     return {success:true,message:"success",code:match ? match[1] : aiCode}
//   } catch (err) {
//     console.error(err);
//     return {success:false,message:err.message}
//   }
// };














import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
let attempts = localStorage.getItem("count") || 0;

export const handleGenerateCode = async (prompt, content, setcontent) => {
  // Cooldown check
  // if (localStorage.getItem("cooldownUntil")) {
  //   const cooldownUntil = parseInt(localStorage.getItem("cooldownUntil"), 10);

  //   if (Date.now() >= cooldownUntil) {
  //     localStorage.removeItem("cooldownUntil");
  //     attempts = 0;
  //   } else {
  //     return { success: false, message: "wait for cool down expire" };
  //   }
  // }

  // Attempts limit check
  // if (attempts > 5) {
  //   const next30Min = Date.now() + 30 * 60 * 1000;
  //   localStorage.setItem("cooldownUntil", next30Min.toString());
  //   return { success: false, message: "your limit exceed wait for 30min" };
  // }

  if (!prompt.trim()) return;

try {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const stream = await model.generateContentStream({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `You are a coding assistant. Generate and return only code unless explanation is asked. Give code in a single file only.
            ${content} If I am talking about above content then remember that; if not then full fill only follow below prompt: ${prompt}`
          }
        ]
      }
    ]
  });

  attempts++;
  localStorage.setItem("count", attempts);

  let fullText = "";
  let finalCode = "";

  for await (const chunk of stream.stream) {
    const chunkText = chunk.text();
    // if (!chunkText.trim()) continue; 
    fullText += chunkText;
    const match = fullText.match(/```[a-z]*\n([\s\S]*?)```/);
    const toSet = match ? match[1] : fullText.replace(/```/g, "");
    if(toSet.trim()){
       finalCode = toSet; 
      setcontent(toSet);
    }
    
   
  }
  return { success: true, message: "success", code: finalCode || content };

} catch (err) {
  console.error(err);
  return { success: false, message: err.message };
}

};
