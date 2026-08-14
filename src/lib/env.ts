export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || '/api/proxy',
  JOB_POSTING_API_URL: process.env.NEXT_PUBLIC_JOB_POSTING_API_URL || '/api/jobs-proxy',
  TELEGRAM_BOT_USERNAME: process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'MatchSkillsEvaluationBot',
  IS_DEV: process.env.NODE_ENV === 'development',
};
