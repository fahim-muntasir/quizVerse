"use client";
import { useCheckAuth } from "@/hooks/useCheckAuth";

export const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useCheckAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center  bg-background">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-100"></div>
      </div>
    );
  }

  return children;
};