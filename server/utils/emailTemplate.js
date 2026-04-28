const EMAIL_COLORS = {
  navy: "#1f3a5f",
  navyDeep: "#17324f",
  green: "#29804e",
  greenBright: "#37bd73",
  text: "#334155",
  muted: "#64748b",
  border: "rgba(31, 58, 95, 0.12)",
  surface: "#ffffff",
  background: "#edf4fb",
  backgroundSoft: "#f7fbfd",
  softGreen: "rgba(41, 128, 78, 0.10)",
  softGreenBorder: "rgba(41, 128, 78, 0.14)",
  softNavy: "rgba(31, 58, 95, 0.08)",
  shadow: "0 24px 60px rgba(31, 58, 95, 0.14)",
  buttonGradient: "linear-gradient(135deg, #1f3a5f 0%, #29804e 100%)",
  cardGradient: "linear-gradient(180deg, rgba(31, 58, 95, 0.03) 0%, rgba(41, 128, 78, 0.03) 100%)",
};

const DEFAULT_HOME_URL = "http://localhost:3000";

function getBrandConfig() {
  return {
    name: "HealthTalk",
    homepage: process.env.BASE_URL || process.env.CLIENT_URL || DEFAULT_HOME_URL,
    supportEmail: process.env.Email_Username || process.env.EMAIL_SUPPORT_EMAIL || "",
    logoUrl: process.env.EMAIL_LOGO_URL || "",
  };
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

function safeUrl(value, fallback = DEFAULT_HOME_URL) {
  const candidate = String(value ?? "").trim();
  const base = String(fallback || DEFAULT_HOME_URL).trim() || DEFAULT_HOME_URL;
  if (!candidate) {
    return base;
  }

  try {
    return new URL(candidate, base).toString();
  } catch {
    return base;
  }
}

function renderLogo(brand, homeUrl) {
  const logoUrl = String(brand.logoUrl || "").trim();
  const safeHomeUrl = escapeHtml(homeUrl);

  if (logoUrl) {
    return `
      <a href="${safeHomeUrl}" style="text-decoration:none; display:inline-block;">
        <img
          src="${escapeHtml(safeUrl(logoUrl, homeUrl))}"
          alt="${escapeHtml(brand.name)}"
          width="180"
          style="display:block; border:0; outline:none; text-decoration:none; height:auto; max-width:180px;"
        />
      </a>
    `;
  }

  return `
    <a href="${safeHomeUrl}" style="text-decoration:none; display:inline-block;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td valign="middle" style="padding-right:12px;">
            <div
              style="
                width:52px;
                height:52px;
                border-radius:18px;
                background:${EMAIL_COLORS.buttonGradient};
                box-shadow:0 14px 28px rgba(31, 58, 95, 0.18);
                text-align:center;
                line-height:52px;
                font-family:Arial, Helvetica, sans-serif;
                font-size:18px;
                font-weight:800;
                color:#ffffff;
              "
            >HT</div>
          </td>
          <td valign="middle">
            <div
              style="
                font-family:Arial, Helvetica, sans-serif;
                font-size:30px;
                line-height:1;
                font-weight:800;
                letter-spacing:-0.04em;
                color:${EMAIL_COLORS.navy};
              "
            >
              Health<span style="color:${EMAIL_COLORS.green};">Talk</span>
            </div>
            <div
              style="
                margin-top:4px;
                font-family:Arial, Helvetica, sans-serif;
                font-size:11px;
                line-height:1.2;
                letter-spacing:0.24em;
                text-transform:uppercase;
                color:${EMAIL_COLORS.muted};
              "
            >
              Care that feels connected
            </div>
          </td>
        </tr>
      </table>
    </a>
  `;
}

function renderPill(text) {
  return `
    <div
      style="
        display:inline-block;
        padding:8px 12px;
        border-radius:999px;
        background:${EMAIL_COLORS.softGreen};
        color:${EMAIL_COLORS.green};
        font-family:Arial, Helvetica, sans-serif;
        font-size:12px;
        font-weight:700;
        letter-spacing:0.08em;
        text-transform:uppercase;
      "
    >
      ${escapeHtml(text)}
    </div>
  `;
}

function renderButton({ label, href }) {
  return `
    <a
      href="${escapeHtml(safeUrl(href))}"
      style="
        display:inline-block;
        padding:14px 22px;
        border-radius:14px;
        background:${EMAIL_COLORS.buttonGradient};
        color:#ffffff;
        text-decoration:none;
        font-family:Arial, Helvetica, sans-serif;
        font-size:16px;
        font-weight:700;
        box-shadow:0 14px 24px rgba(31, 58, 95, 0.18);
      "
    >
      ${escapeHtml(label)}
    </a>
  `;
}

function renderCallout({ label, value, helper, code = false }) {
  const valueStyle = code
    ? `
        font-family:"Courier New", Courier, monospace;
        letter-spacing:0.32em;
      `
    : "";
  const valueSize = code ? "32px" : "26px";

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
      <tr>
        <td
          style="
            padding:20px 22px;
            border-radius:22px;
            background:${EMAIL_COLORS.cardGradient};
            border:1px solid ${EMAIL_COLORS.softGreenBorder};
          "
        >
          <div
            style="
              font-family:Arial, Helvetica, sans-serif;
              font-size:12px;
              line-height:1.4;
              font-weight:700;
              letter-spacing:0.14em;
              text-transform:uppercase;
              color:${EMAIL_COLORS.green};
            "
          >
            ${escapeHtml(label || "Details")}
          </div>
          <div
            style="
              margin-top:8px;
              font-family:Arial, Helvetica, sans-serif;
              font-size:${valueSize};
              line-height:1.1;
              font-weight:800;
              color:${EMAIL_COLORS.navy};
              ${valueStyle}
            "
          >
            ${escapeHtml(value || "")}
          </div>
          ${
            helper
              ? `
            <div
              style="
                margin-top:8px;
                font-family:Arial, Helvetica, sans-serif;
                font-size:13px;
                line-height:1.7;
                color:${EMAIL_COLORS.muted};
              "
            >
              ${escapeHtml(helper)}
            </div>
          `
              : ""
          }
        </td>
      </tr>
    </table>
  `;
}

function buildEmailTemplate({
  preheader = "",
  eyebrow = "",
  title = "",
  intro = "",
  bodyHtml = "",
  callout = null,
  cta = null,
  footerNote = "",
} = {}) {
  const brand = getBrandConfig();
  const homeUrl = safeUrl(brand.homepage);
  const supportEmail = String(brand.supportEmail || "").trim();
  const eyebrowHtml = eyebrow ? renderPill(eyebrow) : "";
  const introHtml = intro
    ? `
      <p
        style="
          margin:0 0 18px;
          font-family:Arial, Helvetica, sans-serif;
          font-size:17px;
          line-height:1.75;
          color:${EMAIL_COLORS.text};
        "
      >
        ${escapeHtml(intro)}
      </p>
    `
    : "";
  const calloutHtml = callout ? `<div style="margin:24px 0 0;">${renderCallout(callout)}</div>` : "";
  const bodySection = bodyHtml
    ? `
      <div
        style="
          margin-top:24px;
          font-family:Arial, Helvetica, sans-serif;
          font-size:16px;
          line-height:1.75;
          color:${EMAIL_COLORS.text};
        "
      >
        ${bodyHtml}
      </div>
    `
    : "";
  const ctaHtml = cta ? `<div style="margin-top:28px;">${renderButton(cta)}</div>` : "";
  const footerNoteHtml = footerNote
    ? `
      <div
        style="
          margin-top:18px;
          font-family:Arial, Helvetica, sans-serif;
          font-size:13px;
          line-height:1.7;
          color:${EMAIL_COLORS.muted};
        "
      >
        ${escapeHtml(footerNote)}
      </div>
    `
    : "";
  const supportLine = supportEmail
    ? `
      <div
        style="
          margin-top:14px;
          font-family:Arial, Helvetica, sans-serif;
          font-size:12px;
          line-height:1.7;
          color:${EMAIL_COLORS.muted};
        "
      >
        Need help? Reply to this email or write to
        <a href="mailto:${escapeHtml(supportEmail)}" style="color:${EMAIL_COLORS.green}; text-decoration:none;">${escapeHtml(supportEmail)}</a>.
      </div>
    `
    : `
      <div
        style="
          margin-top:14px;
          font-family:Arial, Helvetica, sans-serif;
          font-size:12px;
          line-height:1.7;
          color:${EMAIL_COLORS.muted};
        "
      >
        Need help? Reply to this email and we will get back to you.
      </div>
    `;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title || brand.name)}</title>
  </head>
  <body style="margin:0; padding:0; background:${EMAIL_COLORS.background};">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; mso-hide:all; font-size:1px; line-height:1px;">
      ${escapeHtml(preheader || title || brand.name)}
    </div>
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="width:100%; background:${EMAIL_COLORS.background}; padding:32px 16px 48px;"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="max-width:660px; width:100%;"
          >
            <tr>
              <td style="padding:0 0 18px;">
                ${renderLogo(brand, homeUrl)}
              </td>
            </tr>
            <tr>
              <td>
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    width:100%;
                    background:${EMAIL_COLORS.surface};
                    border:1px solid ${EMAIL_COLORS.border};
                    border-radius:28px;
                    overflow:hidden;
                    box-shadow:${EMAIL_COLORS.shadow};
                  "
                >
                  <tr>
                    <td>
                      <div style="height:8px; background:${EMAIL_COLORS.buttonGradient};"></div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px 42px 38px;">
                      ${eyebrowHtml}
                      <div style="margin-top:${eyebrow ? "18px" : "0"};">
                        <div
                          style="
                            margin:0 0 14px;
                            font-family:Arial, Helvetica, sans-serif;
                            font-size:30px;
                            line-height:1.15;
                            font-weight:800;
                            letter-spacing:-0.04em;
                            color:${EMAIL_COLORS.navy};
                          "
                        >
                          ${escapeHtml(title || brand.name)}
                        </div>
                        ${introHtml}
                        ${calloutHtml}
                        ${bodySection}
                        ${ctaHtml}
                        ${footerNoteHtml}
                      </div>
                      <div style="margin-top:32px; padding-top:24px; border-top:1px solid ${EMAIL_COLORS.border};">
                        <div
                          style="
                            font-family:Arial, Helvetica, sans-serif;
                            font-size:14px;
                            line-height:1.7;
                            color:${EMAIL_COLORS.text};
                          "
                        >
                          Warm regards,
                        </div>
                        <div
                          style="
                            margin-top:4px;
                            font-family:Arial, Helvetica, sans-serif;
                            font-size:14px;
                            font-weight:700;
                            color:${EMAIL_COLORS.navy};
                          "
                        >
                          The HealthTalk team
                        </div>
                        <div
                          style="
                            margin-top:14px;
                            font-family:Arial, Helvetica, sans-serif;
                            font-size:12px;
                            line-height:1.7;
                            color:${EMAIL_COLORS.muted};
                          "
                        >
                          You are receiving this message because of your HealthTalk account activity.
                        </div>
                        ${supportLine}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding:18px 14px 0;
                  text-align:center;
                  font-family:Arial, Helvetica, sans-serif;
                  font-size:12px;
                  line-height:1.7;
                  color:${EMAIL_COLORS.muted};
                "
              >
                <a href="${escapeHtml(homeUrl)}" style="color:${EMAIL_COLORS.green}; text-decoration:none;">${escapeHtml(brand.name)}</a>
                keeps healthcare simple, secure, and easy to follow.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

module.exports = {
  EMAIL_COLORS,
  buildEmailTemplate,
  escapeHtml,
  getBrandConfig,
  safeUrl,
};
