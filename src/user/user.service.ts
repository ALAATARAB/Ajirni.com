import fs from "fs";
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import bcryptjs from "bcryptjs";
import { ConfigService } from "@nestjs/config";
import { Place } from "./entities/place.entity";
import path from "path";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Place) private placeRepo: Repository<Place>,
    private readonly configService: ConfigService
  ) {}

  async findOneById(userId: number): Promise<User> {
    let user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { place: true },
      select: { password: false, salt: false },
    });
    if (!user)
      throw new NotFoundException("There is No Id Like That " + userId);
    return user;
  }

  async findOneByEmail(
    email: string,
    password: string,
    verify: boolean
  ): Promise<User> {
    let user = await this.userRepo.findOne({ where: { email } });
    if (!user)
      throw new NotFoundException("There is No Email Like That " + email);
    if (!verify) return user;
    if (await user.validatePassword(password)) return user;
    throw new NotFoundException("There An Error With Email Or Password");
  }

  async updateUserPassword(userId: number, newPassword: string) {
    let user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user)
      throw new NotFoundException("There is No Id Like That " + userId);

    // hash the new password with the existed salt
    let hashedPassword = await bcryptjs.hash(newPassword, user.salt);
    user.password = hashedPassword;
    await this.userRepo.save(user);
    return user;
  }

  async createUser(
    fullInfo: Partial<User>,
    countryInfo: { country: string; city: string }
  ): Promise<User> {
    try {
      let place = await this.placeRepo.findOne({
        where: { country: countryInfo.country, city: countryInfo.city },
      });
      if (!place)
        throw new ConflictException(
          `There is no place like that: ${countryInfo.country} ${countryInfo.city}`
        );
      let salt = await bcryptjs.genSalt();
      let hashedPassword = await bcryptjs.hash(
        fullInfo.password as string,
        salt
      );
      fullInfo.password = hashedPassword;
      fullInfo.salt = salt;
      let user = await this.userRepo.save({ ...fullInfo, place });
      return user;
    } catch (err) {
      // if the email was used
      if (
        err.code === this.configService.get<string>("UNIQUE_EXCEPTION_CODE")
      ) {
        throw new ConflictException("There is an email such that");
      }
      throw new InternalServerErrorException();
    }
  }

  async deleteUser(userId: number) {
    let user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user)
      throw new NotFoundException("There is no id like that " + userId);
    await this.userRepo.remove(user);
  }

  fillTheCountries() {
    fs.readFile(path.join(__dirname,'..','..',"countriesData.json"), "utf-8", async (err, data) => {
      if (err) throw new InternalServerErrorException();
      let allData: { country: string; cities: string[] }[] = await JSON.parse(data);
      for (const { country, cities } of allData) {
        for (const city of cities) {
          await this.placeRepo.save({ country, city });
        }
      }
    });
  }

  async getAllCountries() {
    return await this.placeRepo.find();
  }
}
