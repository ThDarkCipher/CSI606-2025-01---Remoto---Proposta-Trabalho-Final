using GemaGestor.Models.Users;
using GemaGestor.Settings;
using Microsoft.Extensions.Options;
using OtpNet;
using QRCoder;
using System.Drawing.Imaging;

namespace GemaGestor.Services
{
    public class OTPService {
        private readonly OTPConfiguration otpConfig;
        public OTPService(IOptions<OTPConfiguration> configuration) {
            this.otpConfig = configuration.Value;
        }
        public string GenerateKey(int length = 20) {
            byte[] key = KeyGeneration.GenerateRandomKey(length);
            return Base32Encoding.ToString(key);
        }
        public string GenerateCode(User user, int length = 6) {
            PayloadGenerator.OneTimePassword QrCode = new PayloadGenerator.OneTimePassword() {
                Secret = user.SecretKey,
                Label = user.UserName,
                Issuer = otpConfig.Issuer,
                Digits = otpConfig.Digits
            };
            string payload = QrCode.ToString();

            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(payload, QRCodeGenerator.ECCLevel.Q);
            PngByteQRCode qrCode = new PngByteQRCode(qrCodeData);
            var qrCodeAsPNG = qrCode.GetGraphic(20);
            using(MemoryStream ms = new MemoryStream()) {
                ms.Write(qrCodeAsPNG, 0, qrCodeAsPNG.Length);
                byte[] Image = ms.ToArray();
                payload = Convert.ToBase64String(Image);
            }
            return payload;
        }

        public bool ValidateCode(string secretKey, string code) {
            Totp otp = new Totp(Base32Encoding.ToBytes(secretKey));
            return otp.VerifyTotp(code, out long timeStepMatched, new VerificationWindow(1, 1));
        }
    }
}
