import { TermActionEnum } from "../types";
import { getTsvContent, logError } from "../helpers/fileReader";
import { parseTerm } from "../helpers/parser";
import { UniqTermKeyTermError } from "../errors/terms";
import path from 'path';
import { validateTerm } from "../helpers/validator";
import { deleteTerm, insertTerm, updateTerm } from "../helpers/actions";
import { BaseTermError } from "../errors";
export async function runTermService(connector, config, filePath, skipHeader) {
  const records = getTsvContent(filePath, skipHeader);
  const termsCollection = new Map();

  for (let position = 0; position < records.length; position++) {
    if (!records[position].length) {
      continue;
    }

    const data = parseTerm(records[position]);
    const key = `${data.parentTermName}.${data.termName}`;

    if (termsCollection.has(key)) {
      // @ts-ignore
      termsCollection.get(key).push({
        data,
        position
      });
    } else {
      termsCollection.set(key, [{
        data,
        position
      }]);
    }
  }

  for (const [key, terms] of termsCollection) {
    if (terms.length > 1) {
      for (const {
        data,
        position
      } of terms) {
        const error = new UniqTermKeyTermError(data.termName, data.parentTermName);
        error.position = position;
        error.filename = path.basename(filePath);
        logError(config.logPath, error);
      }

      termsCollection.delete(key);
      continue;
    }

    const {
      data,
      position
    } = terms[0];

    try {
      validateTerm(data);

      switch (data.action.toUpperCase()) {
        case TermActionEnum.INSERT:
        case TermActionEnum.DEFAULT:
          await insertTerm(connector, config.customFieldsId, data);
          break;

        case TermActionEnum.UPDATE:
          await updateTerm(connector, config.customFieldsId, data);
          break;

        case TermActionEnum.DELETE:
          await deleteTerm(connector, data);
      }
    } catch (e) {
      if (e instanceof BaseTermError) {
        e.termName = data.termName;
        e.termParentName = data.parentTermName;
        e.position = position + 1;
        e.filename = path.basename(filePath);
        logError(config.logPath, e);
        continue;
      }

      throw e;
    }
  }
}
//# sourceMappingURL=term.js.map