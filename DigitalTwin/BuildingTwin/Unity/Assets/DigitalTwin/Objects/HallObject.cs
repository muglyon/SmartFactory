using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HallObject : TwinObject
{
    private bool isRed { get; set; }
    public override void UpdateTwin(TwinModel model)
    {
        Hall hall = (Hall)model;
        updateTooltipText(hall.ToString());

    }

    private void changeChildColors()
    {
        var propBlock = new MaterialPropertyBlock();
        foreach (Renderer renderer in transform.GetComponentsInChildren<Renderer>())
        {
            // Get the current value of the material properties in the renderer.
            renderer.GetPropertyBlock(propBlock);
            // Assign our new value.
            propBlock.SetColor("_Color", isRed ? Color.red : Color.white);
            // Apply the edited values to the renderer.
            renderer.SetPropertyBlock(propBlock);
        }
    }

}
