namespace Budgenix.Models.Shared
{
    public class ApiResponse<T>
    {
        public bool Ok { get; set; }
        public int Status { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }

        public static ApiResponse<T> Success(T data, string? message = null, int status = 200)
        {
            return new ApiResponse<T>
            {
                Ok = true,
                Status = status,
                Message = message ?? "Success",
                Data = data
            };
        }

        public static ApiResponse<T> Fail(string message, int status)
        {
            return new ApiResponse<T>
            {
                Ok = false,
                Status = status,
                Message = message,
                Data = default
            };
        }
    }
}
