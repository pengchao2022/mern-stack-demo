import Redis from 'ioredis';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

class RedisClient {
  constructor() {
    const config = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      db: process.env.REDIS_DB || 0,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true
    };

    // 只有在有密码时才添加 password 字段
    if (process.env.REDIS_PASSWORD) {
      config.password = process.env.REDIS_PASSWORD;
    }

    this.client = new Redis(config);

    // 事件监听
    this.client.on('connect', () => {
      console.log('Redis successfully connected!');
    });

    this.client.on('ready', () => {
      console.log('Redis is ready to use!');
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err.message);
    });

    this.client.on('reconnecting', () => {
      console.log('Redis is reconnecting...');
    });

    this.client.on('end', () => {
      console.log('Redis connection closed');
    });

    // 初始化连接
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
    } catch (error) {
      console.error('Redis failed to connect:', error.message);
      // 可以在这里实现重试逻辑
    }
  }

  async set(key, value, expireSeconds = null) {
    try {
      if (expireSeconds) {
        return await this.client.setex(key, expireSeconds, value);
      }
      return await this.client.set(key, value);
    } catch (error) {
      console.error('Redis SET error:', error);
      throw error;
    }
  }

  async get(key) {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      throw error;
    }
  }

  async del(key) {
    try {
      return await this.client.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
      throw error;
    }
  }

  async exists(key) {
    try {
      return await this.client.exists(key);
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      throw error;
    }
  }

  async expire(key, seconds) {
    try {
      return await this.client.expire(key, seconds);
    } catch (error) {
      console.error('Redis EXPIRE error:', error);
      throw error;
    }
  }

  async incr(key) {
    try {
      return await this.client.incr(key);
    } catch (error) {
      console.error('Redis INCR error:', error);
      throw error;
    }
  }

  async decr(key) {
    try {
      return await this.client.decr(key);
    } catch (error) {
      console.error('Redis DECR error:', error);
      throw error;
    }
  }

  async keys(pattern) {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      console.error('Redis KEYS error:', error);
      throw error;
    }
  }

  async ttl(key) {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error('Redis TTL error:', error);
      throw error;
    }
  }

  // 关闭连接
  async disconnect() {
    try {
      await this.client.quit();
    } catch (error) {
      console.error('Redis disconnect error:', error);
    }
  }

  // 获取原始客户端（用于高级操作）
  getClient() {
    return this.client;
  }

  // 健康检查
  async healthCheck() {
    try {
      const pong = await this.client.ping();
      return pong === 'PONG';
    } catch (error) {
      return false;
    }
  }
}

// 创建单例实例
const redisClient = new RedisClient();

// 进程退出时清理
process.on('SIGINT', async () => {
  await redisClient.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await redisClient.disconnect();
  process.exit(0);
});

export default redisClient;