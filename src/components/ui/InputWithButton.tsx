// InputWithButton.tsx
import React, { useState } from 'react';

interface InputWithButtonProps {
    onSubmit: (value: string) => void;
    placeholder: string;
    buttonText: string;
}

const InputWithButton: React.FC<InputWithButtonProps> = ({ onSubmit, placeholder, buttonText }) => {
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        onSubmit(value);
    };

    return (
        <div className="flex flex-row items-center justify-center gap-2">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
            />
            <button
                onClick={handleSubmit}
                className="rounded-md bg-indigo-600 px-4 py-2 text-white shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
            >
                {buttonText}
            </button>
        </div>
    );
};

export default InputWithButton;