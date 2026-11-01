import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Autor } from './entities/autor.entity';
import { CreateAutorDto, UpdateAutorDto } from './dto/create-autor.dto';

@Injectable()
export class AutoresService {
  constructor(@InjectRepository(Autor) private repo: Repository<Autor>) {}

  create(dto: CreateAutorDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Autor ${id} no existe`);
    return item;
  }

  async update(id: number, dto: UpdateAutorDto) {
    const item = await this.findOne(id);
    return this.repo.save(Object.assign(item, dto));
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repo.remove(item);
    return { mensaje: `Autor ${id} eliminado` };
  }
}
