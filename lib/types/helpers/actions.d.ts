import { Alation } from 'alation_connector';
import { CustomFieldsIdCollection, IPhysic, ITerm } from '../types';
export declare function insertTerm(connector: Alation, customFieldsId: CustomFieldsIdCollection, termData: ITerm): Promise<void>;
export declare function updateTerm(connector: Alation, customFieldsId: CustomFieldsIdCollection, termData: ITerm): Promise<void>;
export declare function deleteTerm(connector: Alation, termData: ITerm): Promise<void>;
export declare function uploadPhysic(connector: Alation, customFieldsId: CustomFieldsIdCollection, physicData: IPhysic): Promise<void>;
//# sourceMappingURL=actions.d.ts.map