using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace SignalR
{
    public static class SignalR
    {
        public static double temperature;

        [FunctionName("negotiate")]
        public static SignalRConnectionInfo GetSignalRInfo(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req,
            [SignalRConnectionInfo(HubName = "dttelemetry")] SignalRConnectionInfo connectionInfo)
        {
            return connectionInfo;
        }

        [FunctionName("broadcast")]
        public static Task SendMessage(
            [EventGridTrigger] EventGridEvent eventGridEvent,
            [SignalR(HubName = "dttelemetry")] IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger log)
        {

            JObject eventGridData = (JObject)JsonConvert.DeserializeObject(eventGridEvent.Data.ToString());

            log.LogInformation($"Event grid message: {eventGridData}");
            var message = new Dictionary<object, object> { };
            foreach (JObject patch in eventGridData["data"]["patch"])
            {
                message[patch["path"].ToString().Substring(1)] = patch["value"].ToString();
            }
            // var patch = (JObject)eventGridData["data"]["patch"][0];
            // if (patch["path"].ToString().Contains("/Temperature"))
            // {
            //     temperature = Math.Round(patch["value"].ToObject<double>(), 2);
            // }

            var messageWithId = new Dictionary<object, object>
            {
                {eventGridEvent.Subject.ToString(), message}
            };
            return signalRMessages.AddAsync(
                new SignalRMessage
                {
                    Target = "newMessage",
                    Arguments = new[] { messageWithId }
                });
        }
    }
}