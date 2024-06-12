import useAuthStore from "@/Hooks/Authentication/useAuthStore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useQueryUser from "./useQueryUser";

export function ProtectedRoutesAdmin({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isforbidden, setIsforbidden] = useState(false);
  const navgate = useNavigate();

  const setuseAuthStore = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.roleId === 2) {
          setuseAuthStore(decoded);
          setIsforbidden(true);
        } else {
          setuseAuthStore(decoded);
        }
      } catch (err) {
        console.log(err);
        setuseAuthStore(null);
        localStorage.removeItem("token");
        // navgate("../login", { replace: true });
      }
    } else {
      // navgate("../login", { replace: true });
    }
    setIsChecking(false);
  }, []);

  if (isChecking) return <div>Checking if you are admin...</div>;

  if (isforbidden) return <div>Forbidden</div>;

  return children;
}

export function ProtectedRoutesShiftManager({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isforbidden, setIsforbidden] = useState(false);
  const navgate = useNavigate();

  const setuseAuthStore = useAuthStore((state) => state.setUser);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(token);
        if (decoded.roleId === 1) {
          setuseAuthStore(decoded);
          setIsforbidden(true);
        } else {
          setuseAuthStore(decoded);
        }
      } catch (err) {
        console.log(err);
        setuseAuthStore(null);
        localStorage.removeItem("token");
        navgate("/login", { replace: true });
      }
    } else {
      navgate("/login", { replace: true });
      console.log(token);
    }
    setIsChecking(false);
  });

  if (isChecking) return <div>Checking if you are admin...</div>;
  if (isforbidden) return <div>Forbidden</div>;

  // Below is setting the get lolskie

  return children;
}
