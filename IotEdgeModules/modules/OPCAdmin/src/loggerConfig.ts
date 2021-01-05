import { configure } from 'log4js';
import { MODULE_NAME } from './constantes';

export default () => configure({
  appenders: {
    OPCAdmin: {
      type: "console",
      layout: {
        type: "basic"
      }
    }
  },
  categories: {
    default: {
      appenders: [MODULE_NAME],
      level: "ALL"
    }
  }
});