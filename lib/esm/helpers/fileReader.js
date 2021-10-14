import fs from 'fs-extra';
import { BaseTermError } from "../errors";
import { getPhysicsLogPath, getTermsLogPath } from "../constants";
export function getTsvContent(path, skipHeader = false) {
  const content = fs.readFileSync(path, {
    encoding: 'utf-8'
  });
  const records = content.split('\n');

  if (skipHeader) {
    records[0] = '';
  }

  return records;
}
export function logError(path, error) {
  const filepath = error instanceof BaseTermError ? getTermsLogPath(path) : getPhysicsLogPath(path);

  if (fs.existsSync(filepath)) {
    fs.appendFileSync(filepath, `\n${error.toLogString()}`, {
      encoding: 'utf-8'
    });
  } else {
    fs.outputFileSync(filepath, [error.generateLogHeader(), error.toLogString()].join('\n'), {
      encoding: 'utf-8'
    });
  }
}
//# sourceMappingURL=fileReader.js.map