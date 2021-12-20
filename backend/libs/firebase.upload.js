const admin = require("firebase-admin");
const serviceAccount = require("../test-80d25-firebase-adminsdk-2g5kf-ea3a83fb1a.json");
const {randomUUID} = require('crypto');
const fs = require("fs");
const {GetCount} = require("./middle/uploads");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

exports.UploadToCloud = async (file, filename) => {

    try {
        const count = await GetCount(file.path)
        if (count === 0) return {link: "", count: 0}
        const storageRef = admin.storage().bucket(`gs://test-80d25.appspot.com`);
        const upload = await storageRef.upload(file.path, {
            public: true, destination: `/combos/${filename}`, metadata: {
                firebaseStorageDownloadTokens: randomUUID(),
            }
        });
        await fs.unlinkSync(file.path)
        if (upload) {
            return {link: upload[0].metadata.mediaLink, count}

        } else {
            return {link: "", count: 0}
        }
    } catch (e) {
        console.log(e)
        return {link: "", count: 0}
    }


}
