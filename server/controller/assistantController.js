const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../model/userModel");
require("dotenv").config();

/*
 * Free AI assistant for HealthTalk, powered by Google Gemini's free tier.
 * Get a free API key (no credit card) at https://aistudio.google.com/apikey
 * and put it in server/.env as GEMINI_API_KEY.
 *
 * The assistant can call a `find_doctors` tool that queries the real doctor
 * data in MongoDB — including a geospatial "nearest doctor" search when the
 * visitor shares their location.
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

const SYSTEM_PROMPT = `You are "HealthBot", the friendly assistant for HealthTalk — an online platform that connects patients with doctors.

What HealthTalk lets users do:
- Find Doctors: browse and search doctors by specialization, rating, price, or location.
- View a doctor's profile, qualifications, clinic location, consultation fee and reviews.
- Book an appointment with a doctor (online or offline visit mode).
- Pay the consultation fee securely online (via Stripe). The appointment shows as "Paid" once payment is complete.
- After payment, chat privately with that doctor and securely share documents (reports, prescriptions) — messages and files are encrypted.
- Apply as a Doctor: a user can request to join the platform as a doctor.
- Manage their profile, view "Appointed Doctors", and leave reviews.

How to behave:
- Be concise, warm and helpful. Answer questions about how to use HealthTalk.
- When the user wants to find a doctor, the nearest doctor, or a doctor of a certain specialization, ALWAYS call the find_doctors tool and present the results clearly (name, specialization, fee, distance if available).
- If the user asks for the "nearest" or "closest" doctor, call find_doctors with use_location set to true.
- You can mention that they can tap a doctor to view the full profile and book.

Very important safety rule:
- You are NOT a medical professional. Do NOT diagnose conditions, prescribe medication, or give specific medical/treatment advice. For any health concern, gently recommend booking and consulting a qualified doctor on HealthTalk.`;

// Tool the model can call to search HealthTalk's real doctor records.
const tools = [
  {
    functionDeclarations: [
      {
        name: "find_doctors",
        description:
          "Search HealthTalk's registered doctors. Use when the user wants to find a doctor, the nearest/closest doctor, or filter by specialization.",
        parameters: {
          type: "object",
          properties: {
            specialization: {
              type: "string",
              description:
                "Specialization or treatment area to filter by, e.g. 'Gynecologist', 'Dentist', 'Cardiologist'. Optional.",
            },
            use_location: {
              type: "boolean",
              description:
                "Set true when the user wants the nearest/closest doctors so results are sorted by distance from their shared location.",
            },
          },
        },
      },
    ],
  },
];

// Executes the find_doctors tool against MongoDB. `location` is {lat, lng} or null.
const findDoctors = async ({ specialization, use_location }, location) => {
  const specFilter = specialization
    ? { specialization: { $regex: specialization, $options: "i" } }
    : {};

  let doctors;
  if (use_location && location?.lat != null && location?.lng != null) {
    doctors = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [Number(location.lng), Number(location.lat)],
          },
          distanceField: "distance", // in meters
          spherical: true,
          query: { role: "doctor", ...specFilter },
        },
      },
      { $limit: 5 },
      { $project: { password: 0, __v: 0 } },
    ]);
  } else {
    doctors = await User.find({ role: "doctor", ...specFilter })
      .sort({ avgRating: -1 })
      .limit(5)
      .select("-password -__v")
      .lean();
  }

  return doctors.map((d) => ({
    id: String(d._id),
    name: d.name,
    specialization: Array.isArray(d.specialization)
      ? d.specialization.join(", ")
      : d.specialization || "Doctor",
    clinicFee: d.clinicFee ?? null,
    clinic: d.clinicLocation?.name || null,
    avgRating: d.avgRating ?? 0,
    image: d.image || null,
    distanceKm:
      d.distance != null ? Math.round((d.distance / 1000) * 10) / 10 : null,
  }));
};

// POST /api/v1/assistant/chat — public chatbot endpoint.
exports.chat = async (req, res, next) => {
  try {
    const { messages = [], location = null } = req.body;
console.log(messages,location);
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        success: false,
        message:
          "Assistant is not configured. Add a free GEMINI_API_KEY to the server .env (https://aistudio.google.com/apikey).",
      });
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No messages provided." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: SYSTEM_PROMPT,
      tools,
    });

    // Build chat history from prior turns; the latest user message is sent separately.
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: String(m.text ?? m.content ?? "") }],
    }));
    const latest = messages[messages.length - 1];
    const latestText = String(latest.text ?? latest.content ?? "");

    const chat = model.startChat({ history });

    let result = await chat.sendMessage(latestText);
    let doctorsFound = [];

    // Tool-call loop: keep resolving find_doctors calls until the model replies in text.
    let guard = 0;
    while (guard < 4) {
      const calls = result.response.functionCalls?.() || [];
      if (!calls.length) break;
      guard += 1;

      const toolResponses = [];
      for (const call of calls) {
        if (call.name === "find_doctors") {
          const docs = await findDoctors(call.args || {}, location);
          doctorsFound = docs;
          toolResponses.push({
            functionResponse: {
              name: "find_doctors",
              response: { doctors: docs },
            },
          });
        }
      }
      result = await chat.sendMessage(toolResponses);
    }

    const reply = result.response.text();
    res.status(200).json({ success: true, reply, doctors: doctorsFound });
  } catch (err) {
    console.error("Assistant error:", err?.message);
    next(err);
  }
};
