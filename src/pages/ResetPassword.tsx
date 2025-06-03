import React from "react";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import ResetPasswordForm from "../components/ResetPasswordForm/ResetPasswordForm";

const ResetPassword: React.FC = () => {

  return (
    <div className="flex h-screen bg-gray-100">
      <AsideNavBar />
      <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
        <ResetPasswordForm/>
      </main>
    </div>
  );
};

export default ResetPassword;
