import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Student Courses')
@ApiBearerAuth()
@Controller('student/courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.STUDENT)
export class StudentCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published courses' })
  @ApiResponse({ status: 200, description: 'Courses retrieved successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Student access required',
  })
  async getPublishedCourses() {
    return this.coursesService.findAllCourses(true);
  }

  @Get('my-enrollments')
  @ApiOperation({ summary: 'Get current user enrollments' })
  @ApiResponse({
    status: 200,
    description: 'Enrollments retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Student access required',
  })
  async getMyEnrollments(@Request() req) {
    return this.coursesService.getStudentEnrollments(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID (published only)' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Student access required',
  })
  async getCourseById(@Param('id') id: string) {
    return this.coursesService.findCourseById(id, false);
  }

  @Post(':courseId/enroll')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enroll in a course' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 201, description: 'Enrollment successful' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Student access required',
  })
  async enrollInCourse(@Param('courseId') courseId: string, @Request() req) {
    return this.coursesService.enrollStudent(req.user.id, courseId);
  }

  @Get(':courseId/progress')
  @ApiOperation({ summary: 'Get course progress' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Progress retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Student access required',
  })
  async getCourseProgress(@Param('courseId') courseId: string, @Request() req) {
    return this.coursesService.getEnrollmentProgress(req.user.id, courseId);
  }

  @Post('lessons/:lessonId/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark lesson as complete' })
  @ApiParam({ name: 'lessonId', description: 'Lesson ID' })
  @ApiResponse({ status: 200, description: 'Lesson marked as complete' })
  @ApiResponse({ status: 404, description: 'Lesson or enrollment not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Student access required',
  })
  async markLessonComplete(
    @Param('lessonId') lessonId: string,
    @Request() req,
  ) {
    return this.coursesService.markLessonComplete(req.user.id, lessonId);
  }
}
