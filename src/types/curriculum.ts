export interface CurriculumUploadResponse {
  message: string;
  jobApplicationId: string | number;
  fileName?: string;
  fileSize?: number;
  uploadedAt: string;
}

export interface CurriculumDownloadResponse {
  downloadUrl: string; // Signed URL to view / download resume PDF
}
