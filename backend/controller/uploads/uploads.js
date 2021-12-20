const {UploadToCloud} = require("../../libs/firebase.upload");
const Combo = require("../../model/combo");
exports.UploadCombo = async (req, res) => {
    try {
        // Upload
        const {
            upload_name, name, size,file
        } = req

        const {link,count} = await UploadToCloud(file,upload_name)

        if (link === "" || count === "") return res.json({status:422,error:"File Empty"})

        const {_id} = await Combo.create({by:req.id,url:link,ip:req.ip_info,isValid:true,size,original_name:name,uploaded_name:upload_name})
        res.json({
            status:200,data:_id
        })


    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}