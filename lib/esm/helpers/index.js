import { TERM_COLUMN_NAMES } from "../constants";
import { AlationTermError, ParentTermDuplicateTermError, ParentTermNotFoundTermError, TermNotFoundTermError } from "../errors/terms";
import { generateEntityLink, generateLineageTable, generateTextElement } from "./html";
import { DuplicateEntityError, EntityNotFoundError } from "../errors/physics";
export async function getParentTerm(connector, parentTermName) {
  const searchResult = await connector.Article.search({
    title: parentTermName
  }, true);

  if (!searchResult.length) {
    throw new ParentTermNotFoundTermError();
  }

  if (searchResult.length > 1) {
    throw new ParentTermDuplicateTermError();
  }

  return searchResult[0];
}
export function checkParentChildrenTermExists(parent, term) {
  for (const child of parent.children) {
    if (child.title === term.termName) {
      return true;
    }
  }

  return false;
}
export async function setLineageTableField(connector, customFieldId, article, table) {
  const result = await connector.updateCustomFieldsValue({
    field_id: customFieldId,
    oid: article.id,
    value: table ? table.toString() : generateLineageTable().toString(),
    otype: 'article'
  });
  return !!result;
}
export async function setAlternativeNameField(connector, customFieldId, article, alternativeName) {
  const result = await connector.updateCustomFieldsValue({
    field_id: customFieldId,
    oid: article.id,
    value: generateTextElement(alternativeName).toString(),
    otype: 'article'
  });
  return !!result;
}
export async function setReferenceField(connector, customFieldId, term, reference) {
  const response = await connector.updateCustomFieldsValue({
    otype: 'article',
    field_id: customFieldId,
    oid: term.id,
    value: reference ? generateEntityLink('table', await getTableByPath(connector, reference)).toString() : ''
  });
  return !!response;
}
export async function getTableByPath(connector, path) {
  const segments = path.split('.');
  const ds = await connector.Datasource.search({
    title: segments[0]
  }, true);

  if (ds.length !== 1) {
    throw new AlationTermError(TERM_COLUMN_NAMES.reference, `не удалось найти источник с названием ${segments[0]}, либо найдено несколько`);
  }

  const table = await connector.Table.search({
    name: segments[2].toLowerCase(),
    schema_name: segments[1].toLowerCase(),
    ds_id: ds[0].id
  }, true);

  if (table.length === 1) {
    return table[0];
  }

  throw new AlationTermError(TERM_COLUMN_NAMES.reference, `найдено несколько таблиц по ключу ${path}`);
}
export async function getTermByPath(connector, parentName, termName) {
  const parentTerm = await getParentTerm(connector, parentName);
  const findChild = parentTerm.children.find(child => child.title === termName && child.otype === 'article');

  if (findChild) {
    const term = await connector.Article.getById(findChild.id);

    if (term) {
      return term;
    }
  }

  throw new TermNotFoundTermError();
}
export async function updateStewardsField(connector, customFieldId, term, emailList) {
  const users = await connector.User.search({}, true);
  const foundedUsers = users.filter(user => emailList.includes(user.email));

  if (foundedUsers.length !== emailList.length) {
    return `не найдены пользователи с email: ${emailList.filter(email => foundedUsers.find(user => user.email === email)).join(',')}`;
  }

  const errors = [];

  for (const steward of foundedUsers) {
    const response = await connector.updateCustomFieldsValue({
      field_id: customFieldId,
      otype: 'article',
      oid: term.id,
      value: {
        display_name: '',
        oid: steward.id,
        otype: 'user',
        url: steward.url,
        id: steward.id
      }
    });

    if (!response) {
      errors.push(steward.display_name);
    }
  }

  if (errors.length) {
    return `не удалось добавить steward: ${errors.join(',')}`;
  }
}
export function checkSearchResult(result) {
  if (!result.length) {
    throw new EntityNotFoundError();
  }

  if (result.length > 1) {
    throw new DuplicateEntityError();
  }

  return result[0];
}
//# sourceMappingURL=index.js.map