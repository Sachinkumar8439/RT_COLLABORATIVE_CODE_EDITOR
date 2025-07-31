const axios = require("axios");
require("dotenv").config();
exports.CodeOutput = async(req,res)=>{
   try{
        const {program,langCode,userStdin=''} = req.body;

        const options = {
            method: 'POST',
            url: process.env.RAPIDAPI_URL || 'https://judge0-ce.p.rapidapi.com/submissions',
            params: {
              base64_encoded: 'false',
              wait: 'false',
              fields: '*'
            },
            headers:{
              'x-rapidapi-key':  process.env.RAPIDAPI_KEY ,
              'x-rapidapi-host': process.env.RAPIDAPI_HOST ,
              'Content-Type': 'application/json'
            },
            data: {
              language_id: Number(langCode),
              source_code: program,
              stdin: userStdin
            }
          };

          
          try {
            const response = await axios.request(options);
            const options2 = {
              method: 'GET',
              url: `${process.env.RAPIDAPI_URL}/${response.data.token}`,
              params: {
                base64_encoded: 'false',
                fields: '*'
              },
              headers: {
              'x-rapidapi-key':  process.env.RAPIDAPI_KEY ,
              'x-rapidapi-host': process.env.RAPIDAPI_HOST,
              }
            };

            let count = 5;
            console.log("token:",response.data.token);
            let response1 = await axios.request(options2);
            while((response1.data.status.description === "Processing" || response1.data.status.description === "In Queue") && count > 0){
              await new Promise(resolve => setTimeout(resolve, 3000));
              response1 = await axios.request(options2);
              count--;
            }
            console.log(response1);
            return res.json({
              success:true,
              message:'ho gya bhai',
              data:response1.data,
            })
          } catch (error) {
              console.error(error);
          }
      }catch(e){
        console.log(e)
        return res.json({
            success:false,
            message:"niche vala",
            error:e.message,
        })
    }
}






exports.getLanguages=async(req,res) =>{
  try{
    const options = {
      method: 'GET',
      url: 'https://judge0-ce.p.rapidapi.com/languages',
      headers: {
        'x-rapidapi-key':  process.env.RAPIDAPI_KEY ,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
      }
    };
    
    try {
      const response = await axios.request(options);
      return res.json({
        success:true,
        data:response.data,
        message:"Language Fetched Successfully"
      })
    } catch (error) {
      console.error(error);
    }
  }catch(e){
    return res.json({
      success:false,
      error:e.message
    })
  }
}