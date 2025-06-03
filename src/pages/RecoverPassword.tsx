import React from "react";
import RecoverPasswordForm from "../components/RecoverPasswordForm/RecoverPasswordForm";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";
import BackButton from "../components/BackButton";

const RecoverPassword: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AsideNavBar />
      <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
        <div className="absolute top-6 left-6 z-10">
          <BackButton />
        </div>
        <RecoverPasswordForm />
      </main>
    </div>
  );
};

export default RecoverPassword;
