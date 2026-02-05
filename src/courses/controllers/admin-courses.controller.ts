import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CoursesService } from '../courses.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('admin/courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }

  @Get()
  async getAllCourses() {
    return this.coursesService.findAllCourses(false);
  }

  @Get(':id')
  async getCourseById(@Param('id') id: string) {
    return this.coursesService.findCourseById(id, true);
  }

  @Patch(':id')
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(id, updateCourseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCourse(@Param('id') id: string) {
    await this.coursesService.deleteCourse(id);
  }

  @Post(':courseId/modules')
  @HttpCode(HttpStatus.CREATED)
  async createModule(
    @Param('courseId') courseId: string,
    @Body() createModuleDto: CreateModuleDto,
  ) {
    return this.coursesService.createModule(courseId, createModuleDto);
  }

  @Patch('modules/:moduleId')
  async updateModule(
    @Param('moduleId') moduleId: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    return this.coursesService.updateModule(moduleId, updateModuleDto);
  }

  @Delete('modules/:moduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteModule(@Param('moduleId') moduleId: string) {
    await this.coursesService.deleteModule(moduleId);
  }

  @Post('modules/:moduleId/lessons')
  @HttpCode(HttpStatus.CREATED)
  async createLesson(
    @Param('moduleId') moduleId: string,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return this.coursesService.createLesson(moduleId, createLessonDto);
  }

  @Patch('lessons/:lessonId')
  async updateLesson(
    @Param('lessonId') lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.coursesService.updateLesson(lessonId, updateLessonDto);
  }

  @Delete('lessons/:lessonId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLesson(@Param('lessonId') lessonId: string) {
    await this.coursesService.deleteLesson(lessonId);
  }

  @Get(':courseId/enrollments')
  async getCourseEnrollments(@Param('courseId') courseId: string) {
    return this.coursesService.getCourseEnrollments(courseId);
  }
}
