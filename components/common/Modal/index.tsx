"use client";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import { createPortal } from "react-dom";

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
};

export default function Modal({ children, onClose, title }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  const modalRoot = document.querySelector("#modal-portal");
  if (!modalRoot) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background border border-gray-900 w-full max-w-4xl rounded-lg shadow-xl"
      >
        {/* Heaser  */}
        <Header onClose={onClose} title={title} />

        {children}
      </div>
    </div>,
    modalRoot
  );
}
