import { useEffect, useRef, useState } from 'react';
import { applicationsService } from '@/services/applications.service';
import { Application } from '@/types/application';

export const usePolling = (applicationId?: string, intervalMs = 3000) => {
  const [data, setData] = useState<Application | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!applicationId) return;

    setIsPolling(true);

    const checkStatus = async () => {
      try {
        const app = await applicationsService.getApplicationById(applicationId);
        setData(app);

        // Stop polling when evaluation is completed
        if (app && app.status === 'completed') {
          setIsPolling(false);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      } catch {
        // Continue polling on transient errors
      }
    };

    // Initial check
    checkStatus();

    timerRef.current = setInterval(checkStatus, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [applicationId, intervalMs]);

  return { data, isPolling };
};
