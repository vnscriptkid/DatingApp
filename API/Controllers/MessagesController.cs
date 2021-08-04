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
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public MessagesController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var senderUsername = User.GetUsername();

            if (senderUsername == createMessageDto.RecipientUsername)
                return BadRequest("You can not send messages to yourself");

            var sender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(senderUsername);
            var recipient = await _unitOfWork.UserRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if (recipient == null) return NotFound();

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                Content = createMessageDto.Content,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName
            };

            _unitOfWork.MessageRepository.AddMessage(message);

            if (await _unitOfWork.Complete())
                return Ok(_mapper.Map<MessageDto>(message));

            return BadRequest("Failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessagesParams messagesParams)
        {
            messagesParams.Username = User.GetUsername();

            var pagedMessages = await _unitOfWork.MessageRepository.GetMessagesForUser(messagesParams);

            Response.AddPaginationHeader(
                pagedMessages.CurrentPage,
                pagedMessages.PageSize,
                pagedMessages.TotalCount,
                pagedMessages.TotalPages
            );

            return pagedMessages;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();

            var message = await _unitOfWork.MessageRepository.GetMessage(id);

            if (message == null) return NotFound();

            if (message.SenderUsername != username && message.RecipientUsername != username)
                return Unauthorized();

            if (username == message.SenderUsername) message.SenderDeleted = true;

            if (username == message.RecipientUsername) message.RecipientDeleted = true;

            if (message.SenderDeleted && message.RecipientDeleted)
                _unitOfWork.MessageRepository.DeleteMessage(message);

            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to delete message");
        }
    }
}