import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class PaginationService {
  getPagination(paginationDto: PaginationDto) {
    const page = paginationDto.page ? +paginationDto.page : 1;
    const perPage = paginationDto.perPage ? +paginationDto.perPage : 30; //default items per page

    const skip = (page - 1) * perPage;

    return { perPage, skip };
  }
}
