using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class Position: System.Object
{
    public float x { get; set; }

    public float y { get; set; }

    public float z { get; set; }

    public override bool Equals(System.Object obj)
    {
        return (obj is Position) &&
            ((Position)obj).x == x &&
            ((Position)obj).y == y &&
            ((Position)obj).z == z;
    }

}
