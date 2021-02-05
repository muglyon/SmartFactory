using System.Collections;
using System.Collections.Generic;
using System;

public class TwinModel
{
    public bool isRunning { get; set; }
    
    public bool isGripperOpen { get; set; }

    public string workOrder { get; set; }

    public Position position { get; set; }

    public override bool Equals(Object obj)
    {
        return (obj is TwinModel) &&
            ((TwinModel)obj).isRunning == isRunning &&
            ((TwinModel)obj).isGripperOpen == isGripperOpen &&
            ((TwinModel)obj).workOrder == workOrder &&
            ((TwinModel)obj).position.Equals(position);
    }
}
