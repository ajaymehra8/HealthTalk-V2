import React from 'react'
import { useNavigate } from 'react-router-dom';

const Logo = ({style={}}) => {
  const navigate=useNavigate();
  return (
     <h1
        className="logo"
        style={{ cursor: "pointer",...style }}
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
