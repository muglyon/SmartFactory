using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EscalatorObject : TwinObject
{
    private bool isRunning = false;
    public override void UpdateTwin(TwinModel model)
    {
        Escalator escalator = (Escalator)model;
        updateTooltipText(escalator.ToString());
        if (escalator.isRunning != isRunning)
        {
            isRunning = escalator.isRunning;
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
