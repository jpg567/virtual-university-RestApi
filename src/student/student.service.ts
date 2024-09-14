import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
        private readonly authService: AuthService
    ) {}

    async findAll(): Promise<Student[]> {
        return this.studentRepository
        .createQueryBuilder()
        .getMany()
    }
    async findOne(id:number): Promise<Student> {
        const student =  await this.studentRepository
            .createQueryBuilder("Student")
            .select("student")
            .from(Student, "student")
            .where("student.id = :id", { id: id })
            .getOne()
        if(!student) throw new NotFoundException()
        return student
    }
    async create(input): Promise<Student> {
        // return input
        return await this.studentRepository.save(
        {
            ...input,
            password: await this.authService.hashPassword(input.password),
        }).catch((err)=>{
            const duplicate = `${err.sqlMessage}`.startsWith("Duplicate entry")
            if(duplicate && `${err.sqlMessage}`.includes("+98")) throw new BadRequestException('try another phoneNumber')
            if(duplicate) throw new BadRequestException('try another username')
        })
    }
    

    async update(id: number, input): Promise<Student> {
        const student = await this.findOne(id)
        if(!student) throw new NotFoundException()
        if(input.password) throw new BadRequestException('You can not change your password here! Use forgot password option')
        await this.studentRepository.save({
            ...student,
            ...input
        })
        return await this.findOne(id)
    }
    async delete(id: number): Promise<String>{
        const student = await this.findOne(id)
        if(!student) throw new NotFoundException()
        await this.studentRepository.delete(student)
        return `Student with id: ${id} was deleted successfully`
    }
}
