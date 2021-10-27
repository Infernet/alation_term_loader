import { HTMLElement, parse, TextNode } from 'node-html-parser';
export function isHtmlText(content) {
  const parseContent = parse(content);
  return Boolean(parseContent.childNodes.length && !(parseContent.childNodes[0] instanceof TextNode));
}
export function generateEntityLink(otype, entity) {
  return new HTMLElement('a', {
    class: 'term_loader_link'
  }, `data-oid="${entity.id}" data-otype="${otype}" href="${entity.url}"`, null);
}
export function generateTextElement(content) {
  if (isHtmlText(content)) {
    return parse(content);
  }

  const tag = new HTMLElement('p', {
    class: 'term_loader_text'
  }, '', null);
  if (content.length) tag.set_content(content);
  return tag;
}
export function generateLineageTableRow(entityType, ds, schema, table, attribute) {
  const row = new HTMLElement('tr', {
    class: 'term_loader_table_row',
    id: `term_lineage_row_${entityType}_${entityType === 'attribute' && attribute ? attribute.id : table.id}`
  }, ``, null);
  const descriptionTag = new HTMLElement('td', {}, '', row);
  const datasourceTag = new HTMLElement('td', {}, '', row);
  const schemaTag = new HTMLElement('td', {}, '', row);
  const tableTag = new HTMLElement('td', {}, '', row);
  const attributeTag = new HTMLElement('td', {}, '', row);
  const linkTag = new HTMLElement('td', {}, '', row);
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
export function generateLink(url, parent = null, name = 'Ссылка') {
  const link = new HTMLElement('a', {}, `href="${url}"`, parent);
  link.set_content(name);
  return link;
}
export function generateLineageTable() {
  const root = new HTMLElement('table', {
    class: 'term_loader_table'
  }, 'style="width: 100%;"', null);
  const head = new HTMLElement('thead', {
    class: 'term_loader_table',
    id: 'term_loader_lineage_table_header'
  }, '', root);
  head.appendChild(new HTMLElement('tr', {
    class: 'term_loader_table',
    id: 'term_loader_lineage_table_header'
  }, '', head));
  const descriptionTag = new HTMLElement('th', {}, '', head);
  const datasourceTag = new HTMLElement('th', {}, '', head);
  const schemaTag = new HTMLElement('th', {}, '', head);
  const tableTag = new HTMLElement('th', {}, '', head);
  const attributeTag = new HTMLElement('th', {}, '', head);
  const linkTag = new HTMLElement('th', {}, '', head);
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
  attributeTag.set_content('Атрибут');
  linkTag.set_content('Ссылка');
  const body = new HTMLElement('tbody', {
    class: 'term_loader_table',
    id: 'term_loader_lineage_table_body'
  }, '', root);
  root.appendChild(head);
  root.appendChild(body);
  return root;
}
export function insertOrReplaceTableRow(table, row) {
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