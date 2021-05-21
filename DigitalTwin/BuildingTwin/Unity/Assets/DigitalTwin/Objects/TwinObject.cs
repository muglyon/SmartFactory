using System.Collections;
using System.Collections.Generic;
using System;
using UnityEngine;

public abstract class TwinObject : MonoBehaviour
{
    protected string toolTipText = ""; // set this in the Inspector


    private string currentToolTipText = "";
    private GUIStyle guiStyleFore;
    private GUIStyle guiStyleBack;


    void Start()
    {
        guiStyleFore = new GUIStyle();
        guiStyleFore.normal.textColor = Color.white;
        guiStyleFore.alignment = TextAnchor.UpperCenter;
        guiStyleFore.wordWrap = true;
        guiStyleBack = new GUIStyle();
        guiStyleBack.normal.textColor = Color.black;
        guiStyleBack.alignment = TextAnchor.UpperCenter;
        guiStyleBack.wordWrap = true;
    }


    void OnMouseEnter()
    {
        currentToolTipText = $"ID : {gameObject.name} \n" + toolTipText;

    }


    void OnMouseExit()
    {
        currentToolTipText = "";
    }

    protected void updateTooltipText(string text)
    {
        toolTipText = text;
        if(currentToolTipText != "")
        {
            currentToolTipText = text;
        }
    }


    void OnGUI()
    {
        if (currentToolTipText != "")
        {
            var x = Event.current.mousePosition.x;
            var y = Event.current.mousePosition.y;
            GUI.Label(new Rect(x - 149, y + 21, 300, 60), currentToolTipText, guiStyleBack);
            GUI.Label(new Rect(x - 150, y + 20, 300, 60), currentToolTipText, guiStyleFore);
        }
    }
    public abstract void UpdateTwin(TwinModel model);
}
