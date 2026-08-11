import { useCallback, useEffect, useState } from 'react';
import { jobsService } from '@/services/jobs.service';
import { CreateJobDTO, Job, PaginatedJobs, UpdateJobDTO } from '@/types/job';
import { toast } from 'sonner';

export const useJobs = (companyId?: string) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);

  const fetchJobs = useCallback(
    async (currentPage = 0) => {
      setIsLoading(true);
      try {
        let result: PaginatedJobs;
        if (companyId) {
          result = await jobsService.getJobsByCompany(companyId, currentPage);
        } else {
          result = await jobsService.getAllJobs(currentPage);
        }
        setJobs(result.content);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
        setPage(result.page);
      } catch (err) {
        toast.error('Erro ao carregar lista de vagas.');
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
    } catch (err) {
      toast.error('Erro ao obter detalhes da vaga.');
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
    } catch (err) {
      toast.error('Erro ao criar vaga.');
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
    } catch (err) {
      toast.error('Erro ao atualizar vaga.');
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
    } catch (err) {
      toast.error('Erro ao remover vaga.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(0);
  }, [fetchJobs]);

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
