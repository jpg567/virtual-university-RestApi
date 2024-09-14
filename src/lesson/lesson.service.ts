import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { Student } from '../student/student.entity';

@Injectable()
export class LessonService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
        @InjectRepository(Lesson)
        private readonly lessonRepository: Repository<Lesson>
    ){}

    async findAll(): Promise<Lesson[]> {
        return this.lessonRepository.find()
    }
    async getStudentsOfOneLesson(id: number) {
        return this.lessonRepository.findOne({
            relations: {
                students: true
            },
            where: {
                id: id
            }
        })
    }
    async getLessonsOfOneStudent(id: number){
        const lessons = await this.studentRepository
        .createQueryBuilder()
        .relation(Student, 'lessons')
        .of(id)
        .loadMany()
        return {
            id: id,
            lessons: lessons
        }
    }
    async addLesson(lessonId: number, studentId: number){ 
        await this.studentRepository
        .createQueryBuilder()
        .relation(Student, 'lessons')
        .of(studentId)
        .add(lessonId)
        return this.getLessonsOfOneStudent(studentId)
    }
    async deleteLesson (lessonId: number, studentId: number){ 
        await this.studentRepository
        .createQueryBuilder()
        .relation(Student, 'lessons')
        .of(studentId)
        .remove(lessonId)
        return this.getLessonsOfOneStudent(studentId)
    }
}
