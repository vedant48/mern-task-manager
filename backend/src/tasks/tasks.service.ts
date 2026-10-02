import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
import { TaskStatus, TaskPriority } from './enums/task.enums';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const status = createTaskDto.status ?? TaskStatus.TODO;
    const priority = createTaskDto.priority ?? TaskPriority.MEDIUM;
    const dueDate = createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null;
    const completed = status === TaskStatus.DONE;

    // Persist new task record with status, priority, and optional due date
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        completed,
        status,
        priority,
        dueDate,
      },
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.findOne(id);

    let status = updateTaskDto.status;
    let completed = updateTaskDto.completed;

    // Harmonize status and completed when one is updated without the other
    if (status !== undefined && completed === undefined) {
      completed = status === TaskStatus.DONE;
    } else if (completed !== undefined && status === undefined) {
      status = completed ? TaskStatus.DONE : TaskStatus.TODO;
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(updateTaskDto.title !== undefined && { title: updateTaskDto.title }),
        ...(completed !== undefined && { completed }),
        ...(status !== undefined && { status }),
        ...(updateTaskDto.priority !== undefined && { priority: updateTaskDto.priority }),
        ...(updateTaskDto.dueDate !== undefined && {
          dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : null,
        }),
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
