import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Initialize AWS services
export const s3 = new AWS.S3();
export const sns = new AWS.SNS();
export const ses = new AWS.SES();
export const lambda = new AWS.Lambda();

// S3 operations
export const uploadToS3 = async (file, key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

// SNS operations
export const sendSMSNotification = async (phoneNumber, message) => {
  const params = {
    Message: message,
    PhoneNumber: phoneNumber
  };

  try {
    await sns.publish(params).promise();
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

// SES operations
export const sendEmailNotification = async (to, subject, body) => {
  const params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: process.env.SES_FROM_EMAIL
  };

  try {
    await ses.sendEmail(params).promise();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Lambda operations
export const invokeLambda = async (functionName, payload) => {
  const params = {
    FunctionName: functionName,
    Payload: JSON.stringify(payload)
  };

  try {
    const response = await lambda.invoke(params).promise();
    return JSON.parse(response.Payload);
  } catch (error) {
    console.error('Error invoking Lambda:', error);
    throw error;
  }
}; 