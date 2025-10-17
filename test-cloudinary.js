const cloudinary = require('cloudinary').v2;
const https = require('https');

cloudinary.config({
  cloud_name: "ddyc1es5v",
  api_key: "458158127669987",
  api_secret: "a6-YrbGmp_QdGPv3PWqZZWxiWB4",
});

// Download a real image from Replicate
const imageUrl = "https://replicate.delivery/pbxt/5ydOCJtKzqBN7ZvmMKZFKmMZFKs5e8XHy15bvhfrC/out-0.png";

https.get(imageUrl, (res) => {
  const chunks = [];
  res.on('data', (chunk) => chunks.push(chunk));
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    console.log("Downloaded image, size:", buffer.length);
    
    cloudinary.uploader.upload_stream(
      {
        folder: "emojis",
        public_id: "test-upload",
        resource_type: "image",
        format: "png",
      },
      (error, result) => {
        if (error) {
          console.error("CLOUDINARY ERROR:", error);
        } else {
          console.log("SUCCESS:", result.secure_url);
        }
      }
    ).end(buffer);
  });
});
