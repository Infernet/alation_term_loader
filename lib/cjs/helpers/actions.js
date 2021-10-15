"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertTerm = insertTerm;
exports.updateTerm = updateTerm;
exports.deleteTerm = deleteTerm;
exports.uploadPhysic = uploadPhysic;

var _index = require("./index");

var _terms = require("../errors/terms");

var _constants = require("../constants");

var _physics = require("../errors/physics");

var _html = require("./html");

var _nodeHtmlParser = _interopRequireDefault(require("node-html-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function insertTerm(connector, customFieldsId, termData) {
  const parentTerm = await (0, _index.getParentTerm)(connector, termData.parentTermName); // проверка на уникальность ключа PARENT_TERM.CHILD_TERM

  if ((0, _index.checkParentChildrenTermExists)(parentTerm, termData)) {
    throw new _terms.UniqTermKeyTermError();
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
    throw new _terms.AlationTermError([_constants.TERM_COLUMN_NAMES.parentTermName, _constants.TERM_COLUMN_NAMES.termName].join(','), 'не удалось связать родительский термин с потомком');
  } // запись Lineage table


  if (!(await (0, _index.setLineageTableField)(connector, customFieldsId.lineageTable, term))) {
    throw new _terms.AlationTermError(_constants.TERM_COLUMN_NAMES.termName, 'не удалось произвести запись таблицы поля Lineage');
  } // запись Alternative name


  if (!(await (0, _index.setAlternativeNameField)(connector, customFieldsId.alternativeName, term, termData.alternativeName))) {
    throw new _terms.AlationTermError(_constants.TERM_COLUMN_NAMES.alternativeName, 'не удалось произвести запись поля Alternative name');
  } // запись ссылки reference


  if (termData.reference.length && !(await (0, _index.setReferenceField)(connector, customFieldsId.reference, term, termData.reference))) {
    throw new _terms.AlationTermError(_constants.TERM_COLUMN_NAMES.reference, 'не удалось произвести запись поля Reference');
  } // добавление stewards


  if (termData.stewards.length) {
    const response = await (0, _index.updateStewardsField)(connector, customFieldsId.stewards, term, termData.stewards);

    if (response) {
      throw new _terms.AlationTermError('Steward', response);
    }
  }
}

async function updateTerm(connector, customFieldsId, termData) {
  // получение термина по ключу
  let term = await (0, _index.getTermByPath)(connector, termData.parentTermName, termData.termName); // обновление полей
  // body

  term = await connector.Article.update({
    id: term.id,
    title: term.title,
    body: (0, _html.generateTextElement)(termData.description).toString()
  }); // Alternative name

  if (!(await (0, _index.setAlternativeNameField)(connector, customFieldsId.alternativeName, term, termData.alternativeName))) {
    throw new _terms.AlationTermError(_constants.TERM_COLUMN_NAMES.alternativeName, 'не удалось обновить поле Alternative name');
  } // запись ссылки reference


  if (termData.reference.length && !(await (0, _index.setReferenceField)(connector, customFieldsId.reference, term, termData.reference))) {
    throw new _terms.AlationTermError(_constants.TERM_COLUMN_NAMES.reference, 'не удалось обновить поле Reference');
  } // добавление stewards


  if (termData.stewards.length) {
    const response = await (0, _index.updateStewardsField)(connector, customFieldsId.stewards, term, termData.stewards);

    if (response) {
      throw new _terms.AlationTermError('Steward', response);
    }
  }
}

async function deleteTerm(connector, termData) {
  // получение термина по ключу
  const term = await (0, _index.getTermByPath)(connector, termData.parentTermName, termData.termName); // удаление

  const result = await connector.Article.delete(term.id);

  if (!result) {
    throw new _terms.AlationTermError([_constants.TERM_COLUMN_NAMES.parentTermName, _constants.TERM_COLUMN_NAMES.termName].join(','), `не удалось удалить термин`);
  }
}

async function uploadPhysic(connector, customFieldsId, physicData) {
  // получение термина по ключу
  const searchResult = await connector.Article.search({
    title: physicData.parentTermName
  }, true);

  if (!searchResult.length) {
    throw new _physics.ParentTermNotFoundPhysicError();
  }

  if (searchResult.length > 1) {
    throw new _physics.ParentTermDuplicatePhysicError();
  }

  const termId = searchResult[0].children.find(child => child.title === physicData.termName && child.otype === 'article');

  if (!termId) {
    throw new _physics.TermNotFoundPhysicError();
  } // получение термина


  const term = await connector.Article.getById(termId.id);
  const segments = physicData.physicPath.split('.'); // поиск custom_field Lineage таблицы термина

  const tableCustomField = term.custom_fields.find(field => field.field_name === 'Lineage' && field.value_type === 'rich_text');
  let lineageTable = (0, _nodeHtmlParser.default)(tableCustomField ? tableCustomField.value : ''); // получение источника

  const instance = (0, _index.checkSearchResult)(await connector.Datasource.search({
    title: segments[0]
  }, true)); // получение схемы

  const schema = (0, _index.checkSearchResult)(await connector.Schema.search({
    name: segments[1].toLowerCase(),
    ds_id: instance.id
  }, true)); // получение таблицы

  let table = (0, _index.checkSearchResult)(await connector.Table.search({
    name: segments[2].toLowerCase(),
    ds_id: instance.id,
    schema_id: schema.id
  }, true));
  let lineageTableRow;

  if (segments.length === 4) {
    // получение аттрибута
    let attribute = (0, _index.checkSearchResult)(await connector.Attribute.search({
      name: segments[3].toLowerCase(),
      ds_id: instance.id,
      schema_id: schema.id,
      table_id: table.id
    }, true)); // обновление title и description

    if (physicData.title.length || physicData.description.length) {
      const response = await connector.Attribute.update({
        key: [instance.id, schema.name.toLowerCase(), table.name.toLowerCase(), attribute.name.toLowerCase()].join('.'),
        ...(physicData.title.length ? {
          title: physicData.title
        } : {}),
        ...(physicData.description.length ? {
          description: (0, _html.generateTextElement)(physicData.description).toString()
        } : {})
      });

      if (response.error) {
        throw new _terms.AlationTermError(_constants.PHYSIC_COLUMN_NAMES.physicPath, 'не удалось обновить title и description');
      }

      attribute = await connector.Attribute.getById(attribute.id);
    }

    lineageTableRow = (0, _html.generateLineageTableRow)('attribute', instance, schema, table, attribute); // добавление ссылки Lineage ref

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
      throw new _terms.AlationTermError([_constants.PHYSIC_COLUMN_NAMES.parentTermName, _constants.PHYSIC_COLUMN_NAMES.termName, _constants.PHYSIC_COLUMN_NAMES.physicPath].join(','), 'не удалось добавить ссылку в custom field Lineage');
    }
  } else {
    // обновление title и description
    if (physicData.title.length || physicData.description.length) {
      const response = await connector.Table.update({
        key: [instance.id, schema.name.toLowerCase(), table.name.toLowerCase()].join('.'),
        ...(physicData.title.length ? {
          title: physicData.title
        } : {}),
        ...(physicData.description.length ? {
          description: (0, _html.generateTextElement)(physicData.description).toString()
        } : {})
      });

      if (response.error) {
        throw new _terms.AlationTermError(_constants.PHYSIC_COLUMN_NAMES.physicPath, 'не удалось обновить title и description');
      }

      table = await connector.Table.getById(table.id);
    }

    lineageTableRow = (0, _html.generateLineageTableRow)('table', instance, schema, table); // добавление ссылки Lineage ref

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
      throw new _terms.AlationTermError([_constants.PHYSIC_COLUMN_NAMES.parentTermName, _constants.PHYSIC_COLUMN_NAMES.termName, _constants.PHYSIC_COLUMN_NAMES.physicPath].join(','), 'не удалось добавить ссылку в custom field Lineage');
    }
  } // добавление/переопределение записи в таблице


  lineageTable = (0, _html.insertOrReplaceTableRow)(lineageTable, lineageTableRow); // обновление таблицы термина

  if (!(await (0, _index.setLineageTableField)(connector, customFieldsId.lineageTable, term, lineageTable))) {
    throw new _terms.AlationTermError([_constants.PHYSIC_COLUMN_NAMES.parentTermName, _constants.PHYSIC_COLUMN_NAMES.termName, _constants.PHYSIC_COLUMN_NAMES.physicPath].join(','), 'не удалось добавить запись в таблицу Lineage');
  }
}
//# sourceMappingURL=actions.js.map