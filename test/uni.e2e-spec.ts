import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

let app: INestApplication;
let mod: TestingModule;


describe('Student (e2e)', () => {
  beforeEach(async()=> {
    mod = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = mod.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init()

    return request(app.getHttpServer())
    .post('/student')
    .send({
      "name": "student-e2e",
      "birthDay": "1382/05/18",
      "phoneNumber": "+989196647482",
      "email": "jpg@gamil.com",
      "score": 16.38,
      "major": "Computer",
      "username": "jpg",
      "password": "test1234"
    })
  })
  afterEach(async () => {
    await app?.close()
  });

  it('should return a list of students', async () => {
    return request(app.getHttpServer())
      .get('/student')
      .expect(200)
      .then(response => {
        expect(response.body.length).toBe(1);
      });
  });

  it('should return a single student', async () => {
    return request(app.getHttpServer())
      .get('/student/1')
      .expect(200)
      .then(response => {
        expect(response.body.id).toBe(1);
        expect(response.body.name).toBe('student-e2e');
        expect(response.body.username).toBe('jpg');
      })
  });
  it('should return error when duplicate username', async()=> {
    return request(app.getHttpServer())
    .post('/student')
    .send({
      "name": "student-e2e",
      "birthDay": "1382/05/18",
      "phoneNumber": "+989196647481",
      "email": "jpg@gamil.com",
      "score": 16.38,
      "major": "Computer",
      "username": "jpg", /* duplicate username */
      "password": "test1234"
    })
    .expect(400)
    .then(response => {
      expect(response.body.message).toBe('try another username')
    })
  })
  it('should return error when duplicate phoneNumber', async()=> {
    return request(app.getHttpServer())
    .post('/student')
    .send({
      "name": "student-e2e",
      "birthDay": "1382/05/18",
      "phoneNumber": "+989196647482", /* duplicate phoneNumber */
      "email": "jpg@gamil.com",
      "score": 16.38,
      "major": "Computer",
      "username": "jpg123",
      "password": "test1234"
    })
    .expect(400)
    .then(response => {
      expect(response.body.message).toBe('try another phoneNumber')
    })
  })
  it('should return error when student not found', async()=> {
    return request(app.getHttpServer())
    .get('/student/100')
    .expect(404)
  })
  it('should update a single student with correct id', async()=>{
    return request(app.getHttpServer())
    .put('/student/1')
    .send({
      "name": "jpg"
    })
    .expect(200)
    .then(response=> {
      expect(response.body.name).toBe('jpg')
    })
  })
  it('should return erorr on update a single student with incorrect id', async()=>{
    return request(app.getHttpServer())
    .put('/student/100')
    .send({
      "name": "jpg"
    })
    .expect(404)
  })
  it('should remove a single student with correct id', async()=>{
    return request(app.getHttpServer())
    .delete('/student/1')
    .expect(200)
    .then(response =>'Student with id: 1 was deleted successfully')
  })
  it('should return error on remove a single student with incorrect id', async()=> {
    return request(app.getHttpServer())
    .delete('/student/100')
    .expect(404)
  })
});