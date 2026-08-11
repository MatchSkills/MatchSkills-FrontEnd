import { BARS_THRESHOLDS } from '@/lib/constants';

export const getBarsBadgeColor = (score: number) => {
  if (score >= BARS_THRESHOLDS.TOP) {
    return {
      bg: 'bg-emerald-100 dark:bg-emerald-950/60',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-300 dark:border-emerald-800',
      label: 'Top 10%',
      icon: '🟢',
    };
  }
  if (score >= BARS_THRESHOLDS.MID) {
    return {
      bg: 'bg-amber-100 dark:bg-amber-950/60',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-300 dark:border-amber-800',
      label: 'Top 50%',
      icon: '🟡',
    };
  }
  return {
    bg: 'bg-rose-100 dark:bg-rose-950/60',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-300 dark:border-rose-800',
    label: 'Abaixo da média',
    icon: '🔴',
  };
};

export const formatCNPJ = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

export const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
};
