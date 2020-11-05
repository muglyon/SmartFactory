from unittest import TestCase

from utils.utils import round_half_up, get_hours_from_seconds


class TestUtils(TestCase):

    def test_round_half_up(self):
        self.assertEqual(0.883, round_half_up(0.8825, 3))
        self.assertEqual(0.773, round_half_up(0.7733, 3))
        self.assertEqual(0, round_half_up(0.000, 3))

    def test_get_hours_from_seconds(self):
        self.assertEqual(1, get_hours_from_seconds(3600))
        self.assertEqual(0, get_hours_from_seconds(0))

