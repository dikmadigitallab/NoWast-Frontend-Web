"use client";

import { ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import Sidebar from "./components/sideBar";
import "./globals.css";
import MobileNavigation from "./components/mobileBar";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  const pathname = usePathname();

  return (
    <html lang="pt-BR">
     {/*  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta> */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
       <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" /> 
      </head>
      <body className="bg-[red]">
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        <Box className="w-screen h-screen flex items-center overflow-hidden bg-[#fff]">
          <MobileNavigation />
          <Box className={`${pathname === "/sign-in" || pathname === "/forgot-pass" || pathname === "/recover-pass" ? "hidden" : "w-[280px] hidden xl:flex  h-screen"} `}>
            <Sidebar />
          </Box>
          <Box className={`${pathname === "/sign-in" || pathname === "/forgot-pass" || pathname === "/recover-pass" ? "w-screen h-screen" : "w-full xl:w-[90%] bg-[#f8f8f8] xl:mt-[0px] mt-[100px]  h-screen  flex justify-center items-center"}`}>
            <Box className={`${pathname === "/sign-in" || pathname === "/forgot-pass" || pathname === "/recover-pass" ? "w-screen h-screen" : "h-[95%] w-[95%] bg-[#fff] "}`}>
              {children}
            </Box>
          </Box>
        </Box>
      </body>
    </html>
  );
}
