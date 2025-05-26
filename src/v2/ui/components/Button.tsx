import React from 'react';

type ButtonProps = {
  text: string;
  onClick?: () => void;
};

/**
 * A simple button component from app-lib-v2
 */
export const Button = ({ text, onClick }: ButtonProps) => {
  return (
    <button 
      onClick={onClick}
      style={{
        padding: '8px 16px',
        backgroundColor: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      {text}
    </button>
  );
};
