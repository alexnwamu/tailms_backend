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
import { CoursesService } from '../courses.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('student/courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.STUDENT)
export class StudentCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getPublishedCourses() {
    return this.coursesService.findAllCourses(true);
  }

  @Get('my-enrollments')
  async getMyEnrollments(@Request() req) {
    return this.coursesService.getStudentEnrollments(req.user.id);
  }

  @Get(':id')
  async getCourseById(@Param('id') id: string) {
    return this.coursesService.findCourseById(id, false);
  }

  @Post(':courseId/enroll')
  @HttpCode(HttpStatus.CREATED)
  async enrollInCourse(@Param('courseId') courseId: string, @Request() req) {
    return this.coursesService.enrollStudent(req.user.id, courseId);
  }

  @Get(':courseId/progress')
  async getCourseProgress(@Param('courseId') courseId: string, @Request() req) {
    return this.coursesService.getEnrollmentProgress(req.user.id, courseId);
  }

  @Post('lessons/:lessonId/complete')
  @HttpCode(HttpStatus.OK)
  async markLessonComplete(@Param('lessonId') lessonId: string, @Request() req) {
    return this.coursesService.markLessonComplete(req.user.id, lessonId);
  }
}
