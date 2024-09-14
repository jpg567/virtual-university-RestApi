import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { LessonService } from '../lesson/lesson.service';
import { AuthService } from '../auth/auth.service';


@Controller('student')
export class StudentController {
    constructor( 
        private readonly studentService: StudentService,
        private readonly lessonService: LessonService,
        private readonly authService: AuthService

    ){}
    
    @Get()
    async findAll() {
        return this.studentService.findAll()
    }
    @Get("my-lessons/:id")
    async getLessons(@Param('id') id: number) {
        return this.lessonService.getLessonsOfOneStudent(id)
    }
    @Get(':id')
    async findOne(@Param('id') id: number){
        return this.studentService.findOne(id)
    }
    @Post()
    async create(@Body() input: CreateDto) {
        return this.studentService.create(input);
    }
    @Put(':id')
    async update(@Param('id') id: number, @Body() input: UpdateDto) {
        return this.studentService.update(id, input)
    }
    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.studentService.delete(id)
    }
}
