import { Routes } from '@nestjs/core';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { EventsModule } from '../events/events.module';

export const routes: Routes = [
  {
    path: '/api',
    children: [AuthModule, UsersModule, EventsModule],
  },
];
