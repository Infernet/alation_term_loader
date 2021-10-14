"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;

var _path = _interopRequireDefault(require("path"));

var _config = require("./helpers/config");

var _alation_connector = require("alation_connector");

var _term = require("./services/term");

var _physics = require("./services/physics");

var _inquirer = _interopRequireDefault(require("inquirer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function run() {
  try {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    console.log('Загрузчик терминов и физики в Alation');
    const {
      inputConfigPath,
      inputFilePath,
      inputMode,
      inputSkipHeader
    } = await _inquirer.default.prompt([{
      type: 'input',
      name: 'inputConfigPath',
      message: 'Укажите путь к конфигурационному файлу',
      default: _path.default.join(process.cwd(), 'config.json')
    }, {
      type: 'list',
      name: 'inputMode',
      message: 'Выберите режим работы',
      choices: ['Загрузка терминов', 'Загрузка физики'],
      default: 'Загрузка терминов',

      filter(input) {
        if (input === 'Загрузка терминов') {
          return 'terms';
        }

        return 'physics';
      }

    }, {
      type: 'input',
      name: 'inputFilePath',
      message: 'Укажите путь к TSV файлу',
      default: _path.default.join(process.cwd(), 'file.tsv')
    }, {
      type: 'list',
      name: 'inputSkipHeader',
      message: 'Первая запись в файле заголовок?',
      choices: ['Да', 'Нет'],
      default: 'Да',

      filter(input) {
        return input === 'Да';
      }

    }]);
    const configPath = _path.default.isAbsolute(inputConfigPath) ? inputConfigPath : _path.default.join(process.cwd(), inputConfigPath);
    const filePath = _path.default.isAbsolute(inputFilePath) ? inputFilePath : _path.default.join(process.cwd(), inputFilePath);
    const config = (0, _config.loadConfig)(configPath);
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