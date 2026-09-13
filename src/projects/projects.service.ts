import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject({ name }: CreateProjectDto, ownerId: string) {
    const existingProj = await this.findProjectByUser(ownerId, name);

    if (existingProj)
      throw new ConflictException('A project already exists with this name');

    const newProject = await this.prisma.project.create({
      data: { name, ownerId: ownerId, normalizedName: name.toLowerCase() },
    });

    return { data: newProject };
  }

  async updateProject(
    { name }: UpdateProjectDto,
    projId: string,
    ownerId: string,
  ) {
    await this.findProjectByOwnership(projId, ownerId);

    const existingProj = await this.findProjectByUser(ownerId, name);

    if (existingProj)
      throw new ConflictException('A project already exists with this name');

    const updatedProject = await this.prisma.project.update({
      where: { id: projId },
      data: { name: name, normalizedName: name.toLowerCase() },
    });

    return { data: updatedProject };
  }

  async deleteProject(projId: string, ownerId: string) {
    await this.findProjectByOwnership(projId, ownerId);

    const deletedProject = await this.prisma.project.delete({
      where: { id: projId },
    });

    return { data: deletedProject };
  }

  async getProject(projId: string, ownerId: string) {
    const project = await this.findProjectByOwnership(projId, ownerId);

    return { data: project };
  }

  async getProjects(ownerId: string) {
    const projects = await this.prisma.project.findMany({ where: { ownerId } });

    return { data: projects };
  }

  private async findProjectByUser(userId: string, name: string) {
    return await this.prisma.project.findFirst({
      where: { ownerId: userId, normalizedName: name.toLowerCase() },
    });
  }

  private async findProjectByOwnership(projId: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projId },
    });

    if (!project || project?.ownerId !== userId)
      throw new NotFoundException('Project not found');

    return project;
  }
}
