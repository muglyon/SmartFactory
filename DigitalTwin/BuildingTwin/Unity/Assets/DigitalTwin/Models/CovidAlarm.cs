using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CovidAlarm : TwinModel
{
    public string date { get; set; }
    public string status { get; set; }
    public string printedText { get; set; }

    public override string ToString()
    {
        return $"Date : {System.DateTime.Parse(date).ToString("F")} \n" +
            $"Status : {status} \n" +
            $"Affichage : {printedText}";
    }
}
