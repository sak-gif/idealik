package com.idealik.backend.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

@Service
public class SmsNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(SmsNotificationService.class);

    @Value("${twilio.account.sid:}")
    private String accountSid;

    @Value("${twilio.auth.token:}")
    private String authToken;

    @Value("${twilio.phone.number:}")
    private String fromPhoneNumber;

    private boolean isTwilioConfigured = false;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.trim().isEmpty() &&
            authToken != null && !authToken.trim().isEmpty()) {
            try {
                Twilio.init(accountSid, authToken);
                isTwilioConfigured = true;
                logger.info("Twilio SMS service initialized successfully.");
            } catch (Exception e) {
                logger.error("Failed to initialize Twilio SDK: {}", e.getMessage());
            }
        } else {
            logger.warn("Twilio credentials are not set. Falling back to Mock SMS mode.");
        }
    }

    /**
     * Sends an SMS notification to the customer.
     * Note: This is currently integrated with Twilio, with a fallback to mock if credentials aren't set.
     *
     * @param phoneNumber The recipient's phone number
     * @param message The message content
     */
    public void sendSms(String phoneNumber, String message) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            logger.warn("Cannot send SMS: Phone number is missing");
            return;
        }

        if (isTwilioConfigured && fromPhoneNumber != null && !fromPhoneNumber.trim().isEmpty()) {
            try {
                logger.info("Sending real SMS via Twilio to: {}", phoneNumber);
                Message.creator(
                    new PhoneNumber(phoneNumber),
                    new PhoneNumber(fromPhoneNumber),
                    message
                ).create();
                logger.info("Twilio SMS sent successfully.");
            } catch (Exception e) {
                logger.error("Failed to send Twilio SMS to {}: {}", phoneNumber, e.getMessage());
            }
        } else {
            // Mock SMS Sending
            logger.info("=====================================================");
            logger.info(">>> MOCK SMS SENT TO: {}", phoneNumber);
            logger.info(">>> MESSAGE: {}", message);
            logger.info("=====================================================");
        }
    }
}
