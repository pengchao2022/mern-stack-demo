import redisClient from './redisClient.js';

export const connectRedis = async () => {
  console.log('checking redis connection...');
  
  try {
    const isHealthy = await redisClient.healthCheck();
    
    if (isHealthy) {
      console.log('Redis successfully connected!');
      
      // get redis server info
      const client = redisClient.getClient();
      const info = await client.info('server');
      
      const version = info.match(/redis_version:([^\r\n]+)/)?.[1] || 'unknown';
      const uptime = info.match(/uptime_in_days:([^\r\n]+)/)?.[1] || '0';
      
      console.log(`   Redis Version: ${version}`);
      console.log(`   Uptime: ${uptime} days`);
      console.log(`   Redis Host: ${client.options.host}:${client.options.port}`);
      
      return true;
    } else {
      console.log('connectRedis: Redis failed health check');
      return false;
    }
  } catch (error) {
    console.log('Redis check failed', error.message);
    console.log('Redis failed to connect');
    return false;
  }
};

export default connectRedis;