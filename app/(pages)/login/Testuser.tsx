import { useToast } from "@/components/ui/use-toast";
import React from "react";
import { CopyIcon } from "lucide-react";

const TestUser = () => {
  const { toast } = useToast();
  const AdminInfo = {
    email: "admin@gmail.com",
    password: "Password123@",
  };
  const UserInfo = {
    email: "user@gmail.com",
    password: "Password123@",
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
      duration: 3000,
      style: {
        backgroundColor: "#23446C",
        color: "#ECF2F5",
      },
    });
  };

  return (
    <div className="flex flex-col space-y-6 p-4 max-w-md mx-auto">
      <div className="p-4 bg-secondary/15 border border-secondary/30 rounded-lg">
        <h2 className="text-base font-semibold text-primary">
          Admin Test Account
        </h2>
        <div className="mt-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Email: {AdminInfo.email}</span>
            <CopyIcon
              size={15}
              className="cursor-pointer  text-gray-600 hover:text-gray-900"
              onClick={() => copyToClipboard(AdminInfo.email)}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-900">
              Password: {"*".repeat(AdminInfo.password.length)}
            </span>
            <CopyIcon
              size={15}
              className="cursor-pointer  text-gray-600 hover:text-gray-900"
              onClick={() => copyToClipboard(AdminInfo.password)}
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border border-border rounded-lg">
        <h2 className="text-base font-semibold text-primary">
          User Test Account
        </h2>
        <div className="mt-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Login ID: {UserInfo.email}</span>
            <CopyIcon
              size={15}
              className="cursor-pointer  text-gray-600 hover:text-gray-900"
              onClick={() => copyToClipboard(UserInfo.email)}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-900">
              Password: {"*".repeat(UserInfo.password.length)}
            </span>
            <CopyIcon
              size={15}
              className="cursor-pointer  text-gray-600 hover:text-gray-900"
              onClick={() => copyToClipboard(UserInfo.password)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestUser;
