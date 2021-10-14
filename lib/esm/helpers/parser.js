import { PHYSICS_FIELDS_POSITION, TERM_FIELDS_POSITION } from "../constants";
export function parseTerm(content) {
  const columns = content.split('\t');
  const result = {};

  for (const [fieldName, position] of Object.entries(TERM_FIELDS_POSITION)) {
    if (fieldName === 'stewards') {
      result[fieldName] = columns[position].split(',');
      continue;
    } // @ts-ignore


    result[fieldName] = columns[position];
  }

  return result;
}
export function parsePhysics(content) {
  const columns = content.split('\t');
  const result = {};

  for (const [fieldName, position] of Object.entries(PHYSICS_FIELDS_POSITION)) {
    // @ts-ignore
    result[fieldName] = columns[position];
  }

  return result;
}
//# sourceMappingURL=parser.js.map