"use client";

import { useRef, useState } from "react";

export function FileInput({
  accept = "image/jpeg,image/png,image/webp,image/gif,application/pdf",
  multiple = true,
  disabled,
  onFilesSelected,
}: {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onFilesSelected: (files: FileList) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setFileNames(Array.from(e.target.files).map((f) => f.name));
            onFilesSelected(e.target.files);
          }
          e.target.value = "";
        }}
        className="hidden"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="rounded-lg border border-emerald-600 text-emerald-700 bg-white px-4 py-2 text-sm font-medium hover:bg-emerald-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        اختيار ملف
      </button>
      <span className="text-xs text-stone-500">
        {fileNames.length > 0 ? fileNames.join("، ") : "لم يتم اختيار أي ملف"}
      </span>
    </div>
  );
}
