"use client";

import { useRouter } from "next/navigation";

const LoginButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/sign-up")}
      className="btn-primary text-sm px-4 py-1.5 rounded-md"
    >
      Get Started
    </button>
  );
};

export default LoginButton;
