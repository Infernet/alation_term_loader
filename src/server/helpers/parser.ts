import {ITerm, TermActionEnum} from '../types';
import {$Keys, Omit} from 'utility-types';
import {EmptyBodyError, ITermLogData, UncorrectedReferenceError, UniqTermKeyError, UnknownActionError} from '../errors';

type TermFieldKeys = Omit<Omit<ITerm, 'position'>, 'filename'>;

const TERM_FIELDS_POSITION: { [x in $Keys<TermFieldKeys>]: number } = {
  parent: 0,
  name: 1,
  action: 2,
  cluster: 3,
  alternativeName: 4,
  body: 5,
  stewards: 6,
  reference: 7,
};

export function parseTerm(position: number, filename: string, content: string): ITerm {
  const columns = content.split('\t');
  const term: ITerm = {
    filename,
    position,
  } as ITerm;

  const logData: ITermLogData = {
    filename,
    position,
    termName: columns[TERM_FIELDS_POSITION.name],
    parent: columns[TERM_FIELDS_POSITION.parent],
  };

  for (const key of Object.keys(TERM_FIELDS_POSITION)) {
    switch (key) {
      case 'parent':
      case 'name': {
        const name = columns[TERM_FIELDS_POSITION[key]];
        if (!name.length) {
          throw new UniqTermKeyError(logData);
        }
        term[key] = name;
      }
        break;
      case 'action':
        term[key] = parseAction(logData, columns[TERM_FIELDS_POSITION[key]]);
        break;
      case 'cluster':
      case 'alternativeName':
        term[key] = columns[TERM_FIELDS_POSITION[key]] ?? '';
        break;
      case 'body': {
        const body = columns[TERM_FIELDS_POSITION[key]];
        if (!body.length) {
          throw new EmptyBodyError(logData);
        }
        term.body = body;
      }
        break;
      case 'stewards': {
        const stewards = columns[TERM_FIELDS_POSITION[key]];
        term[key] = stewards.length ? stewards.split(',') : [];
      }
        break;
      case 'reference': {
        const path = columns[TERM_FIELDS_POSITION[key]];
        if (path.length && (path.split('.').length !== 3)) {
          throw new UncorrectedReferenceError(logData);
        }
        term[key] = path;
      }
        break;
    }
  }

  return term;
}

export function parseAction(logData: ITermLogData, actionField: string): TermActionEnum {
  switch (actionField.toUpperCase()) {
    case 'I':
    case '':
      return TermActionEnum.INSERT;
    case 'U':
      return TermActionEnum.UPDATE;
    case 'D':
      return TermActionEnum.DELETE;
    default:
      throw new UnknownActionError(logData);
  }
}
