using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.SignalR
{
    public class PresenceTracker
    {
        private static readonly Dictionary<string, List<string>> OnlineUsers
            = new Dictionary<string, List<string>>();

        public Task<bool> UserConnected(string username, string connectionId)
        {
            var firstConnectionFromUser = false;

            lock (OnlineUsers)
            {
                if (!OnlineUsers.ContainsKey(username))
                {
                    OnlineUsers.Add(username, new List<string>());
                    firstConnectionFromUser = true;
                }
                OnlineUsers[username].Add(connectionId);
            }

            return Task.FromResult(firstConnectionFromUser);
        }

        public Task<bool> UserDisconnected(string username, string connectionId)
        {
            var isOfflineNow = false;

            lock (OnlineUsers)
            {
                if (!OnlineUsers.ContainsKey(username)) return Task.FromResult(true);

                OnlineUsers[username].Remove(connectionId);

                if (OnlineUsers[username].Count == 0)
                {
                    OnlineUsers.Remove(username);
                    isOfflineNow = true;
                }
            }

            return Task.FromResult(isOfflineNow);
        }

        public Task<string[]> GetOnlineUsers()
        {
            string[] onlineUsers;

            lock (OnlineUsers)
            {
                onlineUsers = OnlineUsers.OrderBy(e => e.Key).Select(e => e.Key).ToArray();
            }

            return Task.FromResult(onlineUsers);
        }

        public Task<List<string>> GetConnectionsForUser(string username)
        {
            List<string> connectionIds;

            lock (OnlineUsers)
            {
                connectionIds = OnlineUsers.GetValueOrDefault(username);
            }

            return Task.FromResult(connectionIds);
        }
    }
}