"use client";
import React from "react";
import Link from "next/link";
import { UserPlus, Loader2 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { SignUpFormValues } from "@/types/auth";
import { signUpSchema } from "@/schemas";
import Button from "../ui/Button";
import FieldContainer from "../ui/FieldContainer";

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
            <FieldContainer label="Full Name" name="fullName">
              <Field
                type="text"
                name="fullName"
                className="block w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
                placeholder="John Doe"
              />
              <ErrorMessage
                name="fullName"
                component="div"
                className="text-sm text-danger-light"
              />
            </FieldContainer>

            <FieldContainer label="Email" name="email">
              <Field
                type="email"
                name="email"
                className="block w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
                placeholder="you@example.com"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-sm text-danger-light"
              />
            </FieldContainer>

            <FieldContainer label="Password" name="password">
              <Field
                type="password"
                name="password"
                className="block w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
                placeholder="••••••••"
                minLength={6}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-sm text-danger-light"
              />
            </FieldContainer>

            <Button type="submit" isDisabled={isSubmitting} fullWidth={true}>
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <UserPlus className="w-5 h-5 mr-2" />
              )}
              Sign Up
            </Button>

            <div className="text-center mt-4">
              <Link
                href="/auth/signin"
                className="text-sm text-primary hover:text-primary-light"
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
