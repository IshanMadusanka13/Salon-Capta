package com.capta.server.service;

import com.capta.server.model.Notification;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationService {
    Notification sendNotification(Notification notification);
    List<Notification> getNotificationsForUser(int userId);
    void markAsSent(int notificationId);
    void scheduleReminder(int userId, String content, LocalDateTime sendAt);
}

