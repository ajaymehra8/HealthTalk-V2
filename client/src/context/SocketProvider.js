import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthState } from "./AuthProvider";

const SocketContext = createContext(null);

/*
 * Holds a single authenticated Socket.io connection for the logged-in user.
 * Re-connects whenever the user (and therefore the JWT) changes, and tears the
 * connection down on logout.
 */
const SocketProvider = ({ children }) => {
  const { user } = useAuthState();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?.jwt) {
      setSocket(null);
      return undefined;
    }

    const newSocket = io(process.env.REACT_APP_API_URL, {
      auth: { token: user.jwt },
      transports: ["websocket"],
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?.jwt]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
