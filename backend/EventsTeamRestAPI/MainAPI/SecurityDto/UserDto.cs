namespace MainAPI.SecurityDto;

public class UserDto
{
  public int  Id { get; set; }
  public string FirstName { get; set; }
  public string LastName { get; set; }
  public string Email { get; set; }
  
  //TODO: could contain a list of clubs where user is owner, admin, member etc
}