import { jobApplicationApiClient } from '@/lib/axios';
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

    const response = await jobApplicationApiClient.post<CurriculumUploadResponse>(
      `/curriculum/job-application/${jobApplicationId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Obtém a URL assinada para visualização/download do currículo conforme curriculum.MD:
   * GET /curriculum/{id}
   */
  async getCurriculumDownloadUrl(id: string | number): Promise<string> {
    const response = await jobApplicationApiClient.get<string>(`/curriculum/${id}`, {
      responseType: 'text',
    });
    return response.data;
  },

  /**
   * Remove o currículo cadastrado conforme curriculum.MD:
   * DELETE /curriculum/{id}
   */
  async deleteCurriculum(id: string | number): Promise<void> {
    await jobApplicationApiClient.delete(`/curriculum/${id}`);
  },
};
