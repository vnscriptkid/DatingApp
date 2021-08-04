using System;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly PresenceTracker _presenceTracker;

        public MessageHub(
            IMessageRepository messageRepository,
            IMapper mapper,
            IUserRepository userRepository,
            IHubContext<PresenceHub> presenceHub,
            PresenceTracker presenceTracker
            )
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _presenceHub = presenceHub;
            _presenceTracker = presenceTracker;
            _messageRepository = messageRepository;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();

            var otherUsername = httpContext.Request.Query["user"].ToString();

            var otherUser = _userRepository.GetUserByUsernameAsync(otherUsername);

            if (otherUser == null) throw new HubException("User not found");

            var groupName = GetGroupName(Context.User.GetUsername(), otherUsername);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            Group group = await AddToGroup(groupName);

            await Clients.Group(groupName).SendAsync("GroupUpdated", group);

            var messages = await _messageRepository.GetMessageThread(Context.User.GetUsername(), otherUsername);

            await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Group group = await RemoveFromGroup();

            await Clients.Group(group.Name).SendAsync("GroupUpdated", group);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var senderUsername = Context.User.GetUsername();

            if (senderUsername == createMessageDto.RecipientUsername)
                throw new HubException("You can not send messages to yourself");

            var sender = await _userRepository.GetUserByUsernameAsync(senderUsername);
            var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if (recipient == null) throw new HubException("User not found");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                Content = createMessageDto.Content,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName
            };

            var groupName = GetGroupName(sender.UserName, recipient.UserName);

            var group = await _messageRepository.GetMessageGroup(groupName);

            if (group.Connections.Any(c => c.Username == recipient.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }
            else
            {
                var connections = await _presenceTracker.GetConnectionsForUser(recipient.UserName);

                if (connections != null)
                {
                    await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived",
                        new { username = sender.UserName, knownAs = sender.KnownAs });
                }
            }

            _messageRepository.AddMessage(message);

            if (await _messageRepository.SaveAllAsync())
            {
                await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDto>(message));
            }
        }

        private async Task<Group> AddToGroup(string groupName)
        {
            var group = await _messageRepository.GetMessageGroup(groupName);

            if (group == null)
            {
                group = new Group(groupName);

                _messageRepository.AddGroup(group);
            }

            var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());

            group.Connections.Add(connection);

            if (await _messageRepository.SaveAllAsync()) return group;

            throw new HubException("Failed to add connection to group");
        }

        private async Task<Group> RemoveFromGroup()
        {
            var group = await _messageRepository.getGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(c => c.ConnectionId == Context.ConnectionId);

            _messageRepository.RemoveConnection(connection);

            if (await _messageRepository.SaveAllAsync()) return group;

            throw new HubException("Failed to remove connection from group");
        }

        private string GetGroupName(string caller, string callee)
        {
            var compareString = string.CompareOrdinal(caller, callee);

            return compareString < 0 ? $"{caller}-{callee}" : $"{callee}-{caller}";
        }
    }
}