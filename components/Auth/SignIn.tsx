"use client";
import React from "react";
import { LogIn, Loader2 } from "lucide-react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { SignInFormValues } from "@/types/auth";
import { signInSchema } from "@/schemas";
import Button from "../ui/Button";
import FieldContainer from "../ui/FieldContainer";

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
            <FieldContainer label="Email" name="email">
              <Field
                type="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
                placeholder="you@example.com"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-sm text-danger-light"
              />
            </FieldContainer>

            <FieldContainer
              label="Password"
              name="password"
            >
              <Field
                type="password"
                name="password"
                className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
                placeholder="••••••••"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-sm text-danger-light"
              />
            </FieldContainer>

            <Button type="submit" isDisabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              Sign In
            </Button>

            <div className="text-center mt-4">
              <Link
                href="/auth/signup"
                className="text-sm text-primary hover:text-primary-light"
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
