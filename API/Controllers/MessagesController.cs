using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;

        public MessagesController(IUserRepository userRepository, IMessageRepository messageRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _messageRepository = messageRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var senderUsername = User.GetUsername();

            if (senderUsername == createMessageDto.RecipientUsername)
                return BadRequest("You can not send messages to yourself");

            var sender = await _userRepository.GetUserByUsernameAsync(senderUsername);
            var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if (recipient == null) return NotFound();

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
                return Ok(_mapper.Map<MessageDto>(message));

            return BadRequest("Failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessagesParams messagesParams)
        {
            messagesParams.Username = User.GetUsername();

            var pagedMessages = await _messageRepository.GetMessagesForUser(messagesParams);

            Response.AddPaginationHeader(
                pagedMessages.CurrentPage,
                pagedMessages.PageSize,
                pagedMessages.TotalCount,
                pagedMessages.TotalPages
            );

            return pagedMessages;
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
        {
            var currentUsername = User.GetUsername();

            var otherUser = await _userRepository.GetUserByUsernameAsync(username);

            if (otherUser == null) return NotFound();

            return Ok(await _messageRepository.GetMessageThread(currentUsername, otherUser.UserName));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();

            var message = await _messageRepository.GetMessage(id);

            if (message == null) return NotFound();

            if (message.SenderUsername != username && message.RecipientUsername != username)
                return Unauthorized();

            if (username == message.SenderUsername) message.SenderDeleted = true;

            if (username == message.RecipientUsername) message.RecipientDeleted = true;

            if (message.SenderDeleted && message.RecipientDeleted)
                _messageRepository.DeleteMessage(message);

            if (await _messageRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to delete message");
        }
    }
}