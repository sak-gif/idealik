package com.idealik.backend.service;

import com.idealik.backend.model.OtpEntity;
import com.idealik.backend.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Value("${resend.api.key:}")
    private String resendApiKey;

    @Value("${resend.from.email:onboarding@resend.dev}")
    private String fromEmail;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Transactional
    public void generateAndSendOtp(String email) {
        // Clear any existing OTPs for this email
        otpRepository.deleteByEmail(email);

        // Generate a 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Send email via Resend HTTP API (works on Render — no SMTP port needed)
        sendEmailViaResend(email, otp);

        // Only save OTP after email was sent successfully
        OtpEntity otpEntity = new OtpEntity(email, otp, LocalDateTime.now().plusMinutes(10));
        otpRepository.save(otpEntity);
    }

    private void sendEmailViaResend(String toEmail, String otp) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            throw new RuntimeException("RESEND_API_KEY is not configured. Please add it to your environment variables.");
        }

        String htmlBody = "<!DOCTYPE html>" +
            "<html lang=\"en\"><head><meta charset=\"UTF-8\"><style>" +
            "body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#F9F9F9;padding:40px 20px;color:#1A1C1C;margin:0}" +
            ".container{max-width:540px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.05);border:1px solid #EBE4D8}" +
            ".header{background:#1A1C1C;padding:30px;text-align:center}" +
            ".header h1{color:#C2A86F;margin:0;font-size:28px;font-weight:800;letter-spacing:1px}" +
            ".content{padding:40px 30px;text-align:center}" +
            ".content h2{font-size:20px;color:#1A1C1C;margin-top:0;margin-bottom:10px;font-weight:700}" +
            ".content p{color:#7E7669;font-size:15px;line-height:1.6;margin-bottom:30px}" +
            ".otp-box{background:#F9F9F9;border:1px dashed #C2A86F;border-radius:12px;padding:20px;margin-bottom:30px}" +
            ".otp-code{font-size:40px;font-weight:800;color:#C2A86F;letter-spacing:8px;margin:0}" +
            ".footer{background:#F9F9F9;padding:20px;text-align:center;border-top:1px solid #EBE4D8}" +
            ".footer p{color:#A8A092;font-size:12px;margin:0}" +
            "</style></head><body>" +
            "<div class=\"container\">" +
            "<div class=\"header\"><h1>iDAELİK</h1></div>" +
            "<div class=\"content\">" +
            "<h2>Verify Your Email</h2>" +
            "<p>Use the code below to complete your registration. It expires in <strong>10 minutes</strong>.</p>" +
            "<div class=\"otp-box\"><p class=\"otp-code\">" + otp + "</p></div>" +
            "<p>If you didn't request this, you can safely ignore this email.</p>" +
            "</div>" +
            "<div class=\"footer\"><p>&copy; 2026 iDAELİK. All rights reserved.</p></div>" +
            "</div></body></html>";

        // Escape the email and html for JSON safely
        String jsonBody = "{"
            + "\"from\":\"" + escapeJson(fromEmail) + "\","
            + "\"to\":[\"" + escapeJson(toEmail) + "\"],"
            + "\"subject\":\"Your iDAELİK Verification Code\","
            + "\"html\":\"" + escapeJson(htmlBody) + "\""
            + "}";

        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.resend.com/emails"))
                .header("Authorization", "Bearer " + resendApiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new RuntimeException("Resend API error (status " + response.statusCode() + "): " + response.body());
            }
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email via Resend: " + e.getMessage(), e);
        }
    }

    private String escapeJson(String value) {
        if (value == null) return "";
        return value
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t");
    }

    @Transactional
    public boolean verifyOtp(String email, String otp) {
        Optional<OtpEntity> otpOptional = otpRepository.findByEmailAndOtp(email, otp);
        if (otpOptional.isPresent()) {
            OtpEntity otpEntity = otpOptional.get();
            if (otpEntity.getExpiryTime().isAfter(LocalDateTime.now())) {
                // OTP is valid — delete so it can't be reused
                otpRepository.deleteByEmail(email);
                return true;
            } else {
                // OTP is expired
                otpRepository.deleteByEmail(email);
            }
        }
        return false;
    }
}
