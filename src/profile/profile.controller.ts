import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('avatar'))
  create(
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.profileService.create(createProfileDto, avatar);
  }

  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.profileService.findUserById(uid);
  }
}
