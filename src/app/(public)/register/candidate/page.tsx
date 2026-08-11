import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

export default function CandidateRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8fafc]">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <RegisterForm initialRole="candidate" />
      </main>
      <Footer />
    </div>
  );
}
