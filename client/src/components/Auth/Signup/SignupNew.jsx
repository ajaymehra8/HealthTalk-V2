import {
  Box,
  Button,
  Input,
  useToast,
  InputGroup,
  InputRightElement,
  InputLeftElement,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import { GoEye } from "react-icons/go";

import { FiUser } from "react-icons/fi";


import { signup } from "../../../Api/Auth";
import axios from "axios";
import { useAuthState } from "../../../context/AuthProvider";
import Sidebar from "../Sidebar";
import { useGoogleLogin } from "@react-oauth/google";
import Logo from "../../Logo/Logo";
import "./Signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnState, setBtnState] = useState(1);
  const [otp, setOtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthState();
  const [showPass, setShowPass] = useState(false);
  const emailRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();
  window.onpopstate = () => {
    if (btnState > 1) {
      setBtnState(btnState - 1);
    } else {
      navigate("/");
    }
  };

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

  useEffect(() => {
    if (btnState === 1) {
      emailRef.current?.focus();
    }
  }, [btnState]);

  const handleSubmit = async (e) => {
    // FOR GET OTP
    if (e.target.innerText === "Next") {
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
          title: err.response.data.message || "An error occurred",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
      setLoading(false);
    }
    // TO VERIFY OTP
    if (e.target.innerText === "Verify OTP") {
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
          title: err.response.data.message || "An error occurred",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
      setLoading(false);
    }
    // when user in at SIGN UP STEP
    if (e.target.innerText === "Sign up") {
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
          navigate("/");
        }
      } catch (error) {
        toast({
          title: error.response.data.message,
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
    <Box
      h={{ sm: "90vh", md: "100vh" }}
      w={"100vw"}
      border={"2px solid black"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      padding={"40px"}
      className="gradient-bg"
    >
      <Box
        h={"100%"}
        w={"100%"}
        border={"2px solid blue"}
        maxW={"1000px"}
        maxH={"700px"}
        rounded={"15px"}
        display={"flex"}
        alignItems={"center"}
        bg={"#fff"}
        justifyContent={"center"}
        position={"relative"}
      >
        <Box width={"50%"} height={"100%"} border={"1px solid yellow"}>
          <Logo
            style={{
              position: "absolute",
              top: "15px",
              left: "15px",
            }}
          />
        </Box>

        <Box
          boxSizing="border-box"
          w={{ sm: "100%", md: "50%" }}
          h={"100%"}
          display={"flex"}
          flexDir={"column"}
          className="loginModal"
          alignItems={"center"}
          justifyContent={"center"}
          gap={"15px"}
          bg={"#ffffff"}
          minW={"50px"}
          border={"1px solid red"}
          borderRadius={"10px"}
          paddingLeft={"40px"}
        >
          <h2
            style={{
              fontSize: "clamp(20px,3vw,30px)",
              letterSpacing: "1px",
              color: "var(--primary-green-color)",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            Create your account
          </h2>
          {/* <NavLink
            to={"/login"}
            style={{
              fontSize: "clamp(16px,1.5vw,20px)",
              fontWeight: "500",
              marginBottom: "20px",
              marginTop: "-20px",
            }}
          >
            Have an Account? <span style={{ color: "blue" }}>Log in</span>
          </NavLink> */}
          <Button
            p={"10px"}
            borderRadius={"10px"}
            border={"1px solid black"}
            width={"clamp(200px,90%,400px)"}
            onClick={googleLoginHandle}
            fontSize={"clamp(15px,3vw,20px)"}
            bg={"white"}
          >
            {" "}
            <img
              src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
              alt=""
              style={{ width: "25px", marginRight: "5px" }}
            />{" "}
            Google
          </Button>

          <p
            style={{
              alignSelf: "center",
              color: "var(--secondary-gray-color)",
              fontWeight: "500",
              marginTop: "20px ",
            }}
          >
            or use your email for registration
          </p>
          <InputGroup
            width={"clamp(200px,100%,400px)"}
            display={"flex"}
            alignItems={"center"}
            justifyItems={"center"}
          >
            <InputLeftElement height={"100%"}>
              <MdOutlineMail size={22} color="#939793" />
            </InputLeftElement>
            <Input
              type="email"
              placeholder={"Email"}
              ref={emailRef}
              padding={"25px"}
              paddingLeft={"40px"}
              outline={"none"}
              border={"none"}
              color={"#939793"}
              width={"100%"}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              background={"#f4f8f7"}
              fontSize={"clamp(15px,3vw,18px)"}
              disabled={btnState > 1}
              _placeholder={{
                color: "#939793",
              }}
              _hover={{
                shadow: "0 0 5px 0 #b3b6b5",
              }}
              _focus={{
                shadow: "0 0 5px 0 #b3b6b5",
              }}
              _disabled={{
                cursor: "not-allowed",
                opacity: 0.8,
              }}
            />
            {btnState > 1 && (
              <InputRightElement width="4.5rem">
                <button
                  style={{
                    background: "white",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "blue",
                    zIndex: 3,
                  }}
                  onClick={() => {
                    setBtnState(1);
                  }}
                >
                  Edit
                </button>
              </InputRightElement>
            )}
          </InputGroup>

          {btnState === 2 && (
            <InputGroup
              width={"clamp(200px,100%,400px)"}
              display={"flex"}
              alignItems={"center"}
              justifyItems={"center"}
            >
              <InputLeftElement height={"100%"}>
                <MdLockOutline size={22} color="#939793" />
              </InputLeftElement>
              <Input
                type="number"
                placeholder={"OTP"}
                onChange={(e) => setOtp(e.target.value)}
                outline={"none"}
                width={"100%"}
                fontSize={"clamp(15px,3vw,18px)"}
                value={otp}
                border={"none"}
                padding={"25px"}
                paddingLeft={"40px"}
                color={"#939793"}
                background={"#f4f8f7"}
                disabled={btnState !== 2}
                _placeholder={{
                  color: "#939793",
                }}
                _hover={{
                  shadow: "0 0 5px 0 #b3b6b5",
                }}
                _focus={{
                  shadow: "0 0 5px 0 #b3b6b5",
                }}
                _disabled={{
                  cursor: "not-allowed",
                  opacity: 0.8,
                }}
                css={{
                  "&::-webkit-inner-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                  "&::-webkit-outer-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                  "&": { MozAppearance: "textfield" },
                }}
              />
            </InputGroup>
          )}
          {btnState === 3 && (
            <>
              <InputGroup
                width={"clamp(200px,100%,400px)"}
                display={"flex"}
                alignItems={"center"}
                justifyItems={"center"}
              >
                <InputLeftElement height={"100%"}>
                  <FiUser size={22} color="#939793" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder={"Name"}
                  p="10px"
                  borderRadius="10px"
                  outline="none"
                  width={"100%"}
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  fontSize={"clamp(15px,3vw,18px)"}
                  border={"none"}
                  padding={"25px"}
                  paddingLeft={"40px"}
                  color={"#939793"}
                  background={"#f4f8f7"}
                  disabled={btnState !== 3}
                  _placeholder={{
                    color: "#939793",
                  }}
                  _hover={{
                    shadow: "0 0 5px 0 #b3b6b5",
                  }}
                  _focus={{
                    shadow: "0 0 5px 0 #b3b6b5",
                  }}
                  _disabled={{
                    cursor: "not-allowed",
                    opacity: 0.8,
                  }}
                />
              </InputGroup>
              <InputGroup width={"clamp(200px,90%,400px)"}>
                <InputLeftElement height={"100%"}>
                  <MdLockOutline size={22} color="#939793" />
                </InputLeftElement>
                <Input
                  type={!showPass ? "password" : "text"}
                  placeholder={"Password"}
                  borderRadius={"10px"}
                  outline={"none"}
                  width={"100%"}
                  maxLength={28}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fontSize={"clamp(15px,3vw,18px)"}
                  border={"none"}
                  padding={"25px"}
                  paddingLeft={"40px"}
                  color={"#939793"}
                  background={"#f4f8f7"}
                  disabled={btnState !== 3}
                  _placeholder={{
                    color: "#939793",
                  }}
                  _hover={{
                    shadow: "0 0 5px 0 #b3b6b5",
                  }}
                  _focus={{
                    shadow: "0 0 5px 0 #b3b6b5",
                  }}
                  _disabled={{
                    cursor: "not-allowed",
                    opacity: 0.8,
                  }}
                />
                <InputRightElement width="4.5rem">
                  <button
                    style={{
                      background: "white",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "blue",
                      zIndex: 3,
                    }}
                    onClick={() => setShowPass(!showPass)}
                  >
                    {!showPass ? "Show" : "Hide"}
                  </button>
                </InputRightElement>
              </InputGroup>
            </>
          )}

          <button
            className="mainButton"
            onClick={!loading ? handleSubmit : undefined}
            disabled={loading}
            style={{
              borderRadius: "9999px",
              minWidth: "180px",
              minHeight: "40px",
              padding: "10px 0",
              alignSelf: "center",
              marginTop: "20px",
            }}
          >
            {btnState === 1 && (!loading ? "Next" : "Wait...")}
            {btnState === 2 && (!loading ? "Verify OTP" : "Verifying...")}
            {btnState === 3 && (!loading ? "Sign up" : "Signing...")}
          </button>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
