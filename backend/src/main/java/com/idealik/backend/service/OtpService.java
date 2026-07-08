package com.idealik.backend.service;

import com.idealik.backend.model.OtpEntity;
import com.idealik.backend.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Transactional
    public void generateAndSendOtp(String email) {
        // Clear any existing OTPs for this email to prevent spam/confusion
        otpRepository.deleteByEmail(email);

        // Generate a 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        // Save to database FIRST to preserve original flow
        OtpEntity otpEntity = new OtpEntity(email, otp, LocalDateTime.now().plusMinutes(10));
        otpRepository.save(otpEntity);

        // Send HTML Email
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(email);
            helper.setSubject("Your iDAELİK Verification Code");
            helper.setFrom(senderEmail);
            
            String htmlMsg = "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <style>\n" +
                "        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F9F9F9; padding: 40px 20px; color: #1A1C1C; margin: 0; }\n" +
                "        .container { max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #EBE4D8; }\n" +
                "        .header { background-color: #1A1C1C; padding: 30px; text-align: center; }\n" +
                "        .header h1 { color: #C2A86F; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px; }\n" +
                "        .content { padding: 40px 30px; text-align: center; }\n" +
                "        .content h2 { font-size: 20px; color: #1A1C1C; margin-top: 0; margin-bottom: 10px; font-weight: 700; }\n" +
                "        .content p { color: #7E7669; font-size: 15px; line-height: 1.6; margin-bottom: 30px; }\n" +
                "        .otp-container { background-color: #F9F9F9; border: 1px dashed #C2A86F; border-radius: 12px; padding: 20px; margin-bottom: 30px; }\n" +
                "        .otp-code { font-size: 36px; font-weight: 800; color: #C2A86F; letter-spacing: 6px; margin: 0; }\n" +
                "        .footer { background-color: #F9F9F9; padding: 20px; text-align: center; border-top: 1px solid #EBE4D8; }\n" +
                "        .footer p { color: #A8A092; font-size: 12px; margin: 0; }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"header\">\n" +
                "            <h1>iDAELİK</h1>\n" +
                "        </div>\n" +
                "        <div class=\"content\">\n" +
                "            <h2>Verify Your Email</h2>\n" +
                "            <p>You recently requested to verify your email address. Please use the verification code below to complete the process. This code is only valid for <strong>10 minutes</strong>.</p>\n" +
                "            <div class=\"otp-container\">\n" +
                "                <p class=\"otp-code\">" + otp + "</p>\n" +
                "            </div>\n" +
                "            <p>If you did not request this code, please ignore this email.</p>\n" +
                "        </div>\n" +
                "        <div class=\"footer\">\n" +
                "            <p>&copy; 2026 iDAELİK Scheduling. All rights reserved.</p>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>\n";
            
            helper.setText(htmlMsg, true);
            mailSender.send(message);
        } catch (Exception e) {
            // Log the OTP and error instead of throwing to prevent transaction rollback
            System.err.println("Failed to send HTML email. Test Mode OTP for " + email + ": " + otp);
            e.printStackTrace();
        }
    }

    @Transactional
    public boolean verifyOtp(String email, String otp) {
        Optional<OtpEntity> otpOptional = otpRepository.findByEmailAndOtp(email, otp);
        if (otpOptional.isPresent()) {
            OtpEntity otpEntity = otpOptional.get();
            if (otpEntity.getExpiryTime().isAfter(LocalDateTime.now())) {
                // OTP is valid and not expired, delete it so it can't be reused
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
