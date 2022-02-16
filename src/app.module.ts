import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './cats/cat.entity';
import { CatsModule } from './cats/cats.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Cat, User],
      synchronize: true,
    }),
    CatsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
