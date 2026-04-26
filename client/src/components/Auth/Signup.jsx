import { Box, Button, useToast } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { signup } from "../../Api/Auth";
import axios from "axios";
import { useAuthState } from "../../context/AuthProvider";
import Sidebar from "./Sidebar";
import { useGoogleLogin } from "@react-oauth/google";
import Logo from "../Logo/Logo";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";
import Typography from "../ui/Typography";
import AuthField from "./AuthField";
import BackButton from "../Common/BackButton";
import "./Auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnState, setBtnState] = useState(1);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthState();
  const [showPass, setShowPass] = useState(false);
  const emailRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  useEffect(() => {
    if (btnState === 1) {
      emailRef.current?.focus();
    }
  }, [btnState]);

  const responseGoogle = async (authResult) => {
    try {
      if (authResult?.code) {
        const result = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/user/google-auth?code=${authResult?.code}`,
        );
        if (result.data.success) {
          const obj = { ...result?.data?.user, jwt: result?.data?.token };
          const user = JSON.stringify(obj);
          localStorage.setItem("userInfo", user);
          setUser(obj);
          toast({
            title: "Login successfully",
            status: "success",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
          navigate(redirectTo, { replace: true });
        }
      }
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  const googleLoginHandle = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  const submitAction =
    btnState === 1 ? "Next" : btnState === 2 ? "Verify OTP" : "Sign up";
  const submitLoadingText =
    btnState === 1 ? "Wait..." : btnState === 2 ? "Verifying..." : "Signing...";

  const handleSubmit = async (buttonLabel) => {
    // FOR GET OTP
    if (buttonLabel === "Next") {
      setLoading(true);

      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/user/otp-verification/?email=${email}`,
        );
        if (data.success) {
          toast({
            title: data.message,
            status: "success",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
          setBtnState(2);
        } else {
          toast({
            title: data.message || "An error occurred",
            status: "error",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
          setEmail("");
        }
      } catch (err) {
        console.log(err);
        toast({
          title: err?.response?.data?.message || "An error occurred",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
      setLoading(false);
    }

    // TO VERIFY OTP
    if (buttonLabel === "Verify OTP") {
      setLoading(true);

      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/v1/user/otp-verification`,
          { email, otp },
        );
        if (data.success) {
          toast({
            title: data.message || "An error occurred",
            status: "success",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
          setBtnState(3);
        } else {
          toast({
            title: data.message || "An error occurred",
            status: "error",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
        }
      } catch (err) {
        toast({
          title: err?.response?.data?.message || "An error occurred",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
      setLoading(false);
    }

    // WHEN USER IS AT SIGN UP STEP
    if (buttonLabel === "Sign up") {
      setLoading(true);

      try {
        const data = await signup({ name, email, password });
        if (!data.success) {
          toast({
            title: data.message || "An error occurred",
            status: "error",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
        } else {
          const obj = { ...data.user, jwt: data.token };
          setUser(obj);
          const user = JSON.stringify(obj);
          localStorage.setItem("userInfo", user);
          toast({
            title: "Signup successful",
            status: "success",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
          navigate(redirectTo, { replace: true });
        }
      } catch (error) {
        toast({
          title: error?.response?.data?.message || "An error occurred",
          description: "Please try again later.",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
      setLoading(false);
    }
  };

  return (
    <Box className="auth-page">
      <Box className="auth-orb auth-orb--one" aria-hidden="true" />
      <Box className="auth-orb auth-orb--two" aria-hidden="true" />

      <Box className="auth-shell">
        <Sidebar variant="signup" />

        <Box
          as={motion.div}
          className="auth-card"
          initial={{ opacity: 0, x: 24, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.05 }}
        >
          <Box className="auth-card__inner">
            <BackButton
              label="Back"
              to={redirectTo}
              fallbackTo="/"
              mb={2}
            />

            <Box className="auth-brand">
              <Logo
                style={{
                  fontSize: "clamp(22px, 2.2vw, 26px)",
                }}
              />
              <Typography
                as="span"
                variant="small"
                weight="bold"
                className="auth-kicker"
              >
                Secure signup
              </Typography>
            </Box>

            <Typography
              as="h2"
              variant="lgRegular"
              weight="bold"
              className="auth-title"
            >
              Create your account
            </Typography>

            <Typography as="p" variant="small" className="auth-copy">
              Verify your email first, then finish the signup with your name and
              password.
            </Typography>

            <Box className="auth-stepper" aria-label="Signup progress">
              {[
                { index: 1, label: "Email" },
                { index: 2, label: "OTP" },
                { index: 3, label: "Details" },
              ].map((step) => {
                const stateClass =
                  btnState === step.index
                    ? "auth-step--active"
                    : btnState > step.index
                      ? "auth-step--complete"
                      : "";

                return (
                  <Box key={step.index} className={`auth-step ${stateClass}`}>
                    <span className="auth-step__number">{step.index}</span>
                    <span className="auth-step__label">{step.label}</span>
                  </Box>
                );
              })}
            </Box>

            <Typography as="p" variant="small" className="auth-helpText">
              We keep the flow short and secure so you can get to your account
              quickly.
            </Typography>

            <Box className="auth-linkRow">
              <span>Already have an account?</span>
              <NavLink
                to="/login"
                state={{ from: redirectTo }}
                className="auth-link"
              >
                Log in
              </NavLink>
            </Box>

            <Button
              onClick={googleLoginHandle}
              type="button"
              variant="unstyled"
              width="100%"
              height="44px"
              minHeight="44px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap="10px"
              borderRadius="12px"
              border="1px solid"
              borderColor="var(--border-soft-color)"
              bg="linear-gradient(180deg, var(--surface-color), var(--surface-muted-color))"
              color="var(--heading-color)"
              fontWeight="700"
              boxShadow="var(--shadow-soft-color)"
              transition="transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease"
              _hover={{
                transform: "translateY(-1px)",
                boxShadow: "0 18px 32px rgba(31, 58, 95, 0.12)",
                borderColor: "rgba(41, 128, 78, 0.25)",
              }}
              leftIcon={<FcGoogle size={20} />}
            >
              Continue with Google
            </Button>

            <div className="auth-divider">or use your email</div>

            <AuthField
              icon={FiMail}
              inputRef={emailRef}
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              disabled={btnState > 1}
              autoComplete="email"
              actionLabel={btnState > 1 ? "Edit" : undefined}
              actionAriaLabel="Edit email"
              actionWidth="5rem"
              onAction={btnState > 1 ? () => setBtnState(1) : undefined}
            />

            {btnState === 2 && (
              <AuthField
                icon={FiShield}
                type="number"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            )}

            {btnState === 3 && (
              <>
                <AuthField
                  icon={FiUser}
                  type="text"
                  placeholder="Full name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  autoComplete="name"
                />

                <AuthField
                  icon={FiLock}
                  type={!showPass ? "password" : "text"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={28}
                  autoComplete="new-password"
                  actionIcon={showPass ? FiEyeOff : FiEye}
                  actionLabel={showPass ? "Hide" : "Show"}
                  actionAriaLabel={showPass ? "Hide password" : "Show password"}
                  actionWidth="6rem"
                  onAction={() => setShowPass(!showPass)}
                />
              </>
            )}

            <Button
              type="button"
              onClick={!loading ? () => handleSubmit(submitAction) : undefined}
              isLoading={loading}
              loadingText={submitLoadingText}
              isDisabled={loading}
              width="100%"
              height="44px"
              minHeight="44px"
              borderRadius="12px"
              border="none"
              bg="linear-gradient(135deg, var(--primary-green-color), var(--auth-panel-end))"
              color="var(--surface-color)"
              fontSize="15px"
              fontWeight="800"
              letterSpacing="0.02em"
              boxShadow="0 18px 34px rgba(41, 128, 78, 0.24)"
              transition="transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, opacity 0.25s ease"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 24px 40px rgba(41, 128, 78, 0.28)",
                bg: "linear-gradient(135deg, var(--secondary-green-color), var(--primary-green-color))",
              }}
              _disabled={{
                opacity: 0.7,
                cursor: "not-allowed",
              }}
              aria-busy={loading}
            >
              {submitAction}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
