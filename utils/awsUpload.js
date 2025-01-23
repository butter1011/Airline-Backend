const AWS = require("aws-sdk");
require("dotenv").config();
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadFileToS3 = async (fileBuffer, fileName) => {
  const key = `${fileName}`;

  const uploadParams = {
    Bucket: "airsharereview", //airsharereview
    Key: key,
    Body: fileBuffer,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.log("Error", err);
        reject(err);
      }
      if (data) {
        const cloudfrontUrl = `${process.env.CLOUDFRONT_URL}/${key}`;
        console.log("Uploaded in", cloudfrontUrl);
        resolve(cloudfrontUrl);
      }
    });
  });

};
module.exports = { uploadFileToS3 };
