import {AlationEntityId, AlationEntityType, CustomFieldId, IArticle, ObjectType} from 'alation_connector';
import {ICustomField} from 'alation_connector/src/interfaces/index';


export interface ITermArticle extends IArticle<AlternativeNameCustomField | ReferenceCustomField | LineageCustomField> {

}


export interface AlternativeNameCustomField extends ICustomField<'Alternative name', 'rich_text'> {

}

export interface ReferenceCustomField extends ICustomField<'Reference', 'rich_text'> {

}

export interface LineageCustomField extends ICustomField<'Lineage', AlationEntityType> {
    id: CustomFieldId;
}

export type StewardCustomFieldValue = {
    'display_name': string;
    'id': AlationEntityId;
    'oid': AlationEntityId;
    'otype': ObjectType;
    'url': string;
};
