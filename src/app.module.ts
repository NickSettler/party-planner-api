import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { CatsModule } from './cats/cats.module';
import { UsersModule } from './users/users.module';
import { User } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { routes } from './config/router';
import { Event } from './entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Cat, User, Event],
      retryAttempts: 20,
      retryDelay: 5000,
    }),
    CatsModule,
    UsersModule,
    AuthModule,
    RouterModule.register(routes),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
