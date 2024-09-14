import { IsEmail, IsEnum, IsNotEmpty, Length, MinLength } from "class-validator";
import { Lesson } from "../lesson/lesson.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

export enum Major {
  Computer = "Computer",
  Electrical = "Electrical",
  Mathematics = "Mathematics",
  Physics = "Physics",
  Chemistry = "Chemistry",  
  Biology = "Biology",
  Law = "Law",
  Psychology = "Psychology"
}
 
@Entity()
export class Student {
    constructor(partial?: Partial<Student>) {
        Object.assign(this, partial);
      }
    @PrimaryGeneratedColumn()
    id: number

    @Length(3,20)
    @Column()
    name: string
    
    @Column()
    birthDay: string
    
    @IsEmail()
    @Column()
    email: string

    @Column({ type: 'float'})
    score: number

    @IsEnum(Major, { message: 'Major can not be accepted!'})
    @Column('enum', { enum: Major})
    major: Major

    @Length(3,15)
    @Column({ unique: true })
    username: string

    @IsNotEmpty()
    @MinLength(8)
    @Column()
    password: string
    
    @Column({ unique: true })
    phoneNumber: string

    @ManyToMany(()=> Lesson, (lesson)=> lesson.students, {nullable: true})
    @JoinTable({ name: 'student_lesson'})
    lessons: Lesson[]
}