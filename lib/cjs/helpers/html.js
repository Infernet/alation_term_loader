"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isHtmlText = isHtmlText;
exports.generateEntityLink = generateEntityLink;
exports.generateTextElement = generateTextElement;
exports.generateLineageTableRow = generateLineageTableRow;
exports.generateLink = generateLink;
exports.generateLineageTable = generateLineageTable;
exports.insertOrReplaceTableRow = insertOrReplaceTableRow;

var _nodeHtmlParser = require("node-html-parser");

function isHtmlText(content) {
  const parseContent = (0, _nodeHtmlParser.parse)(content);
  return Boolean(parseContent.childNodes.length && !(parseContent.childNodes[0] instanceof _nodeHtmlParser.TextNode));
}

function generateEntityLink(otype, entity) {
  return new _nodeHtmlParser.HTMLElement('a', {
    class: 'term_loader_link'
  }, `data-oid="${entity.id}" data-otype="${otype}" href="${entity.url}"`, null);
}

function generateTextElement(content) {
  if (isHtmlText(content)) {
    return (0, _nodeHtmlParser.parse)(content);
  }

  const tag = new _nodeHtmlParser.HTMLElement('p', {
    class: 'term_loader_text'
  }, '', null);
  if (content.length) tag.set_content(content);
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
  schemaTag.appendChild(generateTextElement(schema.name.toUpperCase()));
  tableTag.appendChild(generateTextElement(table.name.toUpperCase()));

  if (entityType === 'attribute' && attribute) {
    attributeTag.appendChild(generateTextElement(attribute.name.toUpperCase()));
    descriptionTag.appendChild(generateTextElement(attribute.description));
    linkTag.appendChild(generateLink(attribute.url, linkTag));
  } else {
    descriptionTag.appendChild(generateTextElement(table.description));
    linkTag.appendChild(generateLink(table.url, linkTag));
  }

  return row;
}

function generateLink(url, parent = null, name = '????????????') {
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
  descriptionTag.set_content('????????????????');
  datasourceTag.set_content('??????????????');
  schemaTag.set_content('??????????');
  tableTag.set_content('??????????????');
  attributeTag.set_content('??????????????');
  linkTag.set_content('????????????');
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