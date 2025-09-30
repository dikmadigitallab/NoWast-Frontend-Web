"use client";

import { useState, useEffect } from "react";
import { IoImagesOutline } from "react-icons/io5";
import { Box } from "@mui/material";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";

interface ImageInfo {
  name: string;
  type: string;
  size: number;
  previewUrl: string;
}

interface ImageUploaderProps {
  onChange?: (file: File | null, info?: ImageInfo | null) => void;
  label?: string;
  defaultValue?: ImageInfo | null;
  maxSizeMB?: number;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export function ImageUploader({
  onChange,
  label = "Selecione uma foto",
  defaultValue,
  maxSizeMB = 2,
  required = false,
  error = false,
  helperText,
}: ImageUploaderProps) {

  const [file, setFile] = useState<File | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(defaultValue || null);

  useEffect(() => {
    if (defaultValue) {
      setImageInfo(defaultValue);
    }
  }, [defaultValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (!newFile) return;

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (newFile.size > maxSizeBytes) {
      toast.error(`O arquivo excede o limite de ${maxSizeMB}MB`);
      e.target.value = "";
      return;
    }

    const imageData = {
      name: newFile.name,
      type: newFile.type,
      size: newFile.size,
      previewUrl: URL.createObjectURL(newFile),
    };

    setImageInfo(imageData);
    setFile(newFile);
    onChange?.(newFile, imageData);
  };

  const handleRemove = () => {
    setImageInfo(null);
    setFile(null);
    onChange?.(null, null);
  };

  return (
    <Box className="w-full">
      <Box className={`w-full h-[57px] flex items-center border border-dashed relative rounded-lg cursor-pointer ${error ? 'border-red-500' : 'border-[#5e58731f]'}`}>
        <input
          type="file"
          accept="image/*"
          className="w-full h-full opacity-0 cursor-pointer absolute inset-0"
          onChange={handleFileChange}
        />

        {imageInfo ? (
          <Box className="absolute w-full flex justify-between items-center p-3">
            <Box className="flex flex-row items-center gap-3">
              <img src={imageInfo.previewUrl} alt="Preview" className="w-[30px] h-[30px]" />
              <Box className="flex flex-col">
                <p className="text-[.8rem] text-[#000000]">Nome: {imageInfo.name}</p>
                <p className="text-[.6rem] text-[#242424]">Tipo: {imageInfo.type}</p>
                <p className="text-[.6rem] text-[#242424]">
                  Tamanho: {(imageInfo.size / 1024).toFixed(2)} KB
                </p>
              </Box>
            </Box>
            <IoMdClose color="#5E5873" onClick={handleRemove} className="cursor-pointer" />
          </Box>
        ) : (
          <Box className="absolute w-full flex justify-center items-center p-3 gap-2 pointer-events-none">
            <IoImagesOutline color={error ? "#d32f2f" : "#5E5873"} size={25} />
            <p className={`text-[.8rem] ${error ? 'text-red-500' : 'text-[#000000]'}`}>
              {label}{required && <span className="text-red-500 ml-1">*</span>}
            </p>
          </Box>
        )}
      </Box>
      {helperText && (
        <p className={`text-xs mt-1 ${error ? 'text-red-500' : 'text-[#6E6B7B]'}`}>
          {helperText}
        </p>
      )}
    </Box>
  );
}
