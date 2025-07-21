"use client";

import { ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import Sidebar from "./components/sideBar";
import "./globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        <Box className="w-screen h-screen flex items-center overflow-hidden">
          <Box className={`${pathname === "/sign-in" || pathname === "/forgot-pass" || pathname === "/recover-pass" ? "hidden" : "w-[280px] h-screen"} `}>
            <Sidebar />
          </Box>
          <Box className={`${pathname === "/sign-in" || pathname === "/forgot-pass" || pathname === "/recover-pass" ? "w-screen h-screen" : "w-[90%] h-screen bg-[#F8F8F8] flex justify-center items-center"}`}>
            <Box className={`${pathname === "/sign-in" || pathname === "/forgot-pass" || pathname === "/recover-pass" ? "w-screen h-screen" : "h-[95%] w-[95%] bg-[#fff]"}`}>
              {children}
            </Box>
          </Box>
        </Box>
      </body>
    </html>
  );
}
