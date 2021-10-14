import path from 'path';
import {$Keys} from 'utility-types';
import {IPhysic, ITerm} from '../types';

export const getTermsLogPath = (base: string): string => path.join(base, 'term_log.tsv');

export const getPhysicsLogPath = (base: string): string => path.join(base, 'physics_log.tsv');

// eslint-disable-next-line no-unused-vars
export const TERM_COLUMN_NAMES: { [x in $Keys<ITerm>]: string } = {
  parentTermName: 'Родительский термин',
  termName: 'Термин',
  action: 'Action',
  cluster: 'Кластер данных',
  alternativeName: 'Alternative name',
  description: 'Описание',
  stewards: 'Steward',
  reference: 'Reference',
};

// eslint-disable-next-line no-unused-vars
export const PHYSIC_COLUMN_NAMES: { [x in $Keys<IPhysic>]: string } = {
  parentTermName: 'Родительский термин',
  termName: 'Термин',
  title: 'Название',
  description: 'Описание',
  physicPath: 'Объект БД',
};

// eslint-disable-next-line no-unused-vars
export const TERM_FIELDS_POSITION: { [x in $Keys<ITerm>]: number } = {
  parentTermName: 0,
  termName: 1,
  action: 2,
  cluster: 3,
  alternativeName: 4,
  description: 5,
  stewards: 6,
  reference: 7,
};

// eslint-disable-next-line no-unused-vars
export const PHYSICS_FIELDS_POSITION: { [x in $Keys<IPhysic>]: number } = {
  parentTermName: 0,
  termName: 1,
  title: 2,
  description: 3,
  physicPath: 4,
};
