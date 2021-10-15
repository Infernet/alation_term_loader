import {IPhysic, ITerm} from '../types';
import {PHYSICS_FIELDS_POSITION, TERM_FIELDS_POSITION} from '../constants';


export function parseTerm(content: string): ITerm {
  const columns = content.split('\t').map((e)=>e.trim());
  const result: ITerm = {} as ITerm;

  for (const [fieldName, position] of Object.entries(TERM_FIELDS_POSITION)) {
    if (fieldName === 'stewards') {
      result[fieldName] = columns[position]?.length ? columns[position].split(',') : [];
      continue;
    }
    // @ts-ignore
    result[fieldName] = columns[position]?.trim() ?? '';
  }

  return result;
}

export function parsePhysics(content: string): IPhysic {
  const columns = content.split('\t').map((e)=>e.trim());
  const result: IPhysic = {} as IPhysic;

  for (const [fieldName, position] of Object.entries(PHYSICS_FIELDS_POSITION)) {
    // @ts-ignore
    result[fieldName] = columns[position]?.trim() ?? '';
  }

  return result;
}
