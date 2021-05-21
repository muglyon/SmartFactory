using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class CovidAlarmObject : TwinObject
{
    private string status = "";
    private string text = "";
    public override void UpdateTwin(TwinModel model)
    {
        CovidAlarm alarm = (CovidAlarm)model;
        updateTooltipText(alarm.ToString());
        if(alarm.status != status)
        {
            status = alarm.status;
            text = alarm.printedText;
            changeChildColors();
        }
    }

    private void changeChildColors()
    {
        Text textObject = GetComponentInChildren<Text>();
        textObject.color = status == "ON" ? Color.red : Color.green;
        textObject.text = text;

    }
}
