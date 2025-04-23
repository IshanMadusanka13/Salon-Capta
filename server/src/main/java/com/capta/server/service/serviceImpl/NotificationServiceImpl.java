package com.capta.server.service.serviceImpl;

import com.capta.server.model.Notification;
import com.capta.server.model.User;
import com.capta.server.repository.NotificationRepository;
import com.capta.server.service.NotificationService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
        log.info("NotificationService initialized with NotificationRepository");
    }

    @Override
    public Notification sendNotification(Notification notification) {
        log.info("Sending notification to user ID: {}", notification.getUser().getUserId());
        log.debug("Notification content: {}", notification.getContent());

        notification.setSent(true);
        notification.setSendTime(LocalDateTime.now());

        Notification savedNotification = notificationRepository.save(notification);
        log.info("Notification sent successfully with ID: {}", savedNotification.getNotificationId());
        log.debug("Sent at: {}", savedNotification.getSendTime());

        return savedNotification;
    }

    @Override
    public List<Notification> getNotificationsForUser(int userId) {
        log.info("Fetching notifications for user ID: {}", userId);
        List<Notification> notifications = notificationRepository.findByUser_UserId(userId);

        log.info("Found {} notifications for user ID: {}", notifications.size(), userId);
        if (!notifications.isEmpty()) {
            log.debug("Notification IDs: {}",
                    notifications.stream()
                            .map(Notification::getNotificationId)
                            .collect(Collectors.toList()));
        }

        return notifications;
    }

    @Override
    public void markAsSent(int notificationId) {
        log.info("Marking notification ID: {} as sent", notificationId);
        notificationRepository.findById(notificationId).ifPresentOrElse(
                notification -> {
                    notification.setSent(true);
                    notification.setSendTime(LocalDateTime.now());
                    notificationRepository.save(notification);
                    log.info("Successfully marked notification ID: {} as sent", notificationId);
                },
                () -> log.warn("Notification ID: {} not found - could not mark as sent", notificationId)
        );
    }

    @Override
    public void scheduleReminder(int userId, String content, LocalDateTime sendAt) {
        log.info("Scheduling reminder for user ID: {} to be sent at: {}", userId, sendAt);
        log.debug("Reminder content: {}", content);

        User user = new User();
        user.setUserId(userId);

        Notification reminder = new Notification();
        reminder.setUser(user);
        reminder.setContent(content);
        reminder.setSent(false);
        reminder.setSendTime(sendAt);

        Notification savedReminder = notificationRepository.save(reminder);
        log.info("Reminder scheduled successfully with ID: {}", savedReminder.getNotificationId());
    }
}