using System;
using System.Threading.Tasks;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        private readonly IUnitOfWork _unitOfWork;
        public LogUserActivity(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userId = resultContext.HttpContext.User.GetUserId();

            var user = await _unitOfWork.UserRepository.GetUserByIdAsync(userId);

            user.LastActive = DateTime.UtcNow;

            await _unitOfWork.Complete();
        }
    }
}