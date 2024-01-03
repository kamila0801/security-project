using System.Text.Json;

namespace MainAPI.Controllers;
using System.IO;
using System.Text;
using System.Security.Cryptography;

public static class EncryptionUtility
{
    private const string AuthKey = "793443246df9479b";
    
    public static string DecryptString(string cipherText, string IV)
    {
        // Convert the key and iv from string to byte array
        var key = Encoding.UTF8.GetBytes(AuthKey);
        var iv = Encoding.UTF8.GetBytes(IV);

        using (var aesAlg = Aes.Create())
        {
            aesAlg.Key = key;
            aesAlg.IV = iv;
            aesAlg.Mode = CipherMode.CBC;
            aesAlg.Padding = PaddingMode.PKCS7;

            var decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

            using (var msDecrypt = new MemoryStream(Convert.FromBase64String(cipherText)))
            {
                using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                {
                    using (var srDecrypt = new StreamReader(csDecrypt))
                    {
                        return srDecrypt.ReadToEnd();
                    }
                }
            }
        }
    }
}