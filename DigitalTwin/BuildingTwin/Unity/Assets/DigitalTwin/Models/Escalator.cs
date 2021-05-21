using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Escalator : TwinModel
{
    public string date { get; set; }

    public bool isRunning { get; set; }
    public float consumption { get; set; }

    public override string ToString()
    {
        return $"Date : {System.DateTime.Parse(date).ToString("F")} \n" +
            $"Status : {(isRunning ? "ON" : "OFF")} \n" +
            $"Consommation : {consumption}";
    }
}
