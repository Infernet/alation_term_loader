import path from 'path';
import {loadConfig} from './helpers/config';
import {Alation} from 'alation_connector';
import {runTermService} from './services/term';
import {runPhysicService} from './services/physics';
import {ModeType, TerminalAnswer} from './types';
import inquirer from 'inquirer';

export async function run(): Promise<void> {
  try {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    console.log('Загрузчик терминов и физики в Alation');
    const {
      inputConfigPath,
      inputFilePath,
      inputMode,
      inputSkipHeader,
    } = await inquirer.prompt<TerminalAnswer>([
      {
        type: 'input',
        name: 'inputConfigPath',
        message: 'Укажите путь к конфигурационному файлу',
        default: path.join(process.cwd(), 'config.json'),
      },
      {
        type: 'list',
        name: 'inputMode',
        message: 'Выберите режим работы',
        choices: [
          'Загрузка терминов',
          'Загрузка физики',
        ],
        default: 'Загрузка терминов',
        filter(input: string): ModeType {
          if (input === 'Загрузка терминов') {
            return 'terms';
          }
          return 'physics';
        },
      },
      {
        type: 'input',
        name: 'inputFilePath',
        message: 'Укажите путь к TSV файлу',
        default: path.join(process.cwd(), 'file.tsv'),
      },
      {
        type: 'list',
        name: 'inputSkipHeader',
        message: 'Первая запись в файле заголовок?',
        choices: [
          'Да',
          'Нет',
        ],
        default: 'Да',
        filter(input: string): boolean {
          return input === 'Да';
        },
      },
    ]);

    const configPath: string = path.isAbsolute(inputConfigPath) ? inputConfigPath : path.join(process.cwd(), inputConfigPath);
    const filePath: string = path.isAbsolute(inputFilePath) ? inputFilePath : path.join(process.cwd(), inputFilePath);
    const config = loadConfig(configPath);


    const connector = new Alation({
      username: config.username,
      password: config.password,
    }, config.host, {tokenName: config.tokenName, tokenStoragePath: config.tokenStoragePath});


    if (inputMode === 'terms') {
      await runTermService(connector, config, filePath, inputSkipHeader);
    } else {
      await runPhysicService(connector, config, filePath, inputSkipHeader);
    }
  } catch (e) {
    console.error(e.message);
  }
  console.log('Завершение работы');
}
