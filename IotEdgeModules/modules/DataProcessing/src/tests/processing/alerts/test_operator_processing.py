from processing.alerts.operator_processing import operator_processing
from unittest import TestCase

class Test(TestCase):
    def test_eq_operator(self):
        self.assertTrue(operator_processing(1, 1, "eq"))
        self.assertTrue(operator_processing(True, True, "eq"))
        self.assertTrue(operator_processing("value", "value", "eq"))
        self.assertFalse(operator_processing(1, 2, "eq"))
        self.assertFalse(operator_processing(2, 1, "eq"))
        self.assertFalse(operator_processing(1, "2", "eq"))
        self.assertTrue(operator_processing(1, "1", "eq"))
        self.assertFalse(operator_processing(1, True, "eq"))
        self.assertFalse(operator_processing(True, False, "eq"))

    def test_neq_operator(self):
        self.assertFalse(operator_processing(1, 1, "neq"))
        self.assertFalse(operator_processing(True, True, "neq"))
        self.assertFalse(operator_processing("value", "value", "neq"))
        self.assertTrue(operator_processing(1, 2, "neq"))
        self.assertTrue(operator_processing(2, 1, "neq"))
        self.assertTrue(operator_processing(1, "2", "neq"))
        self.assertFalse(operator_processing(1, "1", "neq"))
        self.assertTrue(operator_processing(1, True, "neq"))
        self.assertTrue(operator_processing(True, False, "neq"))

    def test_gt_operator(self):
        self.assertFalse(operator_processing(1, 1, "gt"))
        self.assertFalse(operator_processing(True, True, "gt"))
        self.assertRaisesRegex(Exception, "Bad operator gt for compare 'value' and 'value'", operator_processing, "value", "value", "gt")
        self.assertFalse(operator_processing(1, 2, "gt"))
        self.assertTrue(operator_processing(2, 1, "gt"))
        self.assertFalse(operator_processing(1, "2", "gt"))
        self.assertFalse(operator_processing(1, "1", "gt"))
        self.assertFalse(operator_processing(1, True, "gt"))
        self.assertTrue(operator_processing(True, False, "gt"))

    
    def test_gte_operator(self):
        self.assertTrue(operator_processing(1, 1, "gte"))
        self.assertTrue(operator_processing(True, True, "gte"))
        self.assertRaisesRegex(Exception,  "Bad operator gte for compare 'value' and 'value'", operator_processing, "value", "value", "gte")
        self.assertFalse(operator_processing(1, 2, "gte"))
        self.assertTrue(operator_processing(2, 1, "gte"))
        self.assertFalse(operator_processing(1, "2", "gte"))
        self.assertTrue(operator_processing(1, "1", "gte"))
        self.assertTrue( operator_processing( 1, True, "gte"))
        self.assertTrue(operator_processing( True, False, "gte"))

    def test_lt_operator(self):
        self.assertFalse(operator_processing(1, 1, "lt"))
        self.assertFalse(operator_processing(True, True, "lt"))
        self.assertRaisesRegex(Exception, "Bad operator lt for compare 'value' and 'value'", operator_processing, "value", "value", "lt")
        self.assertTrue(operator_processing(1, 2, "lt"))
        self.assertFalse(operator_processing(2, 1, "lt"))
        self.assertTrue(operator_processing(1, "2", "lt"))
        self.assertFalse(operator_processing(1, "1", "lt"))
        self.assertFalse(operator_processing(1, True, "lt"))
        self.assertFalse(operator_processing(True, False, "lt"))

    
    def test_lte_operator(self):
        self.assertTrue(operator_processing(1, 1, "lte"))
        self.assertTrue(operator_processing( True, True, "lte"))
        self.assertRaisesRegex(Exception, "Bad operator lte for compare 'value' and 'value'", operator_processing, "value", "value", "lte")
        self.assertTrue(operator_processing(1, 2, "lte"))
        self.assertFalse(operator_processing(2, 1, "lte"))
        self.assertTrue(operator_processing(1, "2", "lte"))
        self.assertTrue(operator_processing(1, "1", "lte"))
        self.assertTrue(operator_processing(1, True, "lte"))
        self.assertFalse(operator_processing(True, False, "lte"))

    def test_unknown_operator(self):
        self.assertFalse(operator_processing(1, 1, "abcd"))
        self.assertFalse(operator_processing(True, True, "abcd"))
        self.assertFalse(operator_processing("value", "value", "abcd"))
        self.assertFalse(operator_processing(1, 2, "abcd"))
        self.assertFalse(operator_processing(2, 1, "abcd"))
        self.assertFalse(operator_processing(1, "2", "abcd"))
        self.assertFalse(operator_processing(1, "1", "abcd"))
        self.assertFalse(operator_processing(1, True, "abcd"))
        self.assertFalse(operator_processing(True, False, "abcd"))