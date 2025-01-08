"use client";
import React from "react";
import Link from "next/link";
import { UserPlus, Loader2 } from "lucide-react";
import { cn } from "@/libs/utils";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { SignUpFormValues } from "@/types/auth";
import { signUpSchema } from "@/schemas";

export default function SignUp() {
  const initialValues: SignUpFormValues = {
    fullName: "",
    email: "",
    password: "",
  };

  const doSubmit = (
    values: SignUpFormValues,
    { setSubmitting }: FormikHelpers<SignUpFormValues>
  ) => {
    console.log(values);
    setSubmitting(false);
  };

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Create an Account
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={signUpSchema}
        onSubmit={doSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <Field
                type="text"
                name="fullName"
                className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
                placeholder="John Doe"
              />
              <ErrorMessage
                name="fullName"
                component="div"
                className="text-sm text-red-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
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
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <Field
                type="password"
                name="password"
                className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
                placeholder="••••••••"
                minLength={6}
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
                <UserPlus className="w-5 h-5 mr-2" />
              )}
              Sign Up
            </button>

            <div className="text-center mt-4">
              <Link
                href="/auth/signin"
                className="text-sm text-green-500 hover:text-green-400"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
