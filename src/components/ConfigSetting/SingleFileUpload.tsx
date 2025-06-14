import React, { useRef } from 'react';
import { FaImage } from 'react-icons/fa6';

interface SingleFileUploadProps {
  label?: string;
  value: File | null;
  previewUrl?: string | null;
  onChange: (file: File | null) => void;
  required?: boolean;
  accept?: string;
  className?: string;
}

const SingleFileUpload: React.FC<SingleFileUploadProps> = ({
  label = 'Upload file',
  value,
  previewUrl,
  onChange,
  required = false,
  accept = 'image/*',
  className = '',
}) => {
  console.log('SingleFileUpload rendered with value:', value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        className="hidden"
        onChange={handleChange}
      />
      <div
        className="flex items-center justify-center w-36 h-36 border-2 border-dashed border-gray-300 rounded-md bg-white text-gray-500 cursor-pointer hover:bg-gray-100"
        onClick={handleClick}
      >
        {previewUrl ? (
          <div className="relative w-full h-full">
            <img
              src={previewUrl}
              alt="Preview"
              className="object-cover w-full h-full rounded-md"
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition-colors"
              onClick={handleRemove}
              aria-label="Remove image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-[#FAAD14] h-full">
            <FaImage size={20} />
            <span className="mt-2 block text-xs">Upload photo</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleFileUpload;
