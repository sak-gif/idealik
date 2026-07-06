package com.idealik.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class SmsNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(SmsNotificationService.class);

    /**
     * Sends an SMS notification to the customer.
     * Note: This is currently a mock implementation. To send real SMS messages,
     * integrate with a provider like Twilio, Vonage, or AWS SNS here.
     *
     * @param phoneNumber The recipient's phone number
     * @param message The message content
     */
    public void sendSms(String phoneNumber, String message) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            logger.warn("Cannot send SMS: Phone number is missing");
            return;
        }

        // Mock SMS Sending
        logger.info("=====================================================");
        logger.info(">>> MOCK SMS SENT TO: {}", phoneNumber);
        logger.info(">>> MESSAGE: {}", message);
        logger.info("=====================================================");
        
        // Example Twilio Implementation placeholder:
        // Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        // Message.creator(
        //     new com.twilio.type.PhoneNumber(phoneNumber),
        //     new com.twilio.type.PhoneNumber(FROM_NUMBER),
        //     message
        // ).create();
    }
}
