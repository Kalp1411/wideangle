"use client";

import { socket } from "@/utils/socket";
import { useEffect } from "react";
import { fetchSetting } from "./backgroundDataSlice";
import { useDispatch } from "react-redux";

export default function SocketProvider({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    // socket.on("connect", () => {
    //   console.log("🔌 Socket connected:", socket.id);
    // });

    // socket.on("disconnect", () => {
    //   console.log("⚠️ Socket disconnected");
    // });
    socket.on("settings_updated", (data) => {
      dispatch(fetchSetting());
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return children;
}