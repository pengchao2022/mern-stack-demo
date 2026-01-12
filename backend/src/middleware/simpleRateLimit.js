import redisClient from '../config/redisClient.js';

/**
 * 最简单的速率限制器：20秒内最多10次请求
 */
export const simpleRateLimit = async (req, res, next) => {
  const WINDOW_SECONDS = 20;   // 20秒窗口
  const MAX_REQUESTS = 10;      // 最多10次请求
  
  try {
    // 使用 IP 地址标识用户
    const userKey = `ratelimit:${req.ip || 'unknown'}`;
    const client = redisClient.getClient();
    
    // 获取当前计数
    const current = await client.get(userKey);
    const count = current ? parseInt(current) : 0;
    
    // 检查是否超过限制
    if (count >= MAX_REQUESTS) {
      return res.status(429).json({
        error: 'You have too many requests in a very short time. Please try again later.',
        limit: MAX_REQUESTS,
        window: `${WINDOW_SECONDS}seconds`
      });
    }
    
    // 增加计数
    if (count === 0) {
      // 第一次请求，设置20秒过期
      await client.setex(userKey, WINDOW_SECONDS, 1);
    } else {
      await client.incr(userKey);
    }
    
    // 继续处理请求
    next();
  } catch (error) {
    // Redis出错时直接放行，不阻塞
    console.log('⚠️  Redis错误，跳过速率限制:', error.message);
    next();
  }
};