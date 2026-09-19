package com.vedikfarm.api.notification;

import com.vedikfarm.api.order.Order;
import com.vedikfarm.api.order.OrderItem;
import com.vedikfarm.api.user.User;
import com.vedikfarm.api.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Sends a plain-text order confirmation email. Deliberately degrades gracefully: if SMTP
 * isn't configured (SMTP_USER/SMTP_PASSWORD empty, the local/dev default) this just logs
 * and moves on rather than failing the checkout flow, which must never depend on email working.
 */
@Service
public class OrderMailService {

    private static final Logger log = LoggerFactory.getLogger(OrderMailService.class);

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    public OrderMailService(JavaMailSender mailSender, UserRepository userRepository) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
    }

    public void sendOrderConfirmation(Order order, List<OrderItem> items) {
        if (smtpUsername == null || smtpUsername.isBlank()) {
            log.info("SMTP not configured - skipping order confirmation email for {}", order.getOrderNumber());
            return;
        }

        userRepository.findById(order.getUserId()).ifPresent(user -> {
            try {
                mailSender.send(buildMessage(user, order, items));
            } catch (Exception e) {
                // Never let an email failure affect the order itself - it's already paid.
                log.warn("Failed to send order confirmation email for {}: {}", order.getOrderNumber(), e.getMessage());
            }
        });
    }

    private SimpleMailMessage buildMessage(User user, Order order, List<OrderItem> items) {
        StringBuilder body = new StringBuilder();
        body.append("Hi ").append(user.getName()).append(",\n\n");
        body.append("Thanks for your order! Here's your confirmation.\n\n");
        body.append("Order: ").append(order.getOrderNumber()).append("\n\n");
        for (OrderItem item : items) {
            body.append("  ").append(item.getQuantity()).append(" x ").append(item.getProductName())
                    .append(" - Rs.").append(item.getLineTotal()).append("\n");
        }
        body.append("\nSubtotal: Rs.").append(order.getSubtotal());
        body.append("\nGST: Rs.").append(order.getCgstAmount().add(order.getSgstAmount()).add(order.getIgstAmount()));
        body.append("\nShipping: Rs.").append(order.getShippingFee());
        body.append("\nTotal: Rs.").append(order.getTotal());
        body.append("\n\nShipping to:\n").append(order.getShipName()).append("\n")
                .append(order.getShipLine1()).append("\n");
        if (order.getShipLine2() != null && !order.getShipLine2().isBlank()) {
            body.append(order.getShipLine2()).append("\n");
        }
        body.append(order.getShipCity()).append(", ").append(order.getShipState()).append(" ").append(order.getShipPincode());
        body.append("\n\n- Vedik Farm");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setFrom(smtpUsername);
        message.setSubject("Vedik Farm - Order " + order.getOrderNumber() + " confirmed");
        message.setText(body.toString());
        return message;
    }
}
