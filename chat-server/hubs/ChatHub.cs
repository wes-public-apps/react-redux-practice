// Wesley Murray
// 3/10/2020
// Chathub file created.

using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace chat_server.hubs{
    public class ChatHub: Hub{
        public async Task SendMessage(string username, string message)
        {
            await Clients.All.SendAsync("RecieveMessage", username, message);
        }
    }
}