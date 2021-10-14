import {Alation} from 'alation_connector';
import {IConfig, PhysicsCollection} from '../types';
import {getTsvContent, logError} from '../helpers/fileReader';
import {parsePhysics} from '../helpers/parser';
import path from 'path';
import {validatePhysic} from '../helpers/validator';
import {uploadPhysic} from '../helpers/actions';
import {BasePhysicsError} from '../errors';
import {UniqKeyPhysicsError} from '../errors/physics';

export async function runPhysicService(connector: Alation, config: IConfig, filePath: string, skipHeader: boolean): Promise<void> {
  const records = getTsvContent(filePath, skipHeader);
  const physicsCollection: PhysicsCollection = new Map();
  for (let position = 0; position < records.length; position++) {
    if (!records[position].length) {
      continue;
    }
    const data = parsePhysics(records[position]);
    const key = `${data.parentTermName}.${data.termName}.${data.physicPath}`;

    if (physicsCollection.has(key)) {
      // @ts-ignore
      physicsCollection.get(key).push({data, position});
    } else {
      physicsCollection.set(key, [{data, position}]);
    }
  }

  for (const [key, physic] of physicsCollection) {
    if (physic.length > 1) {
      for (const {data, position} of physic) {
        const error = new UniqKeyPhysicsError(data.termName, data.parentTermName, data.physicPath);
        error.position = position;
        error.filename = path.basename(filePath);
        logError(config.logPath, error);
      }
      physicsCollection.delete(key);
      continue;
    }
    const {data, position} = physic[0];
    try {
      validatePhysic(data);
      await uploadPhysic(connector, config.customFieldsId, data);
    } catch (e) {
      if (e instanceof BasePhysicsError) {
        e.termName = data.termName;
        e.termParentName = data.parentTermName;
        e.physicsPath = data.physicPath;
        e.position = position + 1;
        e.filename = path.basename(filePath);
        logError(config.logPath, e);
        continue;
      }
      throw e;
    }
  }
}
