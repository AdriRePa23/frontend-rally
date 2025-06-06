import React from "react";
import RecoverPasswordForm from "../components/RecoverPasswordForm/RecoverPasswordForm";
import AsideNavBar from "../components/AsideNavBar/AsideNavBar";

const RecoverPassword: React.FC = () => (
  <div className="flex h-screen bg-gray-950">
    <AsideNavBar />
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-gray-950 md:ml-64 pt-20 md:pt-0">
      <RecoverPasswordForm />
    </main>
  </div>
);

export default RecoverPassword;
