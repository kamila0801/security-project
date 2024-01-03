namespace MainAPI.SecurityDto;

public class LoginDto
{
  public string Email { get; set; }
  public string Password { get; set; }
  public string ClientSecret { get; set; }  // Client Secret property
}
