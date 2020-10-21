import React from "react";

function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mt-3"
      role="alert"
    >
      {children}
    </div>
  );
}

export default Alert;
