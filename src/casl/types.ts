import { InferSubjects, MatchConditions, PureAbility } from '@casl/ability';
import { User } from '../entities/user.entity';
import { Cat } from '../entities/cat.entity';
import { Event } from '../entities/event.entity';

export enum Action {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
}

export type Subjects =
  | InferSubjects<typeof User | typeof Cat | typeof Event>
  | 'all';

export type AppAbility = PureAbility<[Action, Subjects], MatchConditions>;
export const lambdaMatcher = (matchConditions: MatchConditions) =>
  matchConditions;
