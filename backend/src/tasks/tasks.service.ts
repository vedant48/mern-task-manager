import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class TasksService {
  async findAll(): Promise<any[]> {
    // Database integration will be implemented in Phase 2 with Prisma & PostgreSQL.
    // An empty array is returned to allow endpoint verification without fake in-memory persistence.
    return [];
  }

  async create(taskData: any): Promise<any> {
    // Persistence is intentionally deferred to Phase 2 (Prisma & PostgreSQL migration).
    throw new NotImplementedException(
      'Database persistence is scheduled for Phase 2 (Prisma + PostgreSQL migration).',
    );
  }

  async update(id: string, taskData: any): Promise<any> {
    // Persistence is intentionally deferred to Phase 2 (Prisma & PostgreSQL migration).
    throw new NotImplementedException(
      'Database persistence is scheduled for Phase 2 (Prisma + PostgreSQL migration).',
    );
  }

  async remove(id: string): Promise<any> {
    // Persistence is intentionally deferred to Phase 2 (Prisma & PostgreSQL migration).
    throw new NotImplementedException(
      'Database persistence is scheduled for Phase 2 (Prisma + PostgreSQL migration).',
    );
  }
}
