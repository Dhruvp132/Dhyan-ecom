import type { Metadata } from "next";
import UserProfile from "@/app/components/UserProfile";

export const metadata: Metadata = {
  title: "My Profile - Dhyan Ecom",
  description: "Manage your profile, password, and account details",
};

const ProfilePage = () => {
  return <UserProfile />;
};

export default ProfilePage;