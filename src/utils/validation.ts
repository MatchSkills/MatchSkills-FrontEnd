import { z } from 'zod';

export const cleanDigits = (val: string) => val.replace(/\D/g, '');

export const loginCandidateSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export const loginCompanySchema = z.object({
  cnpj: z
    .string()
    .min(14, 'CNPJ deve ter pelo menos 14 dígitos')
    .refine((val) => cleanDigits(val).length === 14, {
      message: 'CNPJ deve ter exatamente 14 números',
    }),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export const registerCandidateSchema = z.object({
  name: z.string().min(3, 'Nome completo é obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone deve ter ao menos 10 dígitos (DDD + número)'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Você deve aceitar os termos de serviço',
  }),
});

export const registerCompanySchema = z.object({
  name: z.string().min(3, 'Nome da empresa é obrigatório'),
  cnpj: z
    .string()
    .min(14, 'CNPJ é obrigatório')
    .refine((val) => cleanDigits(val).length === 14, {
      message: 'CNPJ inválido (deve conter 14 dígitos)',
    }),
  email: z.string().email('E-mail corporativo inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  address: z.string().min(5, 'Endereço da empresa é obrigatório'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Você deve aceitar os termos de serviço',
  }),
});

export const createJobSchema = z.object({
  title: z.string().min(4, 'O título da vaga é obrigatório (mín. 4 caracteres)'),
  description: z.string().min(20, 'A descrição deve ter no mínimo 20 caracteres'),
  location: z.string().min(3, 'Local de trabalho é obrigatório'),
  hardSkills: z.array(z.string()).min(1, 'Adicione pelo menos 1 Hard Skill'),
  softSkills: z
    .record(z.string(), z.number().min(1).max(5))
    .refine((val) => Object.keys(val).length > 0, {
      message: 'Adicione pelo menos 1 Soft Skill com nível',
    }),
});

export const fileSchema = z
  .custom<File>((file) => typeof window !== 'undefined' && file instanceof File, {
    message: 'Por favor, selecione um arquivo',
  })
  .refine((file) => file.type === 'application/pdf', 'O arquivo deve ser no formato PDF')
  .refine((file) => file.size <= 5 * 1024 * 1024, 'O tamanho do arquivo deve ser menor que 5MB');

export type LoginCandidateInput = z.infer<typeof loginCandidateSchema>;
export type LoginCompanyInput = z.infer<typeof loginCompanySchema>;
export type RegisterCandidateInput = z.infer<typeof registerCandidateSchema>;
export type RegisterCompanyInput = z.infer<typeof registerCompanySchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
