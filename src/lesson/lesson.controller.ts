import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LessonService } from './lesson.service';

@Controller('lesson')
export class LessonController {
    constructor(
        private readonly lessonService: LessonService
    ){}
    @Get()
    findAll() {
        return this.lessonService.findAll()
    }
    @Get(':id')
    findOne(@Param('id') id: number){
        return this.lessonService.getStudentsOfOneLesson(id)
    }
    @Post('/:id/add-lesson')
    async addLesson(@Body() body, @Param('id') studentId: number) {
        return this.lessonService.addLesson(body.lessonId, studentId)
    }
    @Post('/:id/remove-lesson')
    async deleteLesson(@Body() body, @Param('id') studentId: number) {
        return this.lessonService.deleteLesson(body.lessonId, studentId)
    }
}
