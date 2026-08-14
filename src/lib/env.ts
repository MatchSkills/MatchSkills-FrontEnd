export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://matchskills-user-service.onrender.com',
  JOB_POSTING_API_URL:
    process.env.NEXT_PUBLIC_JOB_POSTING_API_URL ||
    'https://matchskills-jobposting-service.onrender.com',
  TELEGRAM_BOT_USERNAME: process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'MatchSkillsEvaluationBot',
  IS_DEV: process.env.NODE_ENV === 'development',
};

