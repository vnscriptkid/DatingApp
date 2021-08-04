using System;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _presenceTracker;

        public PresenceHub(PresenceTracker presenceTracker)
        {
            _presenceTracker = presenceTracker;
        }

        public override async Task OnConnectedAsync()
        {
            var firstConnectionFromUser = await _presenceTracker.UserConnected(
                    Context.User.GetUsername(),
                    Context.ConnectionId);

            if (firstConnectionFromUser)
                await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUsername());

            var onlineUsers = await _presenceTracker.GetOnlineUsers();

            await Clients.Caller.SendAsync("GetOnlineUsers", onlineUsers);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var offlineNow = await _presenceTracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);

            if (offlineNow)
                await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());

            await base.OnDisconnectedAsync(exception);
        }
    }
}