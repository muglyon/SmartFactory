import { configure } from 'log4js';

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
      appenders: ['OPCAdmin'],
      level: "ALL"
    }
  }
});