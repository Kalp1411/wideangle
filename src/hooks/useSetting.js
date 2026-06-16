import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSetting } from "@/store/backgroundDataSlice";

export const useSetting = () => {
  const dispatch = useDispatch();

  const setting = useSelector((state) => state.backgroundData.setting);

  
  // useEffect(() => {
  //   if (!setting || Object.keys(setting).length === 0) {
  //     dispatch(fetchSetting());
  //   }
  //   const encryptedScreenId = searchParams?.s;
  //   const screenId = decryptData(encryptedScreenId);
  //   socket.emit("join-screen", { screenAssignId: screenId });
  //   return () => {
  //     socket.emit("leave-screen", { screenAssignId: screenId });
  //   };
  // }, [setting, dispatch]);

  useEffect(() => {
    if (!setting || Object.keys(setting).length === 0) {
      dispatch(fetchSetting());
    }
  }, [setting, dispatch]);

  return setting;
};