import React, { useEffect, useRef, useState } from "react";
import { Box, Button, useToast } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { login } from "../../Api/Auth";
import { useAuthState } from "../../context/AuthProvider";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import Logo from "../Logo/Logo";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import Typography from "../ui/Typography";
import AuthField from "./AuthField";
import "./Auth.css";

const Login = () => {
  const { setUser } = useAuthState();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    window.onpopstate = () => {
      navigate("/");
    };

    return () => {
      window.onpopstate = null;
    };
  }, [navigate]);

  const responseGoogle = async (authResult) => {
    try {
      if (authResult?.code) {
        const result = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/user/google-auth?code=${authResult?.code}`
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
          navigate("/");
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = await login({ email, password });

      if (!data.success) {
        toast({
          title: data.message || "An error occurred",
          status: "error",
          isClosable: true,
          duration: 10000,
        });
      } else {
        const obj = { ...data.user, jwt: data.token };
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
        navigate("/");
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
  };

  return (
    <Box className="auth-page">
      <Box className="auth-orb auth-orb--one" aria-hidden="true" />
      <Box className="auth-orb auth-orb--two" aria-hidden="true" />

      <Box className="auth-shell">
        <Sidebar variant="login" />

        <Box
          as={motion.div}
          className="auth-card"
          initial={{ opacity: 0, x: 24, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.05 }}
        >
          <Box className="auth-card__inner">
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
                Secure sign in
              </Typography>
            </Box>

            <Typography
              as="h2"
              variant="lgRegular"
              weight="bold"
              className="auth-title"
            >
              Login to your account
            </Typography>

            <Typography as="p" variant="small" className="auth-copy">
              Pick up where you left off and keep your appointments, saved
              doctors, and reminders in one place.
            </Typography>

            <Box className="auth-linkRow">
              <span>Don't have an account?</span>
              <NavLink to="/signup" className="auth-link">
                Create one
              </NavLink>
            </Box>

            <Button
              onClick={googleLoginHandle}
              type="button"
              variant="unstyled"
              width="100%"
              height="54px"
              minHeight="54px"
              borderRadius="16px"
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
              leftIcon={<FcGoogle size={22} />}
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
              autoComplete="email"
              name="email"
            />

            <AuthField
              icon={FiLock}
              type={!showPass ? "password" : "text"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              actionIcon={showPass ? FiEyeOff : FiEye}
              actionLabel={showPass ? "Hide" : "Show"}
              actionAriaLabel={showPass ? "Hide password" : "Show password"}
              actionWidth="6rem"
              onAction={() => setShowPass(!showPass)}
            />

            <Button
              type="button"
              onClick={!loading ? handleSubmit : undefined}
              isLoading={loading}
              loadingText="Wait..."
              isDisabled={loading}
              width="100%"
              height="54px"
              minHeight="54px"
              borderRadius="16px"
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
              Log in
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
