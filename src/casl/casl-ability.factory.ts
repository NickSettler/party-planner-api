import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Action, AppAbility, lambdaMatcher, Subjects } from './types';
import { Event } from '../entities/event.entity';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      Ability as AbilityClass<AppAbility>,
    );

    can(Action.create, Event);
    can(
      Action.read,
      Event,
      (event: Event<true>) => event.created_by === user.id,
    );

    return build({
      conditionsMatcher: lambdaMatcher,
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
