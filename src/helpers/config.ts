import {IConfig} from '../types';
import fs from 'fs-extra';
import {isAbsolute, join} from 'path';
import {validateCustomFieldId} from './validator';


export function loadConfig(path: string): IConfig {
  const {
    username,
    logPath,
    tokenStoragePath,
    tokenName,
    host,
    password,
    customFieldsId,
  } = JSON.parse(fs.readFileSync(path, {encoding: 'utf-8'})) as IConfig;

  if (!username || !password) {
    throw new Error('Отсутствуют данные авторизации пользователя');
  }
  if (!host) {
    throw new Error('Отсутствует информация о хосте');
  }
  validateCustomFieldId(customFieldsId);

  return {
    username,
    password,
    host,
    tokenName: tokenName ? tokenName : 'term_loader_token',
    tokenStoragePath: isAbsolute(tokenStoragePath) ? tokenStoragePath : join(process.cwd(), tokenStoragePath),
    logPath: isAbsolute(logPath) ? logPath : join(process.cwd(), logPath),
    customFieldsId,
  };
}
