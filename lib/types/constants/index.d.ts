import { $Keys } from 'utility-types';
import { IPhysic, ITerm } from '../types';
export declare const getTermsLogPath: (base: string) => string;
export declare const getPhysicsLogPath: (base: string) => string;
export declare const TERM_COLUMN_NAMES: {
    [x in $Keys<ITerm>]: string;
};
export declare const PHYSIC_COLUMN_NAMES: {
    [x in $Keys<IPhysic>]: string;
};
export declare const TERM_FIELDS_POSITION: {
    [x in $Keys<ITerm>]: number;
};
export declare const PHYSICS_FIELDS_POSITION: {
    [x in $Keys<IPhysic>]: number;
};
//# sourceMappingURL=index.d.ts.map