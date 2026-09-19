package com.vedikfarm.api.user;

import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.user.dto.AddressRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public List<Address> list(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @Transactional
    public Address create(Long userId, AddressRequest req) {
        if (req.isDefault()) {
            unsetExistingDefault(userId);
        }
        Address address = new Address();
        address.setUserId(userId);
        applyFields(address, req);
        // First address for a user is always the default, regardless of what was requested.
        if (addressRepository.findByUserId(userId).isEmpty()) {
            address.setDefault(true);
        }
        return addressRepository.save(address);
    }

    @Transactional
    public Address update(Long userId, Long addressId, AddressRequest req) {
        Address address = addressRepository.findById(addressId)
                .filter(a -> a.getUserId().equals(userId))
                .orElseThrow(() -> ApiException.notFound("Address not found"));

        if (req.isDefault() && !address.isDefault()) {
            unsetExistingDefault(userId);
        }
        applyFields(address, req);
        return addressRepository.save(address);
    }

    public void delete(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .filter(a -> a.getUserId().equals(userId))
                .orElseThrow(() -> ApiException.notFound("Address not found"));
        addressRepository.delete(address);
    }

    private void unsetExistingDefault(Long userId) {
        addressRepository.findByUserId(userId).stream()
                .filter(Address::isDefault)
                .forEach(a -> { a.setDefault(false); addressRepository.save(a); });
    }

    private void applyFields(Address address, AddressRequest req) {
        address.setLabel(req.getLabel());
        address.setRecipientName(req.getRecipientName());
        address.setLine1(req.getLine1());
        address.setLine2(req.getLine2());
        address.setCity(req.getCity());
        address.setState(req.getState());
        address.setPincode(req.getPincode());
        address.setPhone(req.getPhone());
        if (req.isDefault()) address.setDefault(true);
    }
}
