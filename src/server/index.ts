import {includeEnvironments} from 'config/helpers';
import {Alation} from 'alation_connector';
import path from 'path';
import {BaseTermError} from './errors';
import {TermActionEnum} from './types';
import {deleteTerm, insertTerm, updateTerm} from './helpers/actions';
import fs from 'fs-extra';
import {parseTerm} from './helpers/parser';

includeEnvironments();

const runServer = async () => {
  try {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    const connector = new Alation({
      username: process.env.ALATION_USERNAME,
      password: process.env.ALATION_PASSWORD,
    }, process.env.ALATION_API_URL, {tokenName: 'term_uploader_token'});
    const filename = path.join(process.cwd(), 'uploads/term.tsv');
    const content = fs.readFileSync(filename, {encoding: 'utf-8'});
    const errorLog: BaseTermError[] = [];
    const records = content.split('\n');

    for (let position = 1; position < records.length; position++) {
      try {
        if (!records[position].length) {
          continue;
        }
        const termData = parseTerm(position, filename, records[position]);
        switch (termData.action) {
          case TermActionEnum.INSERT:
            await insertTerm(connector, termData);
            break;
          case TermActionEnum.UPDATE:
            await updateTerm(connector, termData);
            break;
          case TermActionEnum.DELETE:
            await deleteTerm(connector, termData);
            break;
        }
      } catch (e) {
        if (e instanceof BaseTermError) {
          errorLog.push(e);
        } else {
          throw e;
        }
      }
    }
    console.table(errorLog);
  } catch (e) {
    console.error(e?.message ?? e);
  }
};


runServer().finally();
