package com.capta.server.utils;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;

import java.io.IOException;


public class SendNotification {

    public static final String ACCOUNT_SID = "AC54dcf5e3ae4a4a66df21ce176714028c";
    public static final String AUTH_TOKEN = "664b3ed4495be8b7952b0248dde7b1a5";
    public static final String MAIL_APIKEY = "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";

    public static void sendSMS(String msg) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        Message message = Message.creator(
                        new com.twilio.type.PhoneNumber("+94718713990"),
                        new com.twilio.type.PhoneNumber("+13135134741"),
                        msg)
                .create();

        System.out.println(message.getBody());
    }

    public static void sendMail(String sendMail, String subject, String msg) throws IOException {
        Email from = new Email("madusankaishan13@gmail.com");
        Email to = new Email(sendMail);
        Content content = new Content("text/plain", msg);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(MAIL_APIKEY);
        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());
        Response response = sg.api(request);
        System.out.println(response.getStatusCode());
        System.out.println(response.getBody());
        System.out.println(response.getHeaders());
    }

}
