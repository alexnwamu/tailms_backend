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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
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

@ApiTags('Admin Courses')
@ApiBearerAuth()
@Controller('admin/courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses (including unpublished)' })
  @ApiResponse({ status: 200, description: 'Courses retrieved successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getAllCourses() {
    return this.coursesService.findAllCourses(false);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getCourseById(@Param('id') id: string) {
    return this.coursesService.findCourseById(id, true);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(id, updateCourseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 204, description: 'Course deleted successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async deleteCourse(@Param('id') id: string) {
    await this.coursesService.deleteCourse(id);
  }

  @Post(':courseId/modules')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new module in a course' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 201, description: 'Module created successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async createModule(
    @Param('courseId') courseId: string,
    @Body() createModuleDto: CreateModuleDto,
  ) {
    return this.coursesService.createModule(courseId, createModuleDto);
  }

  @Patch('modules/:moduleId')
  @ApiOperation({ summary: 'Update a module' })
  @ApiParam({ name: 'moduleId', description: 'Module ID' })
  @ApiResponse({ status: 200, description: 'Module updated successfully' })
  @ApiResponse({ status: 404, description: 'Module not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async updateModule(
    @Param('moduleId') moduleId: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    return this.coursesService.updateModule(moduleId, updateModuleDto);
  }

  @Delete('modules/:moduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a module' })
  @ApiParam({ name: 'moduleId', description: 'Module ID' })
  @ApiResponse({ status: 204, description: 'Module deleted successfully' })
  @ApiResponse({ status: 404, description: 'Module not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async deleteModule(@Param('moduleId') moduleId: string) {
    await this.coursesService.deleteModule(moduleId);
  }

  @Post('modules/:moduleId/lessons')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new lesson in a module' })
  @ApiParam({ name: 'moduleId', description: 'Module ID' })
  @ApiResponse({ status: 201, description: 'Lesson created successfully' })
  @ApiResponse({ status: 404, description: 'Module not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async createLesson(
    @Param('moduleId') moduleId: string,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return this.coursesService.createLesson(moduleId, createLessonDto);
  }

  @Patch('lessons/:lessonId')
  @ApiOperation({ summary: 'Update a lesson' })
  @ApiParam({ name: 'lessonId', description: 'Lesson ID' })
  @ApiResponse({ status: 200, description: 'Lesson updated successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async updateLesson(
    @Param('lessonId') lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.coursesService.updateLesson(lessonId, updateLessonDto);
  }

  @Delete('lessons/:lessonId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a lesson' })
  @ApiParam({ name: 'lessonId', description: 'Lesson ID' })
  @ApiResponse({ status: 204, description: 'Lesson deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async deleteLesson(@Param('lessonId') lessonId: string) {
    await this.coursesService.deleteLesson(lessonId);
  }

  @Get(':courseId/enrollments')
  @ApiOperation({ summary: 'Get course enrollments' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'Enrollments retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getCourseEnrollments(@Param('courseId') courseId: string) {
    return this.coursesService.getCourseEnrollments(courseId);
  }
}
