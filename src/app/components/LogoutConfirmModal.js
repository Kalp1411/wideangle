"use client";

import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/store/authSlice";

export function useLogoutConfirm() {
  const dispatch = useDispatch();
  const router = useRouter();

  const showLogoutConfirm = async () => {
    const result = await Swal.fire({
      title: "Log Out",
      text: "Are you sure you want to log out of your account?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Log Out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#f28c28",
      cancelButtonColor: "#3a3b3f",
      background: "#1a1b1f",
      color: "#ffffff",
      customClass: {
        popup: "rounded-2xl",
      },
    });

    if (result.isConfirmed) {
      await dispatch(logoutUser());
      router.push("/");
    }
  };

  return showLogoutConfirm;
}
