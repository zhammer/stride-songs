import React from "react";

export function Main({ children }: { children: React.ReactNode }) {
  return <main className="ml-5 mt-5">{children}</main>;
}

export function Header({
  title,
  subtitle,
}: {
  title: React.ReactNode;
  subtitle: React.ReactNode;
}) {
  return (
    <header className="ml-5">
      <h1 className="text-5xl font-bold text-gray-700">{title}</h1>
      <p className="text-lg text-gray-600 italic max-w-xl">{subtitle}</p>
    </header>
  );
}

export function Page({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-100 py-6">{children}</div>;
}
