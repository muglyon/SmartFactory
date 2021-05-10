using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LightObject : TwinObject
{

    private bool isRunning = false;
    public override void UpdateTwin(TwinModel model)
    {
        Light light = (Light)model;
        updateTooltipText(light.ToString());
        if (light.isRunning != isRunning)
        {
            isRunning = light.isRunning;
            changeChildColors();
        }
    }

    private void changeChildColors()
    {
        var propBlock = new MaterialPropertyBlock();
        foreach (Renderer renderer in transform.GetComponentsInChildren<Renderer>())
        {
            // Get the current value of the material properties in the renderer.
            renderer.GetPropertyBlock(propBlock);
            // Assign our new value.
            propBlock.SetColor("_Color", isRunning == true ? Color.yellow : Color.grey);
            // Apply the edited values to the renderer.
            renderer.SetPropertyBlock(propBlock);
        }
    }
}