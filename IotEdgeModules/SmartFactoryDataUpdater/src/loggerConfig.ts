import { configure } from 'log4js';

export default () => configure({
  appenders: {
    DataUpdater: {
      type: "console",
      layout: {
        type: "basic"
      }
    }
  },
  categories: {
    default: {
      appenders: ['DataUpdater'],
      level: "ALL"
    }
  }
});