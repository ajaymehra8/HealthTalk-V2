import React from "react";
import { Avatar, Box, Tooltip, useToast } from "@chakra-ui/react";
import { useAuthState } from "../context/AuthProvider";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo/Logo";

const Navbar = () => {
  const { user, setUser } = useAuthState();
  const toast = useToast();
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const handleLogOut = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    toast({
      title: "Log out successfully",
      position: "top",
      status: "success",
      isClosable: true,
      duration: 10000,
    });
    navigate("/");
  };
  return (
    <Box
      w={"100vw"}
      boxShadow="0px 4px 8px gray"
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      bg={"white"}
      p={"10px 70px"}
      position={"fixed"}
      top={"0"}
      zIndex={"5"}
      background={"#F5F7FA"}
    >
      <Box display={"flex"} gap={20} alignItems={"center"}>
        <Logo />

        <ul className="navLinks">
          <li className="navLink" onClick={handleLogin}>
            <NavLink>Find Doctors</NavLink>
          </li>
          <li className="navLink" onClick={() => navigate("/signup")}>
            <NavLink>Apply as Doctor</NavLink>
          </li>
        </ul>
      </Box>
      <ul className="navLinks">
        {user && (
          <li className="navLink" onClick={handleLogOut}>
            <NavLink>Logout</NavLink>
          </li>
        )}
        {!user && (
          <>
            <li className="navLink" onClick={handleLogin}>
              <NavLink>Login</NavLink>
            </li>
            <li className="mainButton" onClick={() => navigate("/signup")}>
              <NavLink>Signup</NavLink>
            </li>
          </>
        )}

        {user && (
          <Tooltip label="Your Profile" placement="bottom">
            <li className="navLink">
              <NavLink to={"/my-profile"}>
                <Avatar src={user?.image} size={"sm"} />{" "}
              </NavLink>
            </li>
          </Tooltip>
        )}
      </ul>
    </Box>
  );
};

export default Navbar;
