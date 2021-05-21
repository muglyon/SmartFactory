using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Hall : TwinModel
{
    public Hall() { }
    public string date { get; set; }
    public int width { get; set; }

    public int height { get; set; }
    public int length { get; set; }
    public float eco { get; set; }
    public float globalConsumption { get; set; }
    public int nbPeople { get; set; }

    public override string ToString()
    {
        return $"Date : {System.DateTime.Parse(date).ToString("F")} \n" +
            $"Dimensions : {width} X {length} X {height} \n" +
            $"Consommation : {globalConsumption} \n" +
            $"Nombre de personnes : {nbPeople}";
    }

}
