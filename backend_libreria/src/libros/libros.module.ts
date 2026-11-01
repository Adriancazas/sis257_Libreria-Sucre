import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Libro } from './entities/libro.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Autor } from '../autores/entities/autor.entity';
import { LibrosService } from './libros.service';
import { LibrosController } from './libros.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Libro, Categoria, Autor])],
  controllers: [LibrosController],
  providers: [LibrosService],
  exports: [TypeOrmModule],
})
export class LibrosModule {}
