import axios from "axios";

const API = process.env.REACT_APP_API_URL;

// Send the conversation (and optional location) to the HealthBot assistant.
// messages: [{ role: "user" | "assistant", text: string }]
// location: { lat, lng } | null
export const sendChat = async (messages, location = null) => {
  const { data } = await axios.post(
    `${API}/api/v1/assistant/chat`,
    { messages, location },
    { headers: { "Content-Type": "application/json" } }
  );
  return data; // { success, reply, doctors }
};
