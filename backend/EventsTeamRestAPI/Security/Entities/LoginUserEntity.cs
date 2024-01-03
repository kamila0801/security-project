namespace Security.Entities;

public class LoginUserEntity
{
  public int Id { get; set; }
  public string FirstName { get; set; }
  public string LastName { get; set; }
  public string? Email  { get; set; }
  public string? RefreshToken { get; set; }
  public DateTime? RefreshTokenExpiryDate { get; set; }
}