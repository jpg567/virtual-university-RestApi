import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { LessonService } from '../lesson/lesson.service';
import { Lesson } from '../lesson/lesson.entity';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Lesson]),
  ],
  providers: [StudentService, LessonService, AuthService, JwtService],
  controllers: [StudentController]
})
export class StudentModule {}
