
"use client";

import {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
  UserRound,
  Mail,
  Lock,
  Camera,
  X,
  BookOpen,
  Loader2,
} from "lucide-react";

import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  // Cleanup image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Profile image select
  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Please select a JPG, PNG or WEBP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setProfileImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview("");
  };

  // Secure server-side ImgBB upload
  const uploadImage = async (): Promise<string | null> => {
    if (!profileImage) return null;

    const formData = new FormData();
    formData.append("image", profileImage);

    const response = await fetch("/api/upload/profile-image", {
      method: "POST",
      body: formData,
      cache: "no-store",
    });

    const result: {
      success: boolean;
      url?: string;
      message?: string;
    } = await response.json();

    if (!response.ok || !result.success || !result.url) {
      throw new Error(
        result.message || "Profile image upload failed."
      );
    }

    return result.url;
  };

  // Email and password signup
  const handleSignUp = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading || socialLoading) return;

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      // Upload profile image first
      const imageUrl = await uploadImage();

      // Create Better Auth account
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: imageUrl || undefined,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Signup Error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google and GitHub signup
const handleSocialSignUp = async (
  provider: "google" | "github"
) => {
  if (socialLoading || loading) return;

  try {
    setSocialLoading(provider);

    const result = await authClient.signIn.social({
      provider,
      callbackURL: "/",
      errorCallbackURL: "/sign-up",
    });

    if (result.error) {
      console.error("OAuth Error:", result.error);
      toast.error(result.error.message || "Social login failed.");
      setSocialLoading("");
    }
  } catch (error) {
    console.error("Social Login Error:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Social login failed."
    );

    setSocialLoading("");
  }
};

  return (
    <main className="min-h-screen bg-[#F8F6EF] px-4 py-12">
      <div className="mx-auto grid min-h-[650px] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">

        {/* Left Side */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#173F35] p-12 text-white lg:flex">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />

          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border border-white/10" />

          <Link
            href="/"
            className="relative z-10 flex items-center gap-3"
          >
            <div className="rounded-xl bg-[#D8B76A] p-3 text-[#173F35]">
              <BookOpen size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-wide">
                NOVELNEST
              </h1>

              <p className="text-xs tracking-widest text-[#D8B76A]">
                A WORLD BETWEEN PAGES
              </p>
            </div>
          </Link>

          <div className="relative z-10 max-w-md">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#D8B76A]">
              Begin Your Journey
            </p>

            <h2 className="text-5xl font-bold leading-tight">
              Every book opens a new world.
            </h2>

            <p className="mt-6 leading-8 text-white/70">
              Join NovelNest and discover a world of stories, knowledge,
              imagination, and endless possibilities.
            </p>
          </div>

          <p className="relative z-10 text-sm text-white/50">
            © 2026 NovelNest. All rights reserved.
          </p>
        </section>

        {/* Right Side */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">

            <Link
              href="/"
              className="mb-8 flex items-center gap-2 text-sm font-semibold text-[#173F35] lg:hidden"
            >
              <BookOpen size={22} />
              NOVELNEST
            </Link>

            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#B18B43]">
                Create Account
              </p>

              <h2 className="text-3xl font-bold text-[#173F35]">
                Join NovelNest
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Create your account and start exploring.
              </p>
            </div>

            {/* Profile Image */}
            <div className="mb-7 flex flex-col items-center">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#F8F6EF] bg-[#E8EEE9]">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      width={96}
                      height={96}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound
                      size={38}
                      className="text-[#173F35]/50"
                    />
                  )}
                </div>

                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1.5 text-white transition hover:bg-red-600"
                    aria-label="Remove profile image"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-full border border-[#173F35]/20 px-4 py-2 text-sm font-medium text-[#173F35] transition hover:bg-[#F8F6EF]">
                <Camera size={16} />

                {profileImage ? "Change Photo" : "Upload Profile Photo"}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  disabled={loading || !!socialLoading}
                  className="hidden"
                />
              </label>

              <p className="mt-2 text-xs text-gray-400">
                JPG, PNG or WEBP (Maximum 5MB)
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSignUp} className="space-y-5">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-[#173F35]">
                  <UserRound size={18} className="text-gray-400" />

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading || !!socialLoading}
                    className="w-full bg-transparent py-3.5 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-[#173F35]">
                  <Mail size={18} className="text-gray-400" />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading || !!socialLoading}
                    className="w-full bg-transparent py-3.5 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-[#173F35]">
                  <Lock size={18} className="text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={loading || !!socialLoading}
                    className="w-full bg-transparent py-3.5 text-sm outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-[#173F35]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Password must contain at least 8 characters.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !!socialLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173F35] py-3.5 font-semibold text-white transition hover:bg-[#245748] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-xs text-gray-400">
                OR CONTINUE WITH
              </span>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Social Signup */}
            <div className="grid grid-cols-2 gap-4">

              {/* Google */}
              <button
                type="button"
                disabled={!!socialLoading || loading}
                onClick={() => handleSocialSignUp("google")}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {socialLoading === "google" ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <span className="text-lg font-bold text-red-500">
                    G
                  </span>
                )}

                Google
              </button>

              {/* GitHub */}
              <button
                type="button"
                disabled={!!socialLoading || loading}
                onClick={() => handleSocialSignUp("github")}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {socialLoading === "github" ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1.7 2.34 3.1 1.79.1-.73.4-1.23.72-1.52-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.13-1.45 3.08-1.15 3.08-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.33-2.64 5.29-5.15 5.57.41.35.77 1.03.77 2.08v3.1c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z" />
                  </svg>
                )}

                GitHub
              </button>
            </div>

            {/* Sign In Link */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}

              <Link
                href="/sign-in"
                className="font-bold text-[#173F35] hover:text-[#B18B43]"
              >
                Sign In
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
