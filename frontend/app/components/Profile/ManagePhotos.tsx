"use client"

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { FiX, FiPlus, FiTrash, FiCheck } from 'react-icons/fi'

interface ManagePhotosProps {
  initialPhotos: { id: number, url: string }[];
  onClose: () => void;
  onSave: (files: (File | null)[], deletions: number[]) => Promise<void>;
}

const MAX_PHOTOS = 5

const ManagePhotos: React.FC<ManagePhotosProps> = ({ initialPhotos, onClose, onSave }) => {
  const [photos, setPhotos] = useState<(File | { id: number, url: string } | null)[]>(
    [...initialPhotos, ...Array(MAX_PHOTOS - initialPhotos.length).fill(null)]
  );
  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>(
    photos.map(p => p ? (p instanceof File ? URL.createObjectURL(p) : p.url) : null)
  );
  const [deletions, setDeletions] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSelectFile = (index: number) => {
    if (!fileInputRef.current) return
    fileInputRef.current.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        const updatedPhotos = [...photos]
        updatedPhotos[index] = file
        setPhotos(updatedPhotos)

        const updatedPreviews = [...previewUrls]
        updatedPreviews[index] = URL.createObjectURL(file)
        setPreviewUrls(updatedPreviews)
      }
    }
    fileInputRef.current.click()
  }

  const handleRemovePhoto = (index: number) => {
    const photoToRemove = photos[index];
    
    if (photoToRemove && typeof photoToRemove === 'object' && 'id' in photoToRemove) {
      setDeletions(prev => [...prev, photoToRemove.id]);
    }
  
    const updatedPhotos = [...photos];
    updatedPhotos[index] = null;
    setPhotos(updatedPhotos);
  
    const updatedPreviews = [...previewUrls];
    updatedPreviews[index] = null;
    setPreviewUrls(updatedPreviews);
  };
  
  const handleSave = async () => {
    setIsLoading(true)
    try {
      const photoIdsToDelete = deletions;
      
      await onSave(
        photos.map(p => p instanceof File ? p : null), 
        photoIdsToDelete 
      )
      onClose()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des photos :", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden z-10">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Gérer mes photos</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <FiX className="text-gray-600 text-xl" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center group">
              {previewUrls[index] ? (
                <>
                  <Image
                    src={previewUrls[index]!}
                    alt={`Photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-black/80"
                  >
                    <FiTrash className="text-white text-sm" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleSelectFile(index)}
                  className="flex flex-col items-center justify-center text-gray-400 hover:text-gray-600"
                >
                  <FiPlus className="text-2xl" />
                </button>
              )}
            </div>
          ))}
          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" />
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 text-white rounded-full bg-gradient-to-r from-[#B700FF] via-[#FF00D0] to-[#FF007B] hover:opacity-90 transition-colors flex items-center gap-2"
          >
            {isLoading ? 'Enregistrement...' : (<><FiCheck /><span>Enregistrer</span></>)}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManagePhotos
