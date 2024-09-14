import { IsNotEmpty, Length } from "class-validator";
import { Student } from "../student/student.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn()
    id: number

    @Length(3,20)
    @Column()
    name: string

    @IsNotEmpty()
    @Column()
    master: string

    @Column()
    classTime: string

    @Column()
    examTime: string

    @ManyToMany(()=> Student, (student)=> student.lessons, {nullable: true})
    @JoinTable({ name: 'lesson_student'})
    students: Student[]
}