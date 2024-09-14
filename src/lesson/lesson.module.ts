import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Student } from '../student/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, Student])
  ],
  providers: [LessonService],
  controllers: [LessonController],
})
export class LessonModule {}
