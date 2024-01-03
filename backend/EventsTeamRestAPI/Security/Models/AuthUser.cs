namespace Security.Models;

public class AuthUser
{
  public int Id { get; set; }
  public string FirstName { get; set; }
  public string LastName { get; set; }
  public string Email { get; set; }
  public string PlainTextPassword { get; set; }
  public string HashedPassword { get; set; }
  public byte[] Salt { get; set; }
  public string RefreshToken { get; set; }
  public DateTime? RefreshTokenExpiryDate { get; set; }
  //Last
//     public int Id { get; set; }
//     public string FirstName { get; set; }
//     public string LastName { get; set; }
//     public string Email { get; set; }
//     public string? ProfilePicture { get; set; }
//     public AuthMethod Auth{ get; set; }
    
    // public string? PlainTextPassword { get; set; }
    // public string? HashedPassword { get; set; }
    // public byte[]? Salt { get; set; }
    // public string? GoogleId { get; set; }
    // public string? FacebookId { get; set; }
    // public string? ProfilePicture { get; set; }
}