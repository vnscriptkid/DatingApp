using System;

namespace API.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateTime dob)
        {
            var today = DateTime.Now;
            var age = today.Year - dob.Year;

            if (today.AddYears(-age).Date < dob.Date) age--;

            return age;
        }
    }
}