import Usertable from "@/app/_dashboardComponents/Usertable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "dashboard users Page",
  description: "This is the dashboard users page",
};
const Dashboardusers = () => {
  return (
    <div>
      <Usertable />
    </div>
  );
};

export default Dashboardusers;
