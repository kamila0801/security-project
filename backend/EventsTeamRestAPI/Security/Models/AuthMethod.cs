using Security.Enums;

namespace Security.Models;

public class AuthMethod
{
    public int Id { get; set; }
    public int UserId { get; set; } // Foreign Key referencing 'AuthUser' class
    public AuthProvider Provider { get; set; } // e.g., 'google', 'facebook', 'email_password'
    public string? ExternalUserId { get; set; } // Unique user ID from the login provider, Nullable
    // This email is only used for the login in with email and password, the email we use to contact users is stored in the user table
    public string? Email { get; set; } // Unique user ID from the login provider, Nullable
    public string? PasswordHash { get; set; } // Nullable, for email_password method
    public byte[]? PasswordSalt { get; set; } // Nullable, if you use a salt for hashing passwords
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}