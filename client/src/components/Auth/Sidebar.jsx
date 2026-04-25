import { Box, Image } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiClock, FiShield } from "react-icons/fi";
import Typography from "../ui/Typography";
import doctorImage from "../../images/doctorHomeImg.png";
import "./Auth.css";

const authCopy = {
  login: {
    badge: "Secure return",
    title: "Welcome back to your care dashboard",
    description:
      "Sign in to continue your appointments, saved doctors, and reminders without losing your place.",
    features: [
      {
        icon: FiShield,
        title: "Secure access",
        text: "Google or email sign in keeps your account protected.",
      },
      {
        icon: FiClock,
        title: "Fast return",
        text: "Jump straight into your appointments and reminders.",
      },
    ],
    stats: [
      { value: "24/7", label: "availability" },
      { value: "100%", label: "verified doctors" },
      { value: "1 tap", label: "back in" },
    ],
    floatingTitle: "Easy access",
    floatingText:
      "A quick sign in gets you back to the care tools you already use.",
    cta: "Explore home",
  },
  signup: {
    badge: "Start fresh",
    title: "Join HealthTalk in a few quick steps",
    description:
      "Create your account with email verification, then start booking care in a few quick steps.",
    features: [
      {
        icon: FiShield,
        title: "OTP verified",
        text: "A short verification step keeps every new account secure.",
      },
      {
        icon: FiClock,
        title: "Quick setup",
        text: "Finish signup in minutes without a cluttered flow.",
      },
    ],
    stats: [
      { value: "3", label: "simple steps" },
      { value: "OTP", label: "protected" },
      { value: "Fast", label: "onboarding" },
    ],
    floatingTitle: "Everything starts clean",
    floatingText:
      "A simple signup flow makes the first step feel effortless.",
    cta: "Go to home",
  },
};

const Sidebar = ({ variant = "login" }) => {
  const copy = authCopy[variant] ?? authCopy.login;

  return (
    <Box
      as={motion.div}
      className="auth-panel"
      initial={{ opacity: 0, x: -28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <Box className="auth-panel__content">
        <Typography
          as="span"
          variant="small"
          weight="bold"
          className="auth-panel__badge"
        >
          {copy.badge}
        </Typography>

        <Typography
          as="h2"
          variant="lgRegular"
          weight="bold"
          className="auth-panel__title"
        >
          {copy.title}
        </Typography>

        <Typography
          as="p"
          variant="small"
          className="auth-panel__copy"
        >
          {copy.description}
        </Typography>

        <Box className="auth-panel__features">
          {copy.features.map((feature) => {
            const FeatureIcon = feature.icon;

            return (
              <Box
                as={motion.div}
                key={feature.title}
                className="auth-panel__feature"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <Box className="auth-panel__featureIcon" aria-hidden="true">
                  <FeatureIcon size={18} />
                </Box>

                <Box className="auth-panel__featureBody">
                  <Typography
                    as="p"
                    variant="small"
                    weight="bold"
                    className="auth-panel__featureTitle"
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    as="p"
                    variant="small"
                    className="auth-panel__featureText"
                  >
                    {feature.text}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box className="auth-panel__imageWrap">
          <Image
            src={doctorImage}
            alt="Doctor using a tablet"
            className="auth-panel__image"
          />

          <Box
            as={motion.div}
            className="auth-panel__floatingCard"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Typography
              as="p"
              variant="small"
              weight="bold"
              className="auth-panel__floatingTitle"
            >
              {copy.floatingTitle}
            </Typography>

            <Typography
              as="p"
              variant="small"
              className="auth-panel__floatingText"
            >
              {copy.floatingText}
            </Typography>
          </Box>
        </Box>

        <Box className="auth-panel__stats">
          {copy.stats.map((stat) => (
            <Box key={stat.label} className="auth-stat">
              <Typography
                as="p"
                variant="small"
                weight="bold"
                className="auth-stat__value"
              >
                {stat.value}
              </Typography>

              <Typography
                as="p"
                variant="small"
                className="auth-stat__label"
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Link to="/" className="auth-cta">
        <span>{copy.cta}</span>
        <FiArrowRight size={18} />
      </Link>
    </Box>
  );
};

export default Sidebar;
