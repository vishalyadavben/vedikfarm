package com.vedikfarm.api.testimonial.dto;

import com.vedikfarm.api.testimonial.Testimonial;

public class TestimonialResponse {
    public Long id;
    public String quote;
    public String customerName;
    public String city;
    public String imageUrl;
    public int rating;
    public int sortOrder;
    public boolean active;

    public static TestimonialResponse from(Testimonial t) {
        TestimonialResponse r = new TestimonialResponse();
        r.id = t.getId();
        r.quote = t.getQuote();
        r.customerName = t.getCustomerName();
        r.city = t.getCity();
        r.imageUrl = t.getImageUrl();
        r.rating = t.getRating();
        r.sortOrder = t.getSortOrder();
        r.active = t.isActive();
        return r;
    }
}
