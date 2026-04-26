import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Auth/Login";
import UserInfo from "./components/User/UserProfile";
import { useAuthState } from "./context/AuthProvider";
import DocProf from "./components/Doctors/DocProf";
import Review from "./components/Reviews/Review";
import BecomeDoctorForm from "./components/Doctors/BecomeDoctorForm";
import Doctors from "./pages/Doctors";
import { GuestRoute, ProtectedRoute } from "./hooks/useProtectedRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Signup from "./components/Auth/Signup";

function App() {
  const { user } = useAuthState();
const GoogleAuthWrapper=()=>{
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}>
      <Login/>
    </GoogleOAuthProvider>
  )
}
const GoogleAuthWrapperForSignUp=()=>{
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}>
      <Signup/>
    </GoogleOAuthProvider>
  )
}
  return (
    <Routes>
      <Route
        path="/*"
        element={
          user ? user.role === "user" ? <Home /> : <UserInfo /> : <Home />
        }
      />

      <Route
        path="/login"
        element={
          <GuestRoute>
            <GoogleAuthWrapper />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <GoogleAuthWrapperForSignUp />
          </GuestRoute>
        }
      />
      <Route
        path="/my-profile/*"
        element={
          <ProtectedRoute>
            <UserInfo />
          </ProtectedRoute>
        }
      />
      <Route path="/doctors" element={<Doctors />} />
      <Route
        path="/doctor-profile/:doctorId"
        element={<DocProf />}
      />
      <Route
        path="/doctor-profile"
        element={<DocProf />}
      />
      <Route
        path="/doctor/review/:doctorId"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Review />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/review"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Review />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/form"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <BecomeDoctorForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
