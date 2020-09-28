#############################################
# Copyright 2020 CC-BY-SA author : MUG Lyon #
#############################################

This project shows how Azure Custom Vision can detect impurities : 
when filling in a green bocal with green balls, when a white ball is inserted by error, then the AI can deted the intruder.

Steps (for more details, see PDF to come) : 
* amonsgst the folder green/white/mixt ==> send all images to Azure Custom Vision
* manually select via a rectangle tool the location of white balls and green balls
* now the AI starts to understand what is a ball and helps you by pre-selection with a rectangle the balls on the other images
* now you have 2 categories, run the training
* now the AI is trained, try to upload an image that the AI has never seen before. It will detect white balls, green balls with a very goog accuracy.

If you have the hadware equipment (Azure IoT Edge box ideally with Ubuntu + USB camera) or you are doing the tutorial with the "Smart-F educational platform" you will be able to export your trained model to the Azure IoT Edge Box or the "Smart-F educational platform".
From their, you will be able to provide the AI a new image, not by uploading it to Azure, but directly using the camera.
