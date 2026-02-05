import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { AdminCoursesController } from './controllers/admin-courses.controller';
import { StudentCoursesController } from './controllers/student-courses.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminCoursesController, StudentCoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
