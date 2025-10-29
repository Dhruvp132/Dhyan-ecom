"use client";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/providers/toolkit/hooks/hooks";
import { registerUser } from "@/providers/toolkit/features/RegisterUserSlice";
import TestUser from "../(pages)/login/Testuser";

interface SignupProps {
  name: string;
  email: string;
  password: string;
}

const RegisterLoginUser = () => {
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const [isLogin, setIsLogin] = useState<Boolean>(!false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const route = useRouter();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupProps>();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: SignupProps) => {
    setIsLoading(true);
    if (isLogin) {
      try {
        const user = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });
        setIsLoading(true);
        if (user?.error) {
          toast({
            title: "Error",
            description: user.error,
            duration: 3000,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Logged in successfully",
            duration: 3000,
            variant: "default",
            style: {
              backgroundColor: "#191919",
              color: "#fff",
            },
          });
          route.push("/");
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Something went wrong",
          duration: 3000,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        await dispatch(registerUser(data)).unwrap();
        reset();
        setIsLogin(!isLogin);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Registration failed",
          duration: 3000,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Google sign-in failed",
        duration: 3000,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-12 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {isLogin ? "Login" : "Sign Up"}
          </h1>
          <p className="text-base text-gray-600">
            {isLogin
              ? "Welcome back! Enter your credentials to log in."
              : "Nice to meet you! Enter your details to register."}
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {!isLogin && (
            <div className="mb-6">
              <label
                className="block text-sm font-medium text-gray-900 mb-2"
                htmlFor="name"
              >
                Your Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name", { required: true })}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
            </div>
          )}
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-900 mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message || "Email is required"}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-900 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                    message:
                      "Password must include an uppercase letter, a lowercase letter, a number, and a special character",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all pr-10"
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <button
            className="w-full bg-black text-white font-semibold py-3 px-4 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>

          {isLogin && (
            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isLoading ? "Signing in..." : "Sign in with Google"}
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={toggleForm} 
              className="text-black font-semibold hover:underline focus:outline-none"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
          <TestUser />
        </form>
      </div>
    </div>
  );
};

export default RegisterLoginUser;
