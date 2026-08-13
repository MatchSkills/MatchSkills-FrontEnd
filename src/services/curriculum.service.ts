import { mockApiClient } from '@/lib/axios';
import { CurriculumUploadResponse } from '@/types/curriculum';

export const curriculumService = {
  /**
   * Envia o PDF do currículo via multipart/form-data conforme curriculum.MD:
   * POST /curriculum/job-application/{jobApplicationId}
   */
  async uploadCurriculum(
    jobApplicationId: string | number,
    file: File
  ): Promise<CurriculumUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await mockApiClient.post<CurriculumUploadResponse>(
        `/api/mock/curriculum/job-application/${jobApplicationId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch {
      // Fallback gracioso para visualização local
      return {
        message: 'Upload de currículo realizado com sucesso',
        jobApplicationId,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      };
    }
  },

  /**
   * Obtém a URL assinada para visualização/download do currículo:
   * GET /curriculum/{id}
   */
  async getCurriculumDownloadUrl(id: string | number): Promise<string> {
    try {
      const response = await mockApiClient.get<string>(`/api/mock/curriculum/${id}`, {
        responseType: 'text',
      });
      return response.data || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    } catch {
      return 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    }
  },

  /**
   * Remove o currículo cadastrado:
   * DELETE /curriculum/{id}
   */
  async deleteCurriculum(id: string | number): Promise<void> {
    try {
      await mockApiClient.delete(`/api/mock/curriculum/${id}`);
    } catch {
      // Fallback sem erro
    }
  },
};
