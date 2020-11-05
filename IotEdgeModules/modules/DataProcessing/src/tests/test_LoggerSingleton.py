import unittest

from LoggerSingleton import EdgeLogger

class TestSingletonLogger(unittest.TestCase):

    def logger_of_edgeLogger_should_have_one_handler(self):
        self.assertEqual(len(EdgeLogger().logger.handlers, 1))

    def logger_loglevel_should_be_on_nonset(self):
        self.assertEqual(self.logger.getEffectiveLevel(), 0)
