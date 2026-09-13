import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { type AuthRequest } from 'src/types/auth';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Post()
  async createProject(
    @Body() body: CreateProjectDto,
    @Request() req: AuthRequest,
  ) {
    return this.projectService.createProject(body, req.user.id);
  }

  @Get()
  async getProjects(@Request() req: AuthRequest) {
    return this.projectService.getProjects(req.user.id);
  }

  @Get(':id')
  async getProject(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.projectService.getProject(id, req.user.id);
  }

  @Patch(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() body: UpdateProjectDto,
    @Request() req: AuthRequest,
  ) {
    return this.projectService.updateProject(body, id, req.user.id);
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.projectService.deleteProject(id, req.user.id);
  }
}
