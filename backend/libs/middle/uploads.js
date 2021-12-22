const fileExtension = require('file-extension');
const fileSize = require("filesize");
const fs = require("fs");
exports.ValidateCombo = async (req,res,next) => {
try {
    const {file} = req
    const {originalname,mimetype,size,filename} = file

    const ext = fileExtension(originalname);
    if (!file || mimetype !== "text/plain" || ext !== "txt"){
        await fs.unlinkSync(file.path)
        return res.json({status:422,error:"Unprocessable file, Only text files approved"})
    }

    if (size === 0){
        return res.json({status:422,error:"Unprocessable file, Corrupted file"})
    }

    req.upload_name = filename
    req.name = originalname
    req.size = fileSize(size)




    next()
}catch (e) {
    return res.json({status:422,error:"Error while processing combo"})
}
}
exports.ValidateImage = async (req,res,next) => {
    try {
        const {file} = req
        const {originalname,mimetype,size,filename} = file

        const ext = fileExtension(originalname);
        if (!file || mimetype !== "image/jpeg" && mimetype !== "image/png"){
            await fs.unlinkSync(file.path)
            return res.json({status:422,error:"Unprocessable file, Only JPEG and PNG is accepted"})

        }

        if (size === 0){
            return res.json({status:422,error:"Unprocessable file, Corrupted file"})
        }

        req.upload_name = filename
        req.name = originalname
        req.size = fileSize(size)




        next()
    }catch (e) {
        return res.json({status:422,error:"Error while processing Image"})
    }
}


exports.GetCount = (file) =>{
    return new Promise((resolve, reject) => {
        let lineCount = 0;
        fs.createReadStream(file)
            .on("data", (buffer) => {
                let idx = -1;
                lineCount--; // Because the loop will run once for idx=-1
                do {
                    idx = buffer.indexOf(10, idx+1);
                    lineCount++;
                } while (idx !== -1);
            }).on("end", () => {
            resolve(lineCount);
        }).on("error", reject);
    });
}

