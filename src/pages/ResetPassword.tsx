import React from "react";
import ResetPasswordForm from "../components/ResetPasswordForm/ResetPasswordForm";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";

const ResetPassword: React.FC = () => (
  <div className="flex h-screen bg-gray-950">
    <AsideNavBar />
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-gray-950 md:ml-64 pt-20 md:pt-0">
      <ResetPasswordForm />
    </main>
  </div>
);

export default ResetPassword;
