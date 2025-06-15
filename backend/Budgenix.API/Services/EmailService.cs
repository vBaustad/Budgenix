namespace Budgenix.Services
{
    public interface IEmailService
    {
        Task SendEmailConfirmationAsync(string toEmail, string confirmationLink);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailConfirmationAsync(string toEmail, string confirmationLink)
        {
            var apiKey = _config["SparkPost:ApiKey"];
            var client = new SparkPost.Client(apiKey)
            {
                ApiHost = "https://api.eu.sparkpost.com"
            };


            var transmission = new SparkPost.Transmission
            {
                Content = new SparkPost.Content
                {
                    From = new SparkPost.Address
                    {
                        Email = "no-reply@mail.vebjornbaustad.no",
                        Name = "Budgenix"
                    },
                    Subject = "Confirm your email",
                    Html = $@"
                        <table style='width:100%; max-width:600px; margin:auto; font-family:Arial, sans-serif; border-collapse:collapse; background-color:#FDFBF7; border:1px solid #E8DFD2;'>
                          <tr>
                            <td style='background-color:#4C7C59; padding:20px; text-align:center; color:#FFFFFF;'>
                              <h1 style='margin:0; font-size:24px;'>Budgenix</h1>
                            </td>
                          </tr>
                          <tr>
                            <td style='padding:30px; background-color:#F5F1EA;'>
                              <p style='font-size:16px; color:#2A2927; margin:0 0 16px;'>Hi there,</p>
                              <p style='font-size:16px; color:#2A2927; margin:0 0 24px;'>
                                Thanks for signing up for <strong>Budgenix</strong>! Please confirm your email address by clicking the button below:
                              </p>
                              <p style='text-align:center; margin:30px 0;'>
                                <a href='{confirmationLink}' style='background-color:#4C7C59; color:#FFFFFF; padding:12px 24px; text-decoration:none; border-radius:4px; font-size:16px;'>
                                  Confirm Email
                                </a>
                              </p>
                              <p style='font-size:14px; color:#6b7280; margin:0;'>
                                If you didn’t create this account, feel free to ignore this message.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style='background-color:#E8DFD2; color:#6b7280; padding:15px; text-align:center; font-size:12px;'>
                              © {DateTime.UtcNow.Year} Budgenix. All rights reserved.
                            </td>
                          </tr>
                        </table>"
                        },
                        Recipients = new List<SparkPost.Recipient>
                        {
                            new SparkPost.Recipient
                            {
                                Address = new SparkPost.Address
                                {
                                    Email = toEmail
                                }
                            }
                        }
                    };


            var response = await client.Transmissions.Send(transmission);
            if (response.StatusCode != System.Net.HttpStatusCode.OK &&
                response.StatusCode != System.Net.HttpStatusCode.Accepted)
            {
                throw new Exception("Failed to send confirmation email.");
            }
        }
    }

}
