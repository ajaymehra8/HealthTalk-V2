import React from 'react'
import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate=useNavigate();
  return (
     <h1
        className="logo"
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate("/");
        }}
      >
        Health
        <span className="logo-span">Talk</span>
      </h1>
  )
}

export default Logo
