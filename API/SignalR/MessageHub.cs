using System;
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

        public MessageHub(IMessageRepository messageRepository, IMapper mapper, IUserRepository userRepository)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _messageRepository = messageRepository;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();

            var otherUsername = httpContext.Request.Query["user"].ToString();

            var otherUser = _userRepository.GetUserByUsernameAsync(otherUsername);

            if (otherUser == null) throw new HubException("User not found");

            var groupName = this.GetGroupName(Context.User.GetUsername(), otherUsername);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var messages = await _messageRepository.GetMessageThread(Context.User.GetUsername(), otherUsername);

            await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
        }

        private string GetGroupName(string caller, string callee)
        {
            var compareString = string.CompareOrdinal(caller, callee);

            return compareString < 0 ? $"{caller}-{callee}" : $"{callee}-{caller}";
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
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

            _messageRepository.AddMessage(message);

            if (await _messageRepository.SaveAllAsync())
            {
                var groupName = GetGroupName(sender.UserName, recipient.UserName);
                await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDto>(message));
            }
        }
    }
}