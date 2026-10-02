import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const needsSsl =
      process.env.NODE_ENV === 'production' ||
      Boolean(connectionString?.includes('sslmode=require')) ||
      process.env.DATABASE_SSL === 'true';

    const pool = new Pool({
      connectionString,
      ...(needsSsl && {
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
