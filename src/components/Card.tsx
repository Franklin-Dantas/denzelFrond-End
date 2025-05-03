import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={` p-6 rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;