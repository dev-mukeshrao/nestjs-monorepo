import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from '@app/common-library/dtos/users/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from '@app/common-library/dtos/users/update-user.dto';

@Injectable()
export class UserApiService {

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService
  ) { }

  async create(userDetails: CreateUserDto): Promise<User> {
    const IsExistingUser = await this.findByEmail(userDetails.email)
    if (IsExistingUser) throw new BadRequestException('User is already registered!')
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    const user = this.userRepo.create({
      ...userDetails,
      password: hashedPassword,
    })

    return this.userRepo.save(user)
  }

  async findByEmail(email: string) {
    const user = this.userRepo.findOne({ where: { email } })
    if (!user) throw new NotFoundException('No such user!')
    return user
  }

  async getUserList() {
    const users = this.userRepo.find();
    if (!users) throw new NotFoundException('No Users available')
    return users
  }

  async updateUserRole(id: number, userDetail: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } })
    if (!user) throw new NotFoundException('No user found')
    const updatedUser = this.userRepo.merge(user, userDetail)
    return await this.userRepo.save(updatedUser)
  }

  async login(email: string, password: string) {
    const { user, isPasswordValid } = await this.validateUser(email, password)
    if (!user) throw new UnauthorizedException(`Unauthorized user: ${email}`)
    return this.signedUser(user.id, user.email, user.role)

  }

  private signedUser(userId: number, email: string, role: string) {
    const response = { sub: userId, email, role };
    return {
      access_token: this.jwtService.sign(response)
    }
  }


  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('user not found')

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password')

    return { user, isPasswordValid };
  }



}
