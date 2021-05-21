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

    private DigitalTwinsClient client;
    public TwinModel twin;
    public Dictionary<string, string[]> twinModels = new Dictionary<string, string[]>()
    {
        { "Hall", new string[] { "Hall_01", "Hall_02", "Hall_03" } },
        { "Light", new string[] { "Light_01", "Light_02", "Light_03" } },
        { "Clim", new string[] { "Clim_01", "Clim_02", "Clim_03" } },
        { "Escalator", new string[] { "Escalator_01", "Escalator_02", "Escalator_03" } },
        { "FireAlarm", new string[] { "FireAlarm_01", "FireAlarm_02", "FireAlarm_03" } },
        { "CovidAlarm", new string[] { "CovidAlarm_01", "CovidAlarm_02", "CovidAlarm_03" } },
    };

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
        StartCoroutine(CheckTwin());


    }

    // Update is called once per frame
    IEnumerator CheckTwin()
    {
        while(true)
        {
            foreach (KeyValuePair<string, string[]> models in twinModels)
            {
                foreach (string twinId in models.Value)
                {
                    TwinModel model = null;
                    switch (models.Key)
                    {
                        case "Hall":
                            model = client.GetDigitalTwin<Hall>(twinId);
                            break;
                        case "Light":
                            model = client.GetDigitalTwin<Light>(twinId);
                            break;
                        case "CovidAlarm":
                            model = client.GetDigitalTwin<CovidAlarm>(twinId);
                            break;
                        case "Clim":
                            model = client.GetDigitalTwin<Clim>(twinId);
                            break;
                        case "FireAlarm":
                            model = client.GetDigitalTwin<FireAlarm>(twinId);
                            break;
                        case "Escalator":
                            model = client.GetDigitalTwin<Escalator>(twinId);
                            break;
                        default:
                            break;
                    }
                    SendTwinUpdate(twinId, model);
                }
            }

            yield return new WaitForSeconds(5);
        }
      
    }

    void SendTwinUpdate(string twinId, TwinModel newTwin)
    {
        GameObject twinObject = GameObject.Find(twinId);

        TwinObject twinScript = twinObject.GetComponent<TwinObject>();
        twinScript.UpdateTwin(newTwin);
    }
}
