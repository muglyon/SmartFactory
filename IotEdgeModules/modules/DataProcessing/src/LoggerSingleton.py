from __future__ import annotations
from typing import Optional
import logging

class SingletonLogger(type):
    """
    The Singleton class can be implemented in different ways in Python. Some
    possible methods include: base class, decorator, metaclass. We will use the
    metaclass because it is best suited for this purpose.
    """

    _instance: Optional[EdgeLogger] = None

    def __call__(self) -> EdgeLogger:
        if self._instance is None:
            self._instance = super().__call__()
            self._instance.init_logger()
        return self._instance


class EdgeLogger(metaclass=SingletonLogger):
    
    # Private properties of EdgeLogger
    _appender = "DataProcessing"
    _logLevel = "NOTSET"
    _formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] ' + _appender + ' - %(message)s')
    
    # Public logger
    logger: logging.Logger = logging.getLogger()

    def init_logger(self):
        if len(self.logger.handlers) < 1:
            self.logger.setLevel(self._logLevel)
            stream_handler = logging.StreamHandler()
            stream_handler.setFormatter(self._formatter)
            self.logger.addHandler(stream_handler)