import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadResult {
  success: boolean;
  message: string;
  documentId?: string;
}

interface DocumentUploadProps {
  onUploadComplete: (results: UploadResult[]) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = {
  'text/plain': ['.txt'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

if (!API_KEY) {
  console.error('API key is not set in environment variables');
}

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY || '',
};

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const results = await Promise.all(
        acceptedFiles.map(async (file) => {
          const content = await readFileContent(file);
          const metadata = {
            filename: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            source: file.name,
            author: 'System',
            category: 'AI/ML',
          };

          const response = await fetch('http://localhost:3001/api/documents/process', {
            method: 'POST',
            headers,
            body: JSON.stringify({ content, metadata }),
          });

          if (!response.ok) {
            throw new Error(`Failed to process ${file.name}`);
          }

          return response.json() as Promise<UploadResult>;
        })
      );

      onUploadComplete(results);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload documents');
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          resolve(e.target.result);
        } else {
          reject(new Error('Failed to read file content'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-dashed transition-colors duration-200 ease-in-out"
         style={{
           borderColor: isDragActive ? '#3b82f6' : '#e5e7eb',
           backgroundColor: isDragActive ? '#f3f4f6' : '#ffffff'
         }}>
      <div
        {...getRootProps()}
        className="flex flex-col items-center cursor-pointer py-8"
      >
        <input {...getInputProps()} />
        <svg
          className="w-12 h-12 text-blue-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <h3 className="text-lg font-semibold mb-2">
          {isDragActive
            ? 'Drop the files here'
            : 'Drag and drop files here, or click to select files'}
        </h3>
        <p className="text-sm text-gray-500 text-center">
          Supported formats: TXT, PDF, DOC, DOCX (max 10MB)
        </p>
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
            Uploading... {progress}%
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}; 