const aws = require('aws-sdk');

class S3Uploader {
  static sign(req) {
    aws.config.region = 'us-east-1';

    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read',
    };

    console.log(s3Params);

    return new Promise((resolve, reject) => {
      s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        const returnData = {
          signedRequest: data,
          url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`,
        };
        resolve(returnData);
      });
    });
  }
}

module.exports = S3Uploader;
