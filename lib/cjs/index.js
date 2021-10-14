"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;

var _chalk = _interopRequireDefault(require("chalk"));

var _path = _interopRequireDefault(require("path"));

var _config = require("./helpers/config");

var _alation_connector = require("alation_connector");

var _term = require("./services/term");

var _physics = require("./services/physics");

var _inquirer = _interopRequireDefault(require("inquirer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function run() {
  try {
    console.log(_chalk.default.bgBlack(_chalk.default.white('Загрузчик терминов и физики в Alation')));
    const {
      inputConfigPath,
      inputFilePath,
      inputMode,
      inputSkipHeader
    } = await _inquirer.default.prompt([{
      type: 'input',
      name: 'inputConfigPath',
      message: _chalk.default.bgGray(_chalk.default.green('Укажите путь к конфигурационному файлу')),
      default: _path.default.join(process.cwd(), 'config.json')
    }, {
      type: 'list',
      name: 'inputMode',
      message: _chalk.default.bgGray(_chalk.default.green('Выберите режим работы')),
      choices: ['Загрузка терминов', 'Загрузка физики'],
      default: 'Загрузка физики',

      filter(input) {
        if (input === 'Загрузка терминов') {
          return 'terms';
        }

        return 'physics';
      }

    }, {
      type: 'input',
      name: 'inputFilePath',
      message: _chalk.default.bgGray(_chalk.default.green('Укажите путь к TSV файлу')),
      default: _path.default.join(process.cwd(), 'uploads/physics.tsv')
    }, {
      type: 'list',
      name: 'inputSkipHeader',
      message: _chalk.default.bgGray(_chalk.default.green('Первая запись в файле заголовок?')),
      choices: ['Да', 'Нет'],
      default: 'Да',

      filter(input) {
        return input === 'Да';
      }

    }]);
    const configPath = _path.default.isAbsolute(inputConfigPath) ? inputConfigPath : _path.default.join(process.cwd(), inputConfigPath);
    const filePath = _path.default.isAbsolute(inputFilePath) ? inputFilePath : _path.default.join(process.cwd(), inputFilePath);
    const config = (0, _config.loadConfig)(configPath);
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    const connector = new _alation_connector.Alation({
      username: config.username,
      password: config.password
    }, config.host, {
      tokenName: config.tokenName,
      tokenStoragePath: config.tokenStoragePath
    });

    if (inputMode === 'terms') {
      await (0, _term.runTermService)(connector, config, filePath, inputSkipHeader);
    } else {
      await (0, _physics.runPhysicService)(connector, config, filePath, inputSkipHeader);
    }
  } catch (e) {
    console.error(e.message);
  }

  console.log('Завершение работы');
}
//# sourceMappingURL=index.js.map