import { Box, Divider } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo/Logo";

const Footer = () => {
  return (
    <Box
      width={"100%"}
      mt={"30px"}
      display={"flex"}
      flexDir={"column"}
      gap={"5px"}
      p={"10px 0"}
      paddingBottom={"20px"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"0 70px"}
      >
       <Logo/>
        <ul className="navLinks footerLinks">
          <li
            className="navLink"
          
          >
            <NavLink>About us</NavLink>
          </li>
          <li
            className="navLink"
          
          >
            <NavLink>Join us</NavLink>
          </li>
        </ul>
      </Box>
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"30px"}
      >
        <NavLink className={"footerLink fb"}>
          <i class="bi bi-facebook"></i>
        </NavLink>
        <NavLink className={"footerLink insta"}>
          <i class="bi bi-instagram"></i>
        </NavLink>
        <NavLink className={"footerLink linkdin"}>
          <i class="bi bi-linkedin"></i>
        </NavLink>
      </Box>
      <Divider borderColor="#black"  />
      <div
      style={{
        display:"flex",
        alignItems:"center",
        gap:"10px"
      }}
      >
        © 2024{" "}
       <Logo/>
      </div>
    </Box>
  );
};

export default Footer;
