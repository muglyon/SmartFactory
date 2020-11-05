from unittest import TestCase
from processing.alerts.message_creator import message_creator

class Test(TestCase):
    def test_message_creator(self):
        self.assertEqual(
            message_creator("Key1", 1, 2, "2020-10-22T14:16:32.158Z", "eq"),
             "'1' égal à '2' pour la mesure 'Key1' le '2020-10-22T14:16:32.158Z'"
             )
        self.assertEqual(
            message_creator("Key1", 1, 2, "2020-10-22T14:16:32.158Z", "neq"),
             "'1' différent de '2' pour la mesure 'Key1' le '2020-10-22T14:16:32.158Z'"
            )
        self.assertEqual(
            message_creator("Key1", 1, 2, "2020-10-22T14:16:32.158Z", "gt"),
            "'1' supérieur ou égal à '2' pour la mesure 'Key1' le '2020-10-22T14:16:32.158Z'"
            )
        self.assertEqual(
            message_creator("Key1", 1, 2, "2020-10-22T14:16:32.158Z", "gte"),
             "'1' supérieur à '2' pour la mesure 'Key1' le '2020-10-22T14:16:32.158Z'"
            )
        self.assertEqual(
            message_creator("Key1", 1, 2, "2020-10-22T14:16:32.158Z", "lt"),
            "'1' inférieur ou égal à '2' pour la mesure 'Key1' le '2020-10-22T14:16:32.158Z'"
            )
        self.assertEqual(
            message_creator("Key1", 1, 2,"2020-10-22T14:16:32.158Z", "lte"),
             "'1' inférieur à '2' pour la mesure 'Key1' le '2020-10-22T14:16:32.158Z'"
            )
