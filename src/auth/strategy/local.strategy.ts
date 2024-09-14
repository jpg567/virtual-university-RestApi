import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "../../student/student.entity";
import { Repository } from "typeorm";
import { Strategy } from 'passport-local'
import * as bcrypt from 'bcrypt'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>
  ) {
    super();
  }

  public async validate(
    username: string, password: string
  ): Promise<any> {
    const user = await this.studentRepository.findOne({
      where: { username }
    });

    if (!user) {
      this.logger.debug(`User ${username} not found!`);
      throw new UnauthorizedException();
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Invalid credentials for user ${username}`);
      throw new UnauthorizedException();
    }

    return user;
  }
}
