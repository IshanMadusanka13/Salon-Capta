package com.capta.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStats {
    private int todayAppointments;
    private int totalCustomers;
    private double todayRevenue;
    private double monthlyRevenue;
}
