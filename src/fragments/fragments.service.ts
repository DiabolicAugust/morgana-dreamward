import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateFragmentDto,
  UpdateFragmentDto,
} from './dto/create-fragment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Fragment } from './entities/fragment.entity';
import { Repository } from 'typeorm';
import { User } from '../person/user/entities/user.entity';
import { Dream } from '../dreams/entities/dream.entity';
import { Strings } from '../data/strings';
import { Entities } from '../data/enums/strings.enum';
import { instanceToPlain } from 'class-transformer';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class FragmentsService {
  constructor(
    @InjectRepository(Fragment)
    private readonly fragmentRepository: Repository<Fragment>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Dream)
    private readonly dreamRepository: Repository<Dream>,
  ) {}

  async create(dto: CreateFragmentDto, dreamId: string, userId: string) {
    const user = await this.getUser(userId);
    const dream = await this.getDream(dreamId);

    const fragment = this.fragmentRepository.create({
      ...dto,
      author: user,
      relatedDream: dream,
      lastModifiedBy: user,
    });

    if (!dto.contentNumber) {
      const [data, count] = await this.fragmentRepository.findAndCountBy({
        relatedDream: dream,
      });
      fragment.contentNumber = count + 1;
    }

    const savedFragment = await this.fragmentRepository.save(fragment);
    if (!savedFragment)
      throw new HttpException(
        Strings.somethingWentWrong,
        HttpStatus.BAD_REQUEST,
      );
    return instanceToPlain(savedFragment);
  }

  async findAll(dreamId: string) {
    const dream = await this.getDream(dreamId);
    const fragments = await this.fragmentRepository.findBy({
      relatedDream: dream,
    });
    return fragments;
  }

  async findOne(id: string) {
    const fragment = await this.getFragment(id);
    return fragment;
  }

  async update(id: string, dto: UpdateFragmentDto, userId: string) {
    const user = await this.getUser(userId);
    const fragment = await this.getFragment(id);
    Object.assign(fragment, dto);
    fragment.lastModifiedBy = user;
    const updatedFragment = await this.fragmentRepository.save(fragment);
    return updatedFragment;
  }

  async updateOrder(id: string, dto: UpdateOrderDto, userId: string) {
    const user = await this.getUser(userId);

    const fragments: Fragment[] = await this.findAll(id);

    dto.order.forEach((orderItem) => {
      const fragment: Fragment = fragments.find(
        (frag) => frag.id === orderItem.id,
      );

      if (fragment) {
        fragment.contentNumber = orderItem.contentNumber;
        fragment.lastModifiedBy = user;
      }
    });
    const updatedFragments = await this.fragmentRepository.save(fragments);
    return instanceToPlain(updatedFragments);
  }

  remove(id: number) {
    return `This action removes a #${id} fragment`;
  }

  private async getUser(userId: string): Promise<User> {
    //Get User
    const user = await this.userRepository.findOne({ where: { id: userId } });

    //Check User existance
    if (!user)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.USER, userId),
        HttpStatus.BAD_REQUEST,
      );

    return user;
  }

  private async getDream(dreamId: string): Promise<Dream> {
    //Get Dream
    const dream = await this.dreamRepository.findOne({
      where: {
        id: dreamId,
      },
      relations: ['author'],
    });
    if (!dream)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.DREAM, dreamId),
        HttpStatus.BAD_REQUEST,
      );
    return dream;
  }

  private async getFragment(fragmentId: string): Promise<Fragment> {
    //Get Dream
    const fragment = await this.fragmentRepository.findOneBy({
      id: fragmentId,
    });
    if (!fragment)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.FRAGMENT, fragmentId),
        HttpStatus.BAD_REQUEST,
      );
    return fragment;
  }
}
