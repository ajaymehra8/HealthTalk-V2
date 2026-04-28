const nodemailer = require("nodemailer");
const { convert } = require("html-to-text");
const {
  EMAIL_COLORS,
  buildEmailTemplate,
  escapeHtml,
  getBrandConfig,
  safeUrl,
} = require("./emailTemplate");

module.exports = class Email {
  constructor(user = {}) {
    this.to = user.email;
    this.firstName = user.name ? String(user.name).split(" ")[0] : "there";
    this.from = process.env.Email_Username;
    this.brand = getBrandConfig();
    this.siteUrl = safeUrl(this.brand.homepage);
  }

  newTransport() {
    const isDevelopment = process.env.NODE_ENV !== "production";

    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email_Username,
        pass: process.env.Email_Password,
      },
      logger: isDevelopment,
      debug: isDevelopment,
    });
  }

  async send(subject, message, email = this.to) {
    const recipient = email || this.to;
    const mailOptions = {
      from: `"HealthTalk" <${this.from}>`,
      to: recipient,
      subject,
      html: message,
      text: convert(message, { wordwrap: 130 }),
    };

    try {
      await this.newTransport().sendMail(mailOptions);
      console.log(`HealthTalk email sent to ${recipient} with subject "${subject}"`);
    } catch (err) {
      console.error("Error sending email:", err);
      throw new Error("Failed to send email.");
    }
  }

  async sendWelcome() {
    const message = buildEmailTemplate({
      preheader: `Welcome to HealthTalk, ${this.firstName}. Your account is ready.`,
      eyebrow: "Welcome aboard",
      title: `Welcome to HealthTalk${this.firstName ? `, ${this.firstName}` : ""}`,
      intro: `Hi ${this.firstName}, thanks for joining us. We are excited to have you here.`,
      bodyHtml: `
        <p style="margin:0 0 16px;">
          You can now explore doctors, manage appointments, and stay in sync with everything HealthTalk offers.
        </p>
        <div
          style="
            padding:18px 20px;
            border-radius:18px;
            background:rgba(41, 128, 78, 0.06);
            border:1px solid rgba(41, 128, 78, 0.14);
          "
        >
          <div
            style="
              font-size:13px;
              font-weight:700;
              letter-spacing:0.12em;
              text-transform:uppercase;
              color:${EMAIL_COLORS.green};
              margin-bottom:8px;
            "
          >
            Next step
          </div>
          <div style="font-size:15px; line-height:1.7; color:${EMAIL_COLORS.text};">
            Book your first appointment or browse doctors whenever you are ready.
          </div>
        </div>
      `,
      cta: {
        label: "Open HealthTalk",
        href: this.siteUrl,
      },
      footerNote:
        "If you did not create this account, you can safely ignore this email.",
    });

    await this.send("Welcome to the HealthTalk Family", message);
  }

  async sendPasswordReset(resetUrl = this.siteUrl) {
    const message = buildEmailTemplate({
      preheader:
        "Password reset request for your HealthTalk account. Use the button below to continue.",
      eyebrow: "Password reset",
      title: "Reset your HealthTalk password",
      intro: `Hi ${this.firstName}, we received a request to reset your password.`,
      bodyHtml: `
        <p style="margin:0 0 16px;">
          Use the button below to choose a new password. For security, this link can only be used once.
        </p>
      `,
      callout: {
        label: "Link expires in",
        value: "10 minutes",
        helper: "If you did not request this change, you can ignore this email.",
      },
      cta: {
        label: "Reset password",
        href: resetUrl,
      },
    });

    await this.send(
      "Your Password Reset Token (Valid for 10 minutes)",
      message
    );
  }

  async sendOtp(otp) {
    const message = buildEmailTemplate({
      preheader:
        "Your HealthTalk verification code. Enter it on the verification screen to continue.",
      eyebrow: "Email verification",
      title: "Verify your HealthTalk email",
      intro: `Hi ${this.firstName}, use the one-time code below to verify your email address.`,
      callout: {
        label: "Your code",
        value: otp,
        helper: "This code expires in 5 minutes.",
        code: true,
      },
      bodyHtml: `
        <div
          style="
            padding:18px 20px;
            border-radius:18px;
            background:rgba(31, 58, 95, 0.04);
            border:1px solid rgba(31, 58, 95, 0.08);
          "
        >
          <div
            style="
              font-size:13px;
              font-weight:700;
              letter-spacing:0.12em;
              text-transform:uppercase;
              color:${EMAIL_COLORS.navy};
              margin-bottom:8px;
            "
          >
            Security tip
          </div>
          <div style="font-size:15px; line-height:1.7; color:${EMAIL_COLORS.text};">
            Never share this code with anyone.
          </div>
        </div>
      `,
      footerNote: "If you did not request this code, you can ignore this email.",
    });

    await this.send(
      "Your OTP for email verification. (Valid for 5 minutes)",
      message
    );
  }

  async report(doctor, user, reportText = "") {
    const doctorName = doctor?.name ? String(doctor.name) : "";
    const reportedDoctor = doctorName ? `Dr. ${doctorName}` : "the doctor";
    const reporterName = user?.name ? String(user.name) : "a user";
    const adminEmail = process.env.ADMIN_EMAIL || "am7011793@gmail.com";

    const sharedReportBlock = reportText
      ? `
        <div
          style="
            margin-top:18px;
            padding:18px 20px;
            border-radius:18px;
            background:rgba(31, 58, 95, 0.04);
            border:1px solid rgba(31, 58, 95, 0.08);
          "
        >
          <div
            style="
              font-size:13px;
              font-weight:700;
              letter-spacing:0.12em;
              text-transform:uppercase;
              color:${EMAIL_COLORS.navy};
              margin-bottom:8px;
            "
          >
            Submitted reason
          </div>
          <div style="font-size:15px; line-height:1.7; color:${EMAIL_COLORS.text};">
            ${escapeHtml(reportText)}
          </div>
        </div>
      `
      : "";

    const messageForUser = buildEmailTemplate({
      preheader: `We received your report about ${reportedDoctor}.`,
      eyebrow: "Report received",
      title: "Your report has been submitted",
      intro: `Hi ${this.firstName}, thanks for helping keep HealthTalk safe.`,
      callout: {
        label: "Reported doctor",
        value: reportedDoctor,
        helper: "Our team has been notified and will review it shortly.",
      },
      bodyHtml: `
        <p style="margin:0 0 16px;">
          We have logged your report and will take a look as soon as possible.
        </p>
        ${sharedReportBlock}
      `,
      footerNote:
        "You will only hear back if we need more details about the report.",
    });

    const messageForAdmin = buildEmailTemplate({
      preheader: `New doctor report submitted by ${reporterName}.`,
      eyebrow: "Admin review",
      title: "A doctor report needs attention",
      intro: `A report has been filed by ${reporterName}.`,
      callout: {
        label: "Doctor",
        value: reportedDoctor,
        helper: `Reporter: ${reporterName}`,
      },
      bodyHtml: `
        <p style="margin:0 0 16px;">
          Please review the submission in the admin workflow.
        </p>
        ${sharedReportBlock}
      `,
      footerNote: "This notification was generated automatically by HealthTalk.",
    });

    const messageForDoctor = buildEmailTemplate({
      preheader: `A user has reported your HealthTalk profile.`,
      eyebrow: "Notice",
      title: "You have been reported",
      intro: `Hi ${reportedDoctor}, a user has submitted a report against your profile.`,
      callout: {
        label: "Reporter",
        value: reporterName,
        helper: "The submission has been logged in HealthTalk.",
      },
      bodyHtml: `
        <p style="margin:0 0 16px;">
          Please review your profile and contact support if you need help understanding the report.
        </p>
        ${sharedReportBlock}
      `,
      footerNote: "This message was sent as part of the HealthTalk moderation flow.",
    });

    await this.send(
      "Your recent report submission in HealthTalk",
      messageForUser,
      user?.email
    );
    await this.send(
      `${reportedDoctor} is reported by ${reporterName} in HealthTalk`,
      messageForAdmin,
      adminEmail
    );
    await this.send(
      `Reported by ${reporterName} in HealthTalk`,
      messageForDoctor,
      doctor?.email
    );
  }
};
