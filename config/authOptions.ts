import { User, Session, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prismaDB } from "@/db/db.config";
import GoogleProvider from "next-auth/providers/google";

interface ExtendedUser extends User {
  id: string;
  isAdmin: boolean;
}

interface ExtendedSession extends Session {
  user: ExtendedUser;
}

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  );
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("You must provide both an email and a password");
        }

        if (!isValidEmail(credentials.email)) {
          throw new Error("Invalid email format");
        }

        if (!isValidPassword(credentials.password)) {
          throw new Error(
            "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character"
          );
        }

        const user = await prismaDB.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found or invalid email");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Password is incorrect");
        }
        return {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
        };
      },
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const email = profile?.email;
        if (!email) {
          return false;
        }

        await prismaDB.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            name: profile?.name || "Google User",
            password: "", // No password for Google users
            isAdmin: false,
          },
        });
      }
      return true;
    },
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.user = user as ExtendedUser;
      }
      
      // Always fetch the latest user data from database to ensure we have the correct MongoDB ObjectId
      if (token.email) {
        const dbUser = await prismaDB.user.findUnique({
          where: { email: token.email },
          select: { id: true, email: true, isAdmin: true, name: true }
        });
        
        if (dbUser) {
          token.user = {
            id: dbUser.id,
            email: dbUser.email,
            isAdmin: dbUser.isAdmin,
            name: dbUser.name,
          } as ExtendedUser;
        }
      }
      
      return token;
    },

    session: async ({ session, token }) => {
      if (token?.user) {
        session.user = token.user as ExtendedUser;
      }
      return session as ExtendedSession;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
};
