import {CustomFieldsIdCollection, IPhysic, ITerm} from '../types';
import {MissingRequireFieldTermError, UncorrectedReferenceTermError, UnknownActionTermError} from '../errors/terms';
import {PHYSIC_COLUMN_NAMES, TERM_COLUMN_NAMES} from '../constants';
import {$Keys} from 'utility-types';
import {MissingRequireFieldPhysicError, UncorrectedPathFormatPhysicError} from '../errors/physics';


export function validateTerm(term: ITerm): void {
  if (!term.parentTermName.length) {
    throw new MissingRequireFieldTermError(TERM_COLUMN_NAMES.parentTermName);
  }
  if (!term.termName.length) {
    throw new MissingRequireFieldTermError(TERM_COLUMN_NAMES.termName);
  }
  if (!(term.action === '' ||
      term.action.toUpperCase() === 'I' ||
      term.action.toUpperCase() === 'U' ||
      term.action.toUpperCase() === 'D')) {
    throw new UnknownActionTermError();
  }
  if (!term.description.length) {
    throw new MissingRequireFieldTermError(TERM_COLUMN_NAMES.description);
  }
  if (term.reference?.length && term.reference.split('.').length !== 3) {
    throw new UncorrectedReferenceTermError(term.termName, term.parentTermName);
  }
}

export function validatePhysic(physic: IPhysic): void {
  if (!physic.parentTermName.length) {
    throw new MissingRequireFieldPhysicError(PHYSIC_COLUMN_NAMES.parentTermName);
  }
  if (!physic.termName.length) {
    throw new MissingRequireFieldPhysicError(PHYSIC_COLUMN_NAMES.termName);
  }
  if (!physic.physicPath.length) {
    throw new MissingRequireFieldPhysicError(PHYSIC_COLUMN_NAMES.physicPath);
  }
  if (physic.physicPath.split('.').length < 3 || physic.physicPath.split('.').length > 4) {
    throw new UncorrectedPathFormatPhysicError();
  }
}

export function validateCustomFieldId(customFields: undefined | { [x: string]: any }): void {
  const keys: $Keys<CustomFieldsIdCollection>[] = [
    'lineageTable',
    'lineageRef',
    'alternativeName',
    'reference',
    'stewards',
  ];
  if (!customFields) {
    throw new Error('В конфигурационном файле отсутствуют идентификаторы custom fields');
  }


  for (const k of keys) {
    if (typeof customFields[k] !== 'number') {
      throw new Error(`В конфигурационном файле отсутствуют идентификатор custom fields ${k}`);
    }
  }
}
