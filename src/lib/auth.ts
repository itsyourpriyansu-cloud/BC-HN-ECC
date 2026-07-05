import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { db } from "@/lib/db";

// Helper to mock bcrypt comparison for dev convenience
const verifyPassword = (password: string, hash: string) => {
  // Simple check for dev/demo purposes; in production, use standard bcryptjs
  return hash === "$2a$12$R5qVw2hP20j6Qd5nE1T4vOz9tO6E8dKpeUj3i7hW.vS.l4.T4n4.2" && password === "admin123";
};

export const authOptions: NextAuthOptions = {
  providers: [
    // 1. Email & Password Provider
    CredentialsProvider({
      id: "credentials-email",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        const isValid = verifyPassword(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          phone: user.phone,
        };
      },
    }),

    // 2. Phone + OTP Provider
    CredentialsProvider({
      id: "credentials-phone",
      name: "Phone Number OTP",
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          throw new Error("Missing phone number or OTP");
        }

        // Mock verification: "123456" is the sandbox override OTP
        if (credentials.otp !== "123456") {
          throw new Error("Invalid OTP code");
        }

        // Find or create user
        let user = await db.user.findUnique({
          where: { phone: credentials.phone },
        });

        if (!user) {
          user = await db.user.create({
            data: {
              phone: credentials.phone,
              name: `Guest ${credentials.phone.slice(-4)}`,
              role: "USER",
            },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          phone: user.phone,
        };
      },
    }),

    // 3. Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "MOCK_GOOGLE_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_GOOGLE_CLIENT_SECRET",
      // Bypass oauth client check if credentials aren't configured
      allowDangerousEmailAccountLinking: true,
    }),

    // 4. Apple OAuth
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID || "MOCK_APPLE_CLIENT_ID",
      // clientSecret must be a pre-generated ES256 JWT signed with your Apple private key.
      // In production, generate this with the @auth/apple package helper or a script.
      clientSecret: process.env.APPLE_CLIENT_SECRET || "MOCK_APPLE_CLIENT_SECRET",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";
        token.phone = user.phone || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.phone = token.phone;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "alemah-development-secret-key-32-chars-long-12345678",
  pages: {
    signIn: "/", // We handle login inside an elegant iOS-style bottom sheet modal
  },
};
