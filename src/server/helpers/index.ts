import {Alation, IAlationEntity, ITable, ObjectType} from 'alation_connector';
import {ITerm} from '../types';
import {ITermArticle, StewardCustomFieldValue} from '../types/alation';
import {ITermLogData, ParentTermDuplicateError, ParentTermNotFoundError, TermNotFoundError} from '../errors';
import {ALTERNATIVE_NAME_FIELD_ID, REFERENCE_FIELD_ID, STEWARDS_FIELD_ID} from '../constants/fields';
import {Assign} from 'utility-types';
import {IUser} from 'alation_connector/lib/types/models/UserModel';


export async function getParentTerm(connector: Alation, {
  parent,
  position,
  filename,
  name,
}: ITerm): Promise<ITermArticle> {
  const errorLog: ITermLogData = {position, termName: name, parent, filename};
  const searchResult = await connector.Article.search({title: parent}, true) as ITermArticle[];
  if (!searchResult.length) {
    throw new ParentTermNotFoundError(errorLog);
  }
  if (searchResult.length > 1) {
    throw new ParentTermDuplicateError(errorLog);
  }
  return searchResult[0];
}

export function checkParentChildrenTermExists(parent: ITermArticle, term: ITerm): boolean {
  for (const child of parent.children) {
    if (child.title === term.name) {
      return true;
    }
  }
  return false;
}


export async function setAlternativeNameField(connector: Alation, article: ITermArticle, alternativeName: string): Promise<void> {
  const result = await connector.updateCustomFieldsValue({
    field_id: ALTERNATIVE_NAME_FIELD_ID,
    oid: article.id,
    value: `<p>${alternativeName}</p>`,
    otype: 'article',
  });

  if (!result) {
    throw new Error('ERR-101 не удалось обновить поле Alternative name');
  }
}

export async function setReferenceField(connector: Alation, term: ITermArticle, reference: string): Promise<void> {
  const response = await connector.updateCustomFieldsValue({
    otype: 'article',
    field_id: REFERENCE_FIELD_ID,
    oid: term.id,
    value: reference ? generateEntityLink('table', await getTableByPath(connector, reference)) : '',
  });
  if (!response) {
    throw new Error('ERR-104 не удалось обновить поле Reference');
  }
}


export function generateEntityLink(otype: ObjectType, entity: Assign<IAlationEntity, { url: string }>): string {
  return `<a data-oid="${entity.id}" data-otype="${otype}" href="${entity.url}"></a>&nbsp;`;
}


export async function getTableByPath(connector: Alation, path: string): Promise<ITable> {
  const segments = path.split('.');
  const ds = await connector.Datasource.search({title: segments[0]}, true);
  if (ds.length !== 1) {
    throw new Error(`ERR-102 не удалось найти источник с названием ${segments[0]}, либо найдено несколько`);
  }
  const table = await connector.Table.search({
    name: segments[2].toLowerCase(),
    schema_name: segments[1].toLowerCase(),
    ds_id: ds[0].id,
  }, true);
  if (table.length === 1) {
    return table[0];
  }

  throw new Error(`ERR-103 найдено несколько таблиц по ключу ${path}`);
}

export async function getTermByPath(connector: Alation, termData: ITerm): Promise<ITermArticle> {
  const logData = {
    position: termData.position,
    termName: termData.name,
    parent: termData.parent,
    filename: termData.filename,
  };

  const parentTerm = await getParentTerm(connector, termData);

  const findChild = parentTerm.children.find((child) => child.title === termData.name);

  if (findChild) {
    const term = await connector.Article.getById<ITermArticle>(findChild.id);
    if (term) {
      return term;
    }
  }
  throw new TermNotFoundError(logData);
}

export async function updateStewardsField(connector: Alation, term: ITermArticle, emailList: string[]): Promise<void> {
  for (const steward of (await searchUsersByEmail(connector, emailList))) {
    const response = await connector.updateCustomFieldsValue<StewardCustomFieldValue>({
      field_id: STEWARDS_FIELD_ID,
      otype: 'article',
      oid: term.id,
      value: {
        display_name: '',
        oid: steward.id,
        otype: 'user',
        url: steward.url,
        id: steward.id,
      },
    });
    if (!response) {
      throw new Error(`ERR-105 не удалось добавить steward "${steward.display_name}"`);
    }
  }
}

export async function searchUsersByEmail(connector: Alation, emailList: string[]): Promise<IUser[]> {
  const users = await connector.User.search({}, true);

  const foundedUsers = users.filter((user) => emailList.includes(user.email));

  if (foundedUsers.length !== emailList.length) {
    const missingEmails = emailList.filter((email) => foundedUsers.find((user) => user.email === email));
    throw new Error(`ERR-106 не найдены пользователи с email: ${missingEmails.join(',')}`);
  }
  return foundedUsers;
}
