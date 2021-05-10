using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FireAlarmObject : TwinObject
{

    private string status = "";
    public override void UpdateTwin(TwinModel model)
    {
        FireAlarm alarm = (FireAlarm)model;
        updateTooltipText(alarm.ToString());
        if (alarm.status != status)
        {
            status = alarm.status;
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
            propBlock.SetColor("_Color", status == "ON" ? Color.red : Color.green);
            // Apply the edited values to the renderer.
            renderer.SetPropertyBlock(propBlock);
        }
    }
}
