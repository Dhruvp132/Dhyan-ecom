import Sidenavbar from "@/app/_dashboardComponents/Sidenavbar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "dashboard ",
  description: "This is the dashboard  page",
};
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex-col">
      <Sidenavbar />
      {children}
    </div>
  );
};

export default layout;
