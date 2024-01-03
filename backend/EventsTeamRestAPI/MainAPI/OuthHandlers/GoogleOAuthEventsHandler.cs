using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.OAuth;
using System.Security.Claims;


namespace MainAPI.OuthHandlers;

public class GoogleOAuthEventsHandler: OAuthEvents
{
    // private readonly IUserRepository _userRepository;

    public GoogleOAuthEventsHandler()
    {
        // _userRepository = userRepository;
        OnCreatingTicket = HandleCreatingTicketAsync;
    }

    private async Task HandleCreatingTicketAsync(OAuthCreatingTicketContext context)
    {
        // Your OnCreatingTicket logic here, for example:
        var emailClaim = context.Principal.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Email);

        if (emailClaim != null)
        {
            string userEmail = emailClaim.Value;

            // Check if the user exists in your application's database
            //var user = await _userRepository.GetUserByEmailAsync(userEmail);

            // Perform additional actions as needed
        }
    }
}