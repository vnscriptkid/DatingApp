using System;
using System.Threading.Tasks;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        private readonly IUserRepository _userRepo;

        public LogUserActivity(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userId = resultContext.HttpContext.User.GetUserId();

            var user = await _userRepo.GetUserByIdAsync(userId);

            user.LastActive = DateTime.Now;

            await _userRepo.SaveAllAsync();
        }
    }
}