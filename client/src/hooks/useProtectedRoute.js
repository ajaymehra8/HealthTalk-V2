import { useCallback, useEffect, useMemo, useRef } from "react";
import { useToast } from "@chakra-ui/react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthState } from "../context/AuthProvider";

const readStoredUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const rawUser = localStorage.getItem("userInfo");
    if (!rawUser) return null;
    return JSON.parse(rawUser);
  } catch (error) {
    return null;
  }
};

const resolveCurrentUser = (user) => user || readStoredUser();

const toastPayload = (title, status = "warning") => ({
  title,
  status,
  isClosable: true,
  duration: 5000,
  position: "top",
});

export const useProtectedRoute = () => {
  const { user } = useAuthState();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = `${location.pathname}${location.search || ""}`;

  const currentUser = useMemo(() => resolveCurrentUser(user), [user]);
  const token = currentUser?.jwt || null;

  const requireAuth = useCallback(
    (onSuccess, options = {}) => {
      const {
        allowedRoles,
        loginRedirect = "/login",
        unauthorizedRedirect = "/",
        loginMessage = "You have to login first",
        unauthorizedMessage = "You are not allowed to access this page.",
      } = options;

      if (!token) {
        toast(toastPayload(loginMessage, "warning"));
        navigate(loginRedirect, {
          replace: true,
          state: { from: fromPath },
        });
        return false;
      }

      if (
        Array.isArray(allowedRoles) &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(currentUser?.role)
      ) {
        toast(toastPayload(unauthorizedMessage, "error"));
        navigate(unauthorizedRedirect, { replace: true });
        return false;
      }

      if (typeof onSuccess === "function") {
        onSuccess();
      }

      return true;
    },
    [currentUser?.role, fromPath, navigate, token, toast]
  );

  const redirectIfAuthenticated = useCallback(
    (redirectTo = "/") => {
      if (!token) return false;
      navigate(redirectTo, { replace: true });
      return true;
    },
    [navigate, token]
  );

  return {
    currentUser,
    token,
    isAuthenticated: Boolean(token),
    requireAuth,
    redirectIfAuthenticated,
  };
};

export const ProtectedRoute = ({
  children,
  allowedRoles,
  loginRedirect = "/login",
  unauthorizedRedirect = "/",
  loginMessage = "You have to login first",
  unauthorizedMessage = "You are not allowed to access this page.",
}) => {
  const { currentUser, token } = useProtectedRoute();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const handledRef = useRef(false);
  const fromPath = `${location.pathname}${location.search || ""}`;

  const hasRoleAccess =
    !Array.isArray(allowedRoles) ||
    allowedRoles.length === 0 ||
    allowedRoles.includes(currentUser?.role);

  useEffect(() => {
    if (handledRef.current) return;

    if (!token) {
      handledRef.current = true;
      toast(toastPayload(loginMessage, "warning"));
      navigate(loginRedirect, {
        replace: true,
        state: { from: fromPath },
      });
      return;
    }

    if (!hasRoleAccess) {
      handledRef.current = true;
      toast(toastPayload(unauthorizedMessage, "error"));
      navigate(unauthorizedRedirect, { replace: true });
    }
  }, [
    hasRoleAccess,
    loginMessage,
    loginRedirect,
    fromPath,
    navigate,
    token,
    toast,
    unauthorizedMessage,
    unauthorizedRedirect,
  ]);

  if (!token || !hasRoleAccess) {
    return null;
  }

  return children;
};

export const GuestRoute = ({ children, redirectTo = "/" }) => {
  const { token } = useProtectedRoute();

  if (token) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};
