using System.Collections;
using System.Collections.Generic;
using System;
using UnityEngine;
using UnityEngine.UI;
using Azure.DigitalTwins.Core;
using Azure.Identity;

public class DigitalTwinConnector : MonoBehaviour
{

    public string tenantId;
    public string clientId;
    public string clientSecret;
    public string adtInstanceUrl;
    public string twinName;

    public DigitalTwinController controller;
    private DigitalTwinsClient client;
    public TwinModel twin;
    public Text workOrderText;

    private Position offPosition = new Position()
    {
        x = 0.5f,
        y = -1f,
        z = 0.5f
    };
    // Start is called before the first frame update
    void Start()
    {

        var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

        this.client = new DigitalTwinsClient(new Uri(adtInstanceUrl), credential);
        InvokeRepeating("CheckTwin", 5.0f, 5.0f);

        twin = new TwinModel()
        {

            workOrder = "Unknown",

            isRunning = false,

            isGripperOpen = true,

            position = new Position()
            {
                x = 0.5f,
                y = 0.5f,
                z = 0.5f
            }
        };


        SendTwinUpdate(twin);
    }

    // Update is called once per frame
    void CheckTwin()
    {
        TwinModel newTwin = this.client.GetDigitalTwin<TwinModel>(twinName);
        if(!twin.Equals(newTwin))
        {
            SendTwinUpdate(newTwin);
            twin = newTwin;
        }
    }

    void SendTwinUpdate(TwinModel newTwin)
    {

        if(!newTwin.isGripperOpen)
        {
            controller.CloseGripper();
        } else
        {
            controller.OpenGripper();
        }
        if(newTwin.isRunning)
        {

            controller.PublishPosition(newTwin.position.x, newTwin.position.y, newTwin.position.z);
        } else
        {
            controller.PublishPosition(offPosition.x, offPosition.y, offPosition.z);
        }

        workOrderText.text = newTwin.workOrder;
    }
}
