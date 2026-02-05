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
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CoursesService } from '../courses.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('student/courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.STUDENT)
@ApiTags('Student Courses')
@ApiBearerAuth()
export class StudentCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published courses' })
  @ApiResponse({
    status: 200,
    description: 'Published courses retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Student access required',
  })
  async getPublishedCourses() {
    return this.coursesService.findAllCourses(true);
  }

  @Get('my-enrollments')
  @ApiOperation({ summary: "Get student's enrolled courses" })
  @ApiResponse({
    status: 200,
    description: 'Enrollments retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Student access required',
  })
  async getMyEnrollments(@Request() req) {
    return this.coursesService.getStudentEnrollments(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get published course by ID' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course retrieved successfully' })
  @ApiResponse({
    status: 404,
    description: 'Course not found or not published',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiResponse({ status: 201, description: 'Enrolled successfully' })
  @ApiResponse({
    status: 400,
    description: 'Already enrolled or course not published',
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiResponse({
    status: 400,
    description: 'Not enrolled in course or already completed',
  })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
