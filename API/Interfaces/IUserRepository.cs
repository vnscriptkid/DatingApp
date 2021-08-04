using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<IEnumerable<AppUser>> GetAllUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string Username);
        Task<PagedList<MemberDto>> GetAllMembersAsync(UserParams userParams);
        Task<MemberDto> GetMemberByUsernameAsync(string Username);
    }
}