const axios = require("axios");
exports.CodeOutput = async(req,res)=>{
   try{
        const {program,langCode,userStdin=''} = req.body;

        const options = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions',
            params: {
              base64_encoded: 'false',
              wait: 'false',
              fields: '*'
            },
            headers:{
              'x-rapidapi-key': '391a15ac0fmsh6a850533304fb89p1463afjsn2e6e511c55c3',
              'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
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
              url: `https://judge0-ce.p.rapidapi.com/submissions/${response.data.token}`,
              params: {
                base64_encoded: 'false',
                fields: '*'
              },
              headers: {
                'x-rapidapi-key': '391a15ac0fmsh6a850533304fb89p1463afjsn2e6e511c55c3',
                'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
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
        'x-rapidapi-key': '391a15ac0fmsh6a850533304fb89p1463afjsn2e6e511c55c3',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
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