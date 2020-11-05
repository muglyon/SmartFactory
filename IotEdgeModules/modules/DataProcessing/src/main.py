# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project root for
# full license information.

import time
import sys
import asyncio
from six.moves import input
from azure.iot.device.aio import IoTHubModuleClient
from processing.listener import input_listener
from LoggerSingleton import EdgeLogger


async def main(): # pragma: no cover
    try:
        if not sys.version >= "3.5.3":
            raise Exception("The sample requires python 3.5.3+. Current version of Python: %s" % sys.version )
        EdgeLogger().logger.info("IoT Hub Client for Python")

        # The client object is used to interact with your Azure IoT hub.
        module_client = IoTHubModuleClient.create_from_edge_environment()

        # connect the client.
        await module_client.connect()

        # define behavior for halting the application
        def stdin_listener():
            while True:
                try:
                    selection = input()
                    if selection == "Q" or selection == "q":
                        print("Quitting...")
                        break
                except:
                    time.sleep(10)

        # Schedule task for C2D Listener
        listeners = asyncio.gather(input_listener(module_client))

        EdgeLogger().logger.info("The module is now waiting for messages.")

        # Run the stdin listener in the event loop
        loop = asyncio.get_event_loop()
        user_finished = loop.run_in_executor(None, stdin_listener)

        # Wait for user to indicate they are done listening for messages
        await user_finished

        # Cancel listening
        listeners.cancel()

        # Finally, disconnect
        await module_client.disconnect()

    except Exception as e:
        EdgeLogger().logger.error("Unexpected error %s " % e)
        raise

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
    loop.close()

    # If using Python 3.7 or above, you can use following code instead:
    # asyncio.run(main())
