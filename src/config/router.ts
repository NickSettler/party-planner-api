import { Routes } from '@nestjs/core';
import { CatsModule } from '../cats/cats.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../events/events.module';

export const routes: Routes = [
  {
    path: '/api',
    children: [AuthModule, CatsModule, UsersModule, EventsModule],
  },
];
