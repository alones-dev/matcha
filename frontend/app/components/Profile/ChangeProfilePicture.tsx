"use client"

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { FiCamera, FiX, FiCheck } from 'react-icons/fi';

interface ChangeProfilePictureProps {
  currentAvatar: string;
  onClose: () => void;
  onSave: (file: File) => Promise<void>;
}

const ChangeProfilePicture: React.FC<ChangeProfilePictureProps> = ({ currentAvatar, onClose, onSave }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (selectedFile) {
      setIsLoading(true);
      try {
        await onSave(selectedFile);
        onClose();
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden z-10">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Changer la photo de profil</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <FiX className="text-gray-600 text-xl" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <Image
                src={previewUrl || currentAvatar || '/default_avatar.png'}
                alt="Profile preview"
                fill
                className="object-cover"
              />
            </div>
            
            <button
              onClick={triggerFileInput}
              className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors flex items-center gap-2"
            >
              <FiCamera className="text-lg" />
              <span>Sélectionner une image</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </button>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedFile || isLoading}
            className={`px-4 py-2 text-white rounded-full transition-colors flex items-center gap-2 ${
              !selectedFile || isLoading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'cursor-pointer bg-gradient-to-r from-[#B700FF] via-[#FF00D0] to-[#FF007B] hover:opacity-90'
            }`}
          >
            {isLoading ? (
              'Enregistrement...'
            ) : (
              <>
                <FiCheck className="text-lg" />
                <span>Enregistrer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePicture;