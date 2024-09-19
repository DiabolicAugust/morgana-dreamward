import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseFilters,
  Query,
} from '@nestjs/common';
import { FragmentsService } from './fragments.service';
import {
  CreateFragmentDto,
  UpdateFragmentDto,
} from './dto/create-fragment.dto';
import { Fields } from '../data/enums/strings.enum';
import { Payload } from '../authorization/dto/payload.dto';
import { GetPayloadGuard } from '../decorators/guards/get-payload.guard';
import { IsAuthorGuard } from '../decorators/guards/is-author.guard';
import { AllExceptionsFilter } from '../decorators/filters/errors.filter';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('fragments')
export class FragmentsController {
  constructor(private readonly fragmentsService: FragmentsService) {}

  @Post('/dream/:id')
  @UseGuards(GetPayloadGuard, IsAuthorGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(AllExceptionsFilter)
  create(
    @Body() dto: CreateFragmentDto,
    @Request() req: Request,
    @Param('id') dreamId: string,
  ) {
    const user: Payload = req[Fields.USER];
    return this.fragmentsService.create(dto, dreamId, user.id);
  }

  @Get('/?:dreamId')
  findAll(@Query('dreamId') dreamId: string) {
    return this.fragmentsService.findAll(dreamId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fragmentsService.findOne(id);
  }

  @Patch('dream/:id/fragment/:fragmentId')
  @UseGuards(GetPayloadGuard, IsAuthorGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(AllExceptionsFilter)
  update(
    @Param('fragmentId') id: string,
    @Body() dto: UpdateFragmentDto,
    @Request() req: Request,
  ) {
    const user: Payload = req[Fields.USER];
    return this.fragmentsService.update(id, dto, user.id);
  }

  @Patch('/order/dream/:id')
  updateOtder(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
    @Request() req: Request,
  ) {
    const user: Payload = req[Fields.USER];
    return this.fragmentsService.updateOrder(id, dto, user.id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.fragmentsService.remove(+id);
  // }
}
