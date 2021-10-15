"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateEntityLink = generateEntityLink;
exports.generateTextElement = generateTextElement;
exports.generateLineageTableRow = generateLineageTableRow;
exports.generateLink = generateLink;
exports.generateLineageTable = generateLineageTable;
exports.insertOrReplaceTableRow = insertOrReplaceTableRow;

var _nodeHtmlParser = require("node-html-parser");

function generateEntityLink(otype, entity) {
  return new _nodeHtmlParser.HTMLElement('a', {
    class: 'term_loader_link'
  }, `data-oid="${entity.id}" data-otype="${otype}" href="${entity.url}"`, null);
}

function generateTextElement(content) {
  const tag = new _nodeHtmlParser.HTMLElement('p', {
    class: 'term_loader_text'
  }, '', null);
  tag.set_content(content);
  return tag;
}

function generateLineageTableRow(entityType, ds, schema, table, attribute) {
  const row = new _nodeHtmlParser.HTMLElement('tr', {
    class: 'term_loader_table_row',
    id: `term_lineage_row_${entityType}_${entityType === 'attribute' && attribute ? attribute.id : table.id}`
  }, ``, null);
  const descriptionTag = new _nodeHtmlParser.HTMLElement('td', {}, '', row);
  const datasourceTag = new _nodeHtmlParser.HTMLElement('td', {}, '', row);
  const schemaTag = new _nodeHtmlParser.HTMLElement('td', {}, '', row);
  const tableTag = new _nodeHtmlParser.HTMLElement('td', {}, '', row);
  const attributeTag = new _nodeHtmlParser.HTMLElement('td', {}, '', row);
  const linkTag = new _nodeHtmlParser.HTMLElement('td', {}, '', row);
  row.appendChild(descriptionTag);
  row.appendChild(datasourceTag);
  row.appendChild(schemaTag);
  row.appendChild(tableTag);
  row.appendChild(attributeTag);
  row.appendChild(linkTag);
  datasourceTag.appendChild(generateTextElement(ds.title));
  schemaTag.appendChild(generateTextElement(schema.name));
  tableTag.appendChild(generateTextElement(table.name));

  if (entityType === 'attribute' && attribute) {
    attributeTag.appendChild(generateTextElement(attribute.name));
    descriptionTag.appendChild(generateTextElement(attribute.description));
    linkTag.appendChild(generateLink(attribute.url, linkTag));
  } else {
    descriptionTag.appendChild(generateTextElement(table.description));
    linkTag.appendChild(generateLink(table.url, linkTag));
  }

  return row;
}

function generateLink(url, parent = null, name = 'Ссылка') {
  const link = new _nodeHtmlParser.HTMLElement('a', {}, `href="${url}"`, parent);
  link.set_content(name);
  return link;
}

function generateLineageTable() {
  const root = new _nodeHtmlParser.HTMLElement('table', {
    class: 'term_loader_table'
  }, 'style="width: 100%;"', null);
  const head = new _nodeHtmlParser.HTMLElement('thead', {
    class: 'term_loader_table',
    id: 'term_loader_lineage_table_header'
  }, '', root);
  head.appendChild(new _nodeHtmlParser.HTMLElement('tr', {
    class: 'term_loader_table',
    id: 'term_loader_lineage_table_header'
  }, '', head));
  const descriptionTag = new _nodeHtmlParser.HTMLElement('th', {}, '', head);
  const datasourceTag = new _nodeHtmlParser.HTMLElement('th', {}, '', head);
  const schemaTag = new _nodeHtmlParser.HTMLElement('th', {}, '', head);
  const tableTag = new _nodeHtmlParser.HTMLElement('th', {}, '', head);
  const attributeTag = new _nodeHtmlParser.HTMLElement('th', {}, '', head);
  const linkTag = new _nodeHtmlParser.HTMLElement('th', {}, '', head);
  head.appendChild(descriptionTag);
  head.appendChild(datasourceTag);
  head.appendChild(schemaTag);
  head.appendChild(tableTag);
  head.appendChild(attributeTag);
  head.appendChild(linkTag);
  descriptionTag.set_content('Описание');
  datasourceTag.set_content('Система');
  schemaTag.set_content('Схема');
  tableTag.set_content('Таблица');
  attributeTag.set_content('Аттрибут');
  linkTag.set_content('Ссылка');
  const body = new _nodeHtmlParser.HTMLElement('tbody', {
    class: 'term_loader_table',
    id: 'term_loader_lineage_table_body'
  }, '', root);
  root.appendChild(head);
  root.appendChild(body);
  return root;
}

function insertOrReplaceTableRow(table, row) {
  const tableTag = table.querySelector('table') ?? generateLineageTable();
  const body = tableTag.querySelector('tbody');
  const findRow = body.querySelector( // eslint-disable-next-line max-len
  `tr#${row.getAttribute('id')}`);

  if (findRow) {
    body.removeChild(findRow);
  }

  body.appendChild(row);
  return tableTag;
}
//# sourceMappingURL=html.js.map