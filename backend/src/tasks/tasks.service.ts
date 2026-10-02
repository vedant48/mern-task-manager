import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async create(data: { title: string; completed?: boolean }): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: data.title,
        completed: data.completed ?? false,
      },
    });
  }

  async update(id: string, data: { title?: string; completed?: boolean }): Promise<Task> {
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.completed !== undefined && { completed: data.completed }),
      },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.task.delete({
      where: { id },
    });
    return { message: 'Task deleted' };
  }
}
