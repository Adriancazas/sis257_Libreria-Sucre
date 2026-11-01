import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';

// El CRUD y el login con JWT de usuarios se agregan en la etapa de noviembre.
@Module({ imports: [TypeOrmModule.forFeature([Usuario])], exports: [TypeOrmModule] })
export class UsuariosModule {}
