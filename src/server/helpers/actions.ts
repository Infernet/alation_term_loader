import {Alation} from 'alation_connector';
import {ITerm} from '../types';
import {ITermArticle} from '../types/alation';
import {
  checkParentChildrenTermExists,
  getParentTerm,
  getTermByPath,
  setAlternativeNameField,
  setReferenceField,
  updateStewardsField,
} from './index';
import {UniqTermKeyError} from '../errors';

export async function insertTerm(connector: Alation, termData: ITerm): Promise<void> {
  const parentTerm = await getParentTerm(connector, termData);
  // проверка на уникальность ключа PARENT_TERM.CHILD_TERM
  if (checkParentChildrenTermExists(parentTerm, termData)) {
    throw new UniqTermKeyError({
      position: termData.position,
      termName: termData.name,
      parent: termData.parent,
      filename: termData.filename,
    });
  }
  // создание термина
  const term = await connector.Article.create<ITermArticle>({
    title: termData.name,
    body: termData.body,
    custom_templates: parentTerm.custom_templates.map((t) => t.id),
  });
  // связывание с родителем
  if (!(await connector.Article.addChild(parentTerm.id, {id: term.id, otype: 'article'}))) {
    throw new Error('ERR-100 не удалось связать родительский термин с потомком');
  }

  // запись Alternative name
  await setAlternativeNameField(connector, term, termData.alternativeName);
  // запись ссылки reference
  if (termData.reference) {
    await setReferenceField(connector, term, termData.reference);
  }
  // добавление stewards
  if (termData.stewards.length) {
    await updateStewardsField(connector, term, termData.stewards);
  }
}

export async function updateTerm(connector: Alation, termData: ITerm): Promise<void> {
  // получение термина по ключу
  let term = await getTermByPath(connector, termData);
  // обновление полей

  // body
  term = await connector.Article.update<ITermArticle>({id: term.id, title: term.title, body: termData.body});
  // Alternative name
  await setAlternativeNameField(connector, term, termData.alternativeName);
  // Reference
  await setReferenceField(connector, term, termData.reference);
  // Stewards
  if (termData.stewards.length) {
    await updateStewardsField(connector, term, termData.stewards);
  }
}


export async function deleteTerm(connector: Alation, termData: ITerm): Promise<void> {
  // получение термина по ключу
  const term = await getTermByPath(connector, termData);
  // удаление
  const result = await connector.Article.delete(term.id);
  if (!result) {
    throw new Error(`ERR-300 не удалось удалить термин ${term.title}`);
  }
}
