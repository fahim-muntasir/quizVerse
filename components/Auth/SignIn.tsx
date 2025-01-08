"use client";
import React from "react";
import { LogIn, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/libs/utils";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { SignInFormValues } from "@/types/auth";
import { signInSchema } from "@/schemas";

export default function SignIn() {
  const initialValues: SignInFormValues = {
    email: "",
    password: "",
  };

  const doSubmit = (
    values: SignInFormValues,
    { setSubmitting }: FormikHelpers<SignInFormValues>
  ) => {
    console.log(values);
    setSubmitting(false);
  };

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Welcome Back
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={signInSchema}
        onSubmit={doSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <Field
                type="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
                placeholder="you@example.com"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-sm text-red-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <Field
                type="password"
                name="password"
                className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
                placeholder="••••••••"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-sm text-red-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              Sign In
            </button>

            <div className="text-center mt-4">
              <Link
                href="/auth/signup"
                className="text-sm text-green-500 hover:text-green-400"
              >
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
