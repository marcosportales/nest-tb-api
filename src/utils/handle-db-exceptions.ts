import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export function handleDbExceptions(err: any) {
  if (err.code === '23505') throw new BadRequestException(err.detail);
  this.logger.error(err.message);
  throw new InternalServerErrorException('Unexpected error, check server logs');
}
