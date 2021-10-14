import { checkParentChildrenTermExists, checkSearchResult, getParentTerm, getTermByPath, setAlternativeNameField, setLineageTableField, setReferenceField, updateStewardsField } from "./index";
import { AlationTermError, UniqTermKeyTermError } from "../errors/terms";
import { PHYSIC_COLUMN_NAMES, TERM_COLUMN_NAMES } from "../constants";
import { ParentTermDuplicatePhysicError, ParentTermNotFoundPhysicError, TermNotFoundPhysicError } from "../errors/physics";
import { generateLineageTableRow, insertOrReplaceTableRow } from "./html";
import htmlParser from 'node-html-parser';
export async function insertTerm(connector, customFieldsId, termData) {
  const parentTerm = await getParentTerm(connector, termData.parentTermName); // проверка на уникальность ключа PARENT_TERM.CHILD_TERM

  if (checkParentChildrenTermExists(parentTerm, termData)) {
    throw new UniqTermKeyTermError();
  } // создание термина


  const term = await connector.Article.create({
    title: termData.termName,
    body: termData.description,
    custom_templates: parentTerm.custom_templates.map(t => t.id)
  }); // связывание с родителем

  if (!(await connector.Article.addChild(parentTerm.id, {
    id: term.id,
    otype: 'article'
  }))) {
    throw new AlationTermError([TERM_COLUMN_NAMES.parentTermName, TERM_COLUMN_NAMES.termName].join(','), 'не удалось связать родительский термин с потомком');
  } // запись Lineage table


  if (!(await setLineageTableField(connector, customFieldsId.lineageTable, term))) {
    throw new AlationTermError(TERM_COLUMN_NAMES.termName, 'не удалось произвести запись таблицы поля Lineage');
  } // запись Alternative name


  if (!(await setAlternativeNameField(connector, customFieldsId.alternativeName, term, termData.alternativeName))) {
    throw new AlationTermError(TERM_COLUMN_NAMES.alternativeName, 'не удалось произвести запись поля Alternative name');
  } // запись ссылки reference


  if (termData.reference.length && !(await setReferenceField(connector, customFieldsId.reference, term, termData.reference))) {
    throw new AlationTermError(TERM_COLUMN_NAMES.reference, 'не удалось произвести запись поля Reference');
  } // добавление stewards


  if (termData.stewards.length) {
    const response = await updateStewardsField(connector, customFieldsId.stewards, term, termData.stewards);

    if (response) {
      throw new AlationTermError('Steward', response);
    }
  }
}
export async function updateTerm(connector, customFieldsId, termData) {
  // получение термина по ключу
  let term = await getTermByPath(connector, termData.parentTermName, termData.termName); // обновление полей
  // body

  term = await connector.Article.update({
    id: term.id,
    title: term.title,
    body: termData.description
  }); // Alternative name

  if (!(await setAlternativeNameField(connector, customFieldsId.alternativeName, term, termData.alternativeName))) {
    throw new AlationTermError(TERM_COLUMN_NAMES.alternativeName, 'не удалось обновить поле Alternative name');
  } // запись ссылки reference


  if (termData.reference.length && !(await setReferenceField(connector, customFieldsId.reference, term, termData.reference))) {
    throw new AlationTermError(TERM_COLUMN_NAMES.reference, 'не удалось обновить поле Reference');
  } // добавление stewards


  if (termData.stewards.length) {
    const response = await updateStewardsField(connector, customFieldsId.stewards, term, termData.stewards);

    if (response) {
      throw new AlationTermError('Steward', response);
    }
  }
}
export async function deleteTerm(connector, termData) {
  // получение термина по ключу
  const term = await getTermByPath(connector, termData.parentTermName, termData.termName); // удаление

  const result = await connector.Article.delete(term.id);

  if (!result) {
    throw new AlationTermError([TERM_COLUMN_NAMES.parentTermName, TERM_COLUMN_NAMES.termName].join(','), `не удалось удалить термин`);
  }
}
export async function uploadPhysic(connector, customFieldsId, physicData) {
  // получение термина по ключу
  const searchResult = await connector.Article.search({
    title: physicData.parentTermName
  }, true);

  if (!searchResult.length) {
    throw new ParentTermNotFoundPhysicError();
  }

  if (searchResult.length > 1) {
    throw new ParentTermDuplicatePhysicError();
  }

  const termId = searchResult[0].children.find(child => child.title === physicData.termName && child.otype === 'article');

  if (!termId) {
    throw new TermNotFoundPhysicError();
  } // получение термина


  const term = await connector.Article.getById(termId.id);
  const segments = physicData.physicPath.split('.'); // поиск custom_field Lineage таблицы термина

  const tableCustomField = term.custom_fields.find(field => field.field_name === 'Lineage' && field.value_type === 'rich_text');
  let lineageTable = htmlParser(tableCustomField ? tableCustomField.value : ''); // получение источника

  const instance = checkSearchResult(await connector.Datasource.search({
    title: segments[0]
  }, true)); // получение схемы

  const schema = checkSearchResult(await connector.Schema.search({
    name: segments[1].toLowerCase(),
    ds_id: instance.id
  }, true)); // получение таблицы

  const table = checkSearchResult(await connector.Table.search({
    name: segments[2].toLowerCase(),
    ds_id: instance.id,
    schema_id: schema.id
  }, true));
  let lineageTableRow;

  if (segments.length === 4) {
    // получение аттрибута
    const attribute = checkSearchResult(await connector.Attribute.search({
      name: segments[3].toLowerCase(),
      ds_id: instance.id,
      schema_id: schema.id,
      table_id: table.id
    }, true));
    lineageTableRow = generateLineageTableRow('attribute', instance, schema, table, attribute); // обновление title и description

    const updateResult = await connector.Attribute.update({
      key: [instance.id, schema.name.toLowerCase(), table.name.toLowerCase(), attribute.name.toLowerCase()].join('.'),
      title: physicData.title.length ? physicData.title : attribute.title,
      description: physicData.description.length ? physicData.description : attribute.description
    });

    if (updateResult.error) {
      throw new AlationTermError(PHYSIC_COLUMN_NAMES.physicPath, 'не удалось обновить title и description');
    } // добавление ссылки Lineage ref


    const response = await connector.updateCustomFieldsValue({
      field_id: customFieldsId.lineageRef,
      otype: 'article',
      oid: term.id,
      value: {
        display_name: '',
        oid: attribute.id,
        otype: 'attribute',
        url: attribute.url,
        id: attribute.id
      }
    });

    if (!response) {
      throw new AlationTermError([PHYSIC_COLUMN_NAMES.parentTermName, PHYSIC_COLUMN_NAMES.termName, PHYSIC_COLUMN_NAMES.physicPath].join(','), 'не удалось добавить ссылку в custom field Lineage');
    }
  } else {
    lineageTableRow = generateLineageTableRow('table', instance, schema, table); // обновление title и description

    const updateResult = await connector.Table.update({
      key: [instance.id, schema.name.toLowerCase(), table.name.toLowerCase()].join('.'),
      title: physicData.title.length ? physicData.title : table.title,
      description: physicData.description.length ? physicData.description : table.description
    });

    if (updateResult.error) {
      throw new AlationTermError(PHYSIC_COLUMN_NAMES.physicPath, 'не удалось обновить title и description');
    } // добавление ссылки Lineage ref


    const response = await connector.updateCustomFieldsValue({
      field_id: customFieldsId.lineageRef,
      otype: 'article',
      oid: term.id,
      value: {
        display_name: '',
        oid: table.id,
        otype: 'table',
        url: table.url,
        id: table.id
      }
    });

    if (!response) {
      throw new AlationTermError([PHYSIC_COLUMN_NAMES.parentTermName, PHYSIC_COLUMN_NAMES.termName, PHYSIC_COLUMN_NAMES.physicPath].join(','), 'не удалось добавить ссылку в custom field Lineage');
    }
  } // добавление/переопределение записи в таблице


  lineageTable = insertOrReplaceTableRow(lineageTable, lineageTableRow); // обновление таблицы термина

  if (!(await setLineageTableField(connector, customFieldsId.lineageTable, term, lineageTable))) {
    throw new AlationTermError([PHYSIC_COLUMN_NAMES.parentTermName, PHYSIC_COLUMN_NAMES.termName, PHYSIC_COLUMN_NAMES.physicPath].join(','), 'не удалось добавить запись в таблицу Lineage');
  }
}
//# sourceMappingURL=actions.js.map