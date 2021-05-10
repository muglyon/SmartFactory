using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ClimObject : TwinObject
{
    public override void UpdateTwin(TwinModel model)
    {
        Clim clim = (Clim)model;
        updateTooltipText(clim.ToString());
    }

}
