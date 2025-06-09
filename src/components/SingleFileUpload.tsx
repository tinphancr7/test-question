import React, { useRef } from "react";

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
  label = "Upload file",
  value,
  previewUrl,
  onChange,
  required = false,
  accept = "image/*",
  className = "",
}) => {
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
        className="flex items-center justify-center w-36 h-36 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-pointer hover:bg-gray-100"
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
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="mt-2 block text-xs">Upload photo</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleFileUpload;
