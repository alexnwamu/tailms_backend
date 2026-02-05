import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async createCourse(createCourseDto: CreateCourseDto) {
    const { modules, ...courseData } = createCourseDto;

    return this.prisma.course.create({
      data: {
        ...courseData,
        modules: modules
          ? {
              create: modules.map((module, index) => ({
                title: module.title,
                description: module.description,
                order: module.order || index + 1,
                lessons: module.lessons
                  ? {
                      create: module.lessons.map((lesson, lessonIndex) => ({
                        title: lesson.title,
                        description: lesson.description,
                        videoUrl: lesson.videoUrl,
                        duration: lesson.duration,
                        order: lesson.order || lessonIndex + 1,
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findAllCourses(isPublishedOnly = false) {
    return this.prisma.course.findMany({
      where: isPublishedOnly ? { isPublished: true } : undefined,
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findCourseById(id: string, includeUnpublished = false) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!includeUnpublished && !course.isPublished) {
      throw new ForbiddenException('Course is not published');
    }

    return course;
  }

  async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    await this.findCourseById(id, true);

    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async deleteCourse(id: string) {
    await this.findCourseById(id, true);

    return this.prisma.course.delete({
      where: { id },
    });
  }

  async createModule(courseId: string, createModuleDto: CreateModuleDto) {
    await this.findCourseById(courseId, true);

    const { lessons, ...moduleData } = createModuleDto;

    return this.prisma.module.create({
      data: {
        ...moduleData,
        courseId,
        lessons: lessons
          ? {
              create: lessons.map((lesson, index) => ({
                title: lesson.title,
                description: lesson.description,
                videoUrl: lesson.videoUrl,
                duration: lesson.duration,
                order: lesson.order || index + 1,
              })),
            }
          : undefined,
      },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async updateModule(moduleId: string, updateModuleDto: UpdateModuleDto) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return this.prisma.module.update({
      where: { id: moduleId },
      data: updateModuleDto,
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async deleteModule(moduleId: string) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return this.prisma.module.delete({
      where: { id: moduleId },
    });
  }

  async createLesson(moduleId: string, createLessonDto: CreateLessonDto) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return this.prisma.lesson.create({
      data: {
        ...createLessonDto,
        moduleId,
      },
    });
  }

  async updateLesson(lessonId: string, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: updateLessonDto,
    });
  }

  async deleteLesson(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return this.prisma.lesson.delete({
      where: { id: lessonId },
    });
  }

  async enrollStudent(userId: string, courseId: string) {
    const course = await this.findCourseById(courseId);

    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('Already enrolled in this course');
    }

    return this.prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  orderBy: { order: 'asc' },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }

  async getStudentEnrollments(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  orderBy: { order: 'asc' },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
        },
        lessonCompletions: true,
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async getEnrollmentProgress(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
        lessonCompletions: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    const totalLessons = enrollment.course.modules.reduce(
      (acc, module) => acc + module.lessons.length,
      0,
    );

    const completedLessons = enrollment.lessonCompletions.length;
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    await this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { progress },
    });

    return {
      ...enrollment,
      progress,
      totalLessons,
      completedLessons,
    };
  }

  async markLessonComplete(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.module.courseId,
        },
      },
    });

    if (!enrollment) {
      throw new BadRequestException('Not enrolled in this course');
    }

    const existingCompletion = await this.prisma.lessonCompletion.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId,
        },
      },
    });

    if (existingCompletion) {
      return existingCompletion;
    }

    const completion = await this.prisma.lessonCompletion.create({
      data: {
        enrollmentId: enrollment.id,
        lessonId,
      },
    });

    await this.getEnrollmentProgress(userId, lesson.module.courseId);

    return completion;
  }

  async getCourseEnrollments(courseId: string) {
    await this.findCourseById(courseId, true);

    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
          },
        },
        lessonCompletions: true,
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }
}
