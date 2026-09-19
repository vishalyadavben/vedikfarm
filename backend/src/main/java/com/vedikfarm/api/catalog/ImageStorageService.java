package com.vedikfarm.api.catalog;

import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.config.R2Properties;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.net.URI;
import java.util.UUID;

/**
 * Uploads product images to Cloudflare R2 via its S3-compatible API. R2 has no egress fees,
 * which is why it's used here instead of AWS S3 proper - only the endpoint differs.
 */
@Service
public class ImageStorageService {

    private final R2Properties props;

    public ImageStorageService(R2Properties props) {
        this.props = props;
    }

    public String upload(MultipartFile file) {
        if (file.isEmpty()) {
            throw ApiException.badRequest("No file provided.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw ApiException.badRequest("Only image files are allowed.");
        }

        String extension = "";
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) {
            extension = original.substring(original.lastIndexOf('.'));
        }
        String key = "products/" + UUID.randomUUID() + extension;

        try (S3Client s3 = buildClient()) {
            s3.putObject(
                    PutObjectRequest.builder()
                            .bucket(props.getBucket())
                            .key(key)
                            .contentType(contentType)
                            .build(),
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );
        } catch (IOException e) {
            throw ApiException.badRequest("Could not read the uploaded file.");
        }

        String base = props.getPublicBaseUrl();
        if (base != null && base.endsWith("/")) base = base.substring(0, base.length() - 1);
        return base + "/" + key;
    }

    private S3Client buildClient() {
        return S3Client.builder()
                .endpointOverride(URI.create(props.getEndpoint()))
                .region(Region.of("auto"))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(props.getAccessKey(), props.getSecretKey())))
                .build();
    }
}
