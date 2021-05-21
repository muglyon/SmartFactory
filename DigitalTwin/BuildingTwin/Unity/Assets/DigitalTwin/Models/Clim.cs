using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Clim : TwinModel
{
    public string date { get; set; }
    public string version { get; set; }
    public float consumption { get; set; }
    public float temperature { get; set; }
    public float desiredTemperature { get; set; }

    public override string ToString()
    {
        return $"Date : {System.DateTime.Parse(date).ToString("F")} \n" +
            $"Version : {version} \n" +
            $"Consommation : {consumption}\n" +
            $"Temperature : {temperature}";
    }
}
