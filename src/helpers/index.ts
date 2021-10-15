import {Alation, ITable} from 'alation_connector';
import {ITerm} from '../types';
import {ITermArticle, LinkCustomFieldValue} from '../types/alation';
import {TERM_COLUMN_NAMES} from '../constants';
import {
  AlationTermError,
  ParentTermDuplicateTermError,
  ParentTermNotFoundTermError,
  TermNotFoundTermError,
} from '../errors/terms';
import {generateEntityLink, generateLineageTable, generateTextElement} from './html';
import {DuplicateEntityError, EntityNotFoundError} from '../errors/physics';
import {IAlationEntity} from 'alation_connector/src/interfaces/entity';
import {HTMLElement} from 'node-html-parser';

export async function getParentTerm(connector: Alation, parentTermName: string): Promise<ITermArticle> {
  const searchResult = await connector.Article.search({title: parentTermName}, true) as ITermArticle[];
  if (!searchResult.length) {
    throw new ParentTermNotFoundTermError();
  }
  if (searchResult.length > 1) {
    throw new ParentTermDuplicateTermError();
  }
  return searchResult[0];
}

export function checkParentChildrenTermExists(parent: ITermArticle, term: ITerm): boolean {
  for (const child of parent.children) {
    if (child.title === term.termName) {
      return true;
    }
  }
  return false;
}

export async function setLineageTableField(connector: Alation,
    customFieldId: number,
    article: ITermArticle,
    table?: HTMLElement): Promise<boolean> {
  const result = await connector.updateCustomFieldsValue({
    field_id: customFieldId,
    oid: article.id,
    value: table ? table.toString() : generateLineageTable().toString(),
    otype: 'article',
  });

  return !!result;
}

export async function setAlternativeNameField(connector: Alation,
    customFieldId: number,
    article: ITermArticle,
    alternativeName: string): Promise<boolean> {
  const result = await connector.updateCustomFieldsValue({
    field_id: customFieldId,
    oid: article.id,
    value: generateTextElement(alternativeName).toString(),
    otype: 'article',
  });

  return !!result;
}

export async function setReferenceField(connector: Alation,
    customFieldId: number,
    term: ITermArticle, reference: string): Promise<boolean> {
  const response = await connector.updateCustomFieldsValue({
    otype: 'article',
    field_id: customFieldId,
    oid: term.id,
    value: reference ? generateEntityLink('table', await getTableByPath(connector, reference)).toString() : generateTextElement('').toString(),
  });

  return !!response;
}

export async function getTableByPath(connector: Alation, path: string): Promise<ITable> {
  const segments = path.split('.');
  const ds = await connector.Datasource.search({title: segments[0]}, true);
  if (ds.length !== 1) {
    throw new AlationTermError(TERM_COLUMN_NAMES.reference, `не удалось найти источник с названием ${segments[0]}, либо найдено несколько`);
  }
  const table = await connector.Table.search({
    name: segments[2].toLowerCase(),
    schema_name: segments[1].toLowerCase(),
    ds_id: ds[0].id,
  }, true);
  if (table.length === 1) {
    return table[0];
  }

  throw new AlationTermError(TERM_COLUMN_NAMES.reference, `найдено несколько таблиц по ключу ${path}`);
}

export async function getTermByPath(connector: Alation, parentName: string, termName: string): Promise<ITermArticle> {
  const parentTerm = await getParentTerm(connector, parentName);
  const findChild = parentTerm.children.find((child) => child.title === termName && child.otype === 'article');

  if (findChild) {
    const term = await connector.Article.getById<ITermArticle>(findChild.id);
    if (term) {
      return term;
    }
  }
  throw new TermNotFoundTermError();
}

export async function updateStewardsField(connector: Alation,
    customFieldId: number,
    term: ITermArticle,
    emailList: string[]): Promise<void | string> {
  const users = await connector.User.search({}, true);

  const foundedUsers = users.filter((user) => emailList.includes(user.email));

  if (foundedUsers.length !== emailList.length) {
    return `не найдены пользователи с email: ${emailList.filter((email) => foundedUsers.find((user) => user.email === email)).join(',')}`;
  }

  const errors: string[] = [];
  for (const steward of foundedUsers) {
    const response = await connector.updateCustomFieldsValue<LinkCustomFieldValue>({
      field_id: customFieldId,
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
      errors.push(steward.display_name);
    }
  }
  if (errors.length) {
    return `не удалось добавить steward: ${errors.join(',')}`;
  }
}

export function checkSearchResult<T extends IAlationEntity>(result: T[]): T {
  if (!result.length) {
    throw new EntityNotFoundError();
  }
  if (result.length > 1) {
    throw new DuplicateEntityError();
  }

  return result[0];
}
