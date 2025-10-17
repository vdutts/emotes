const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "ddyc1es5v",
  api_key: "458158127669987",
  api_secret: "a6-YrbGmp_QdGPv3PWqZZWxiWB4",
});

// Test with a simple API call to verify credentials
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error("PING FAILED:", error);
  } else {
    console.log("PING SUCCESS:", result);
  }
});
