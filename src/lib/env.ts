const formatBaseUrl = (url: string | undefined, defaultUrl: string): string => {
  const value = (url && url.trim().length > 0 ? url : defaultUrl).trim();
  const withProtocol = value.startsWith('http://') || value.startsWith('https://') 
    ? value 
    : `https://${value}`;
  return withProtocol.replace(/\/+$/, '');
};

export const ENV = {
  API_URL: formatBaseUrl(
    process.env.NEXT_PUBLIC_API_URL,
    'https://matchskills-user-service.onrender.com'
  ),
  JOB_POSTING_API_URL: formatBaseUrl(
    process.env.NEXT_PUBLIC_JOB_POSTING_API_URL,
    'https://matchskills-jobposting-service.onrender.com'
  ),
  JOB_APPLICATION_API_URL: formatBaseUrl(
    process.env.NEXT_PUBLIC_JOB_APPLICATION_API_URL,
    'https://matchskills-jobapplication-service.onrender.com'
  ),
  TELEGRAM_BOT_USERNAME: process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'MatchSkillsEvaluationBot',
  IS_DEV: process.env.NODE_ENV === 'development',
};

