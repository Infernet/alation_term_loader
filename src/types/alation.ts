import {AlationEntityId, AlationEntityType, CustomFieldId, IArticle, ObjectType} from 'alation_connector';
import {ICustomField} from 'alation_connector/src/interfaces/index';


export interface ITermArticle extends IArticle<AlternativeNameCustomField |
    ReferenceCustomField | LineageRefCustomField | LineageTableCustomField> {

}

export interface LineageTableCustomField extends ICustomField<'Lineage', 'rich_text'> {

}

export interface AlternativeNameCustomField extends ICustomField<'Alternative name', 'rich_text'> {

}

export interface ReferenceCustomField extends ICustomField<'Reference', 'rich_text'> {

}

export interface LineageRefCustomField extends ICustomField<'Lineage', AlationEntityType> {
    'id': CustomFieldId;
}

export type LinkCustomFieldValue = {
    'display_name': string;
    'id': AlationEntityId;
    'oid': AlationEntityId;
    'otype': ObjectType;
    'url': string;
};
