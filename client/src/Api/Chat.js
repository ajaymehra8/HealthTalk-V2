import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const authHeaders = (token, contentType = "application/json") => ({
  "Content-Type": contentType,
  authorization: `Bearer ${token}`,
});

// Authorized message history for a paid appointment.
export const getMessages = async (bookingId, token) => {
  const { data } = await axios.get(
    `${API}/api/v1/chat/${bookingId}/messages`,
    { headers: authHeaders(token) }
  );
  return data.messages || [];
};

// Send an encrypted-at-rest text message.
export const sendMessage = async (bookingId, text, token) => {
  const { data } = await axios.post(
    `${API}/api/v1/chat/${bookingId}/messages`,
    { text },
    { headers: authHeaders(token) }
  );
  return data.message;
};

// Upload a document; the server encrypts it before storing.
export const uploadDocument = async (bookingId, file, token) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axios.post(
    `${API}/api/v1/chat/${bookingId}/document`,
    formData,
    { headers: authHeaders(token, "multipart/form-data") }
  );
  return data.message;
};

// Conversation list (paid appointments with previews + unread counts).
export const getConversations = async (token) => {
  const { data } = await axios.get(`${API}/api/v1/chat/conversations`, {
    headers: authHeaders(token),
  });
  return data.conversations || [];
};

// Download a shared document through the decrypting proxy and return an object URL.
export const downloadDocument = async (messageId, token) => {
  const response = await axios.get(`${API}/api/v1/chat/document/${messageId}`, {
    headers: { authorization: `Bearer ${token}` },
    responseType: "blob",
  });
  return window.URL.createObjectURL(response.data);
};
