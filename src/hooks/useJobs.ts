import { useCallback, useEffect, useState } from 'react';
import { jobsService } from '@/services/jobs.service';
import { CreateJobDTO, Job, PaginatedJobs, UpdateJobDTO } from '@/types/job';
import { toast } from 'sonner';

export interface UseJobsOptions {
  enabled?: boolean;
}

export const useJobs = (companyId?: string, options: UseJobsOptions = {}) => {
  const { enabled = true } = options;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);

  const fetchJobs = useCallback(
    async (currentPage = 0, search = '') => {
      setIsLoading(true);
      try {
        let result: PaginatedJobs;
        if (companyId) {
          result = await jobsService.getJobsByCompany(companyId, currentPage);
        } else {
          result = await jobsService.getAllJobs(currentPage, 10, search);
        }
        setJobs(result.content);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
        setPage(result.page);
      } catch (err: any) {
        const errorMsg =
          err?.response?.data?.message ||
          (err?.response?.status === 403
            ? 'Acesso não autorizado para visualizar estas vagas.'
            : 'Erro ao carregar lista de vagas.');
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [companyId]
  );

  const fetchJobById = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const data = await jobsService.getJobById(id);
      setSelectedJob(data);
      return data;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || 'Erro ao obter detalhes da vaga.';
      toast.error(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createJob = async (data: CreateJobDTO) => {
    setIsLoading(true);
    try {
      const newJob = await jobsService.createJob(data);
      toast.success('Vaga criada com sucesso!');
      await fetchJobs(0);
      return newJob;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        (err?.response?.status === 403
          ? 'Você não tem permissão para cadastrar vagas com esta conta de empresa.'
          : err?.response?.status === 400
            ? 'Parâmetros inválidos ao criar vaga. Verifique os dados.'
            : 'Erro ao criar vaga no servidor.');
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateJob = async (id: string, data: UpdateJobDTO) => {
    setIsLoading(true);
    try {
      const updated = await jobsService.updateJob(id, data);
      toast.success('Vaga atualizada!');
      return updated;
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || 'Erro ao atualizar vaga.';
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteJob = async (id: string) => {
    setIsLoading(true);
    try {
      await jobsService.deleteJob(id);
      toast.success('Vaga removida com sucesso.');
      await fetchJobs(page);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || 'Erro ao remover vaga.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchJobs(0);
    }
  }, [fetchJobs, enabled]);

  return {
    jobs,
    selectedJob,
    isLoading,
    page,
    totalPages,
    totalElements,
    fetchJobs,
    fetchJobById,
    createJob,
    updateJob,
    deleteJob,
    setPage,
  };
};

