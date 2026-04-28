const crypto = require("crypto");
require("dotenv").config();

const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

const ensureCloudinaryConfig = () => {
  const missing = Object.entries(cloudinaryConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing Cloudinary environment variables: ${missing.join(", ")}`
    );
  }
};

const createSignature = (params = {}) => {
  const normalizedParams = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${normalizedParams}${cloudinaryConfig.apiSecret}`)
    .digest("hex");
};

const uploadToCloudinary = async ({
  buffer,
  mimetype,
  folder,
  resourceType = "image",
}) => {
  ensureCloudinaryConfig();

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createSignature({ folder, timestamp });
  const extension = mimetype?.split("/")[1] || "bin";
  const uploadName = `upload-${Date.now()}.${extension}`;
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${resourceType}/upload`;

  const form = new FormData();
  form.append("file", new Blob([buffer], { type: mimetype }), uploadName);
  form.append("api_key", cloudinaryConfig.apiKey);
  form.append("timestamp", timestamp);
  form.append("signature", signature);

  if (folder) {
    form.append("folder", folder);
  }

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: form,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }

  return data;
};

module.exports = {
  cloudinaryConfig,
  createSignature,
  uploadToCloudinary,
};
