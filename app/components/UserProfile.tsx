"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { UploadButton } from "@/utils/uploadthing";

type UserProfileResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

const motionTransition = {
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1] as const,
};

const UserProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userId = (session?.user as { id?: string } | undefined)?.id;

  const initials = useMemo(() => {
    const value = name.trim() || email.trim();
    if (!value) return "U";
    const parts = value.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [name, email]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/get-user", { method: "GET" });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = (await response.json()) as UserProfileResponse & {
        message?: string;
      };

      if (!response.ok || !data.user) {
        throw new Error(data.message || "Unable to load profile");
      }

      setName(data.user.name || "");
      setEmail(data.user.email || "");
      setPhone(data.user.phone || "");
      setAvatarUrl(data.user.avatarUrl || "");
      setCreatedAt(data.user.createdAt || null);
      setUpdatedAt(data.user.updatedAt || null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load profile";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleProfileSave = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User session is missing. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    if (!normalizedName || !normalizedEmail) {
      toast({
        title: "Validation",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    setSavingProfile(true);
    try {
      const response = await fetch("/api/update-user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          updateData: {
            name: normalizedName,
            email: normalizedEmail,
            phone: normalizedPhone || null,
            avatarUrl: avatarUrl || null,
          },
        }),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
        duration: 3000,
        variant: "default",
        style: { backgroundColor: "#23446C", color: "#ECF2F5" },
      });
      await fetchProfile();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarPersist = async (url: string) => {
    if (!userId) return;

    try {
      const response = await fetch("/api/update-user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          updateData: { avatarUrl: url },
        }),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message || "Failed to save avatar");
      }

      toast({
        title: "Success",
        description: "Avatar updated successfully",
        duration: 2500,
        variant: "default",
        style: { backgroundColor: "#23446C", color: "#ECF2F5" },
      });
      await fetchProfile();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save avatar";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Validation",
        description: "All password fields are required.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation",
        description: "New password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }

    setSavingPassword(true);
    try {
      const response = await fetch("/api/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Success",
        description: "Password updated successfully",
        duration: 3000,
        variant: "default",
        style: { backgroundColor: "#23446C", color: "#ECF2F5" },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update password";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-[130px] pb-16 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-[130px] pb-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={motionTransition}
          className="space-y-6"
        >
          <Card className="border-gray-200 shadow-[0_18px_40px_rgba(35,68,108,0.08)]">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl text-gray-900">My Profile</CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Manage your personal information, password, and avatar.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-[#E9EFF6] text-[#23446C]">
                    Active Account
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 items-start">
                <div className="space-y-3">
                  <div className="relative w-36 h-36 rounded-full bg-[#E9EFF6] border border-gray-200 overflow-hidden flex items-center justify-center text-[#23446C] text-3xl font-semibold">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Profile avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Recommended: square image under 4MB.
                  </div>
                  <UploadButton
                    endpoint="imageUploader"
                    onUploadBegin={() => setAvatarUploading(true)}
                    onClientUploadComplete={async (res) => {
                      setAvatarUploading(false);
                      const uploaded = res?.[0]?.url;
                      if (!uploaded) return;
                      setAvatarUrl(uploaded);
                      await handleAvatarPersist(uploaded);
                    }}
                    onUploadError={(error: Error) => {
                      setAvatarUploading(false);
                      toast({
                        title: "Upload failed",
                        description: error.message,
                        variant: "destructive",
                      });
                    }}
                  />
                  {avatarUploading && (
                    <p className="text-sm text-gray-500">Uploading avatar...</p>
                  )}
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-900">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-900">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="phone" className="text-gray-900">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +919876543210"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      onClick={handleProfileSave}
                      disabled={savingProfile}
                      className="bg-primary hover:bg-[#2F5A8A]"
                    >
                      {savingProfile ? "Saving..." : "Save Profile"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={fetchProfile}
                      disabled={savingProfile}
                    >
                      Reset Changes
                    </Button>
                  </div>

                  <div className="pt-2 text-xs text-gray-500">
                    {createdAt && (
                      <p>
                        Created: {new Date(createdAt).toLocaleDateString("en-IN")}
                      </p>
                    )}
                    {updatedAt && (
                      <p>
                        Last updated: {new Date(updatedAt).toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-[0_18px_40px_rgba(35,68,108,0.08)]">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Change Password</CardTitle>
              <CardDescription className="text-gray-600">
                Enter your current password and choose a strong new password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="currentPassword" className="text-gray-900">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-900">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-900">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>

              <div className="mt-5">
                <Button
                  type="button"
                  onClick={handlePasswordUpdate}
                  disabled={savingPassword}
                  className="bg-primary hover:bg-[#2F5A8A]"
                >
                  {savingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <AnimatePresence>
            {status === "authenticated" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={motionTransition}
                className="text-center text-sm text-gray-500"
              >
                Need help with your account? Reach out from the Contact page.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;