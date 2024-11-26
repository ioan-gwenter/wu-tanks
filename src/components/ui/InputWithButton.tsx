import React, { useState } from 'react';

interface InputWithButtonProps {
    onSubmit: (value: string) => void;
    placeholder: string;
    buttonText: string;
}

const InputWithButton: React.FC<InputWithButtonProps> = ({ onSubmit, placeholder, buttonText }) => {
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        if (value.length === 8 && /^[a-zA-Z0-9]+$/.test(value)) {
            onSubmit(value);
        }
    };

    const isButtonDisabled = !(value.length === 8 && /^[a-zA-Z0-9]+$/.test(value));

    return (
        <div className="flex flex-row items-center justify-center gap-2">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                maxLength={8} // Limit the input to 8 characters
                className="rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
            />
            <button
                onClick={handleSubmit}
                disabled={isButtonDisabled}
                className={`rounded-md px-4 py-2 text-white shadow-md transition-transform transform ${isButtonDisabled
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'
                    }`}
            >
                {buttonText}
            </button>
        </div>
    );
};

export default InputWithButton;
