import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Student } from '../student/student.entity';
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private twilioClient: Twilio;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>

  ) {
    const accountSid = configService.get('TWILIO_ACCOUNT_SID');
    const authToken = configService.get('TWILIO_AUTH_TOKEN');

    this.twilioClient = new Twilio(accountSid, authToken);
   }
   async sendCode(phoneNumber: string) {
    const serviceSid = this.configService.get(
      'TWILIO_VERIFICATION_SERVICE_SID',
    ); 
    await this.twilioClient.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phoneNumber, channel: 'sms' })
  }
  async verifyCode(phoneNumber: string, code: string) {
    const serviceSid = this.configService.get(
      'TWILIO_VERIFICATION_SERVICE_SID',
    );

    const student = await this.studentRepository.findOne({ where: {phoneNumber: phoneNumber}})
    if(!student) throw new NotFoundException("Wrong Phone Number!");

    await this.twilioClient.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phoneNumber, code: code })
      .catch(err => {
        throw new UnauthorizedException('Wrong Code!') 
      })
      return {
        id: student.id,
        name: student.name,
        token: this.getTokenForUser(student)
      }
    }


  public getTokenForUser(user: Student): string {
    return this.jwtService.sign({
      username: user.username,
      sub: user.id
    });
  }
 
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}


