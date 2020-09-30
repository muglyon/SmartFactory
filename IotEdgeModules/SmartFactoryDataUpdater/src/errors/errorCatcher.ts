import { getLogger } from 'log4js';

export default (e: Error) => {
    const logger = getLogger('DataUpdater');
    logger.error(e.message);
}