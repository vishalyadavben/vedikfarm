package com.vedikfarm.api.catalog;

import com.vedikfarm.api.common.ApiException;
import com.vedikfarm.api.config.R2Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
 * Uploads images to Cloudflare R2 via its S3-compatible API. R2 has no egress fees,
 * which is why it's used here instead of AWS S3 proper - only the endpoint differs.
 */
@Service
public class ImageStorageService {

    private static final Logger log = LoggerFactory.getLogger(ImageStorageService.class);

    private final R2Properties props;

    public ImageStorageService(R2Properties props) {
        this.props = props;
    }

    /** Uploads a product image. Kept as the original signature so existing call sites are unaffected. */
    public String upload(MultipartFile file) {
        return upload(file, "products");
    }

    /** Uploads an image under the given folder prefix (e.g. "products", "health-concerns"). */
    public String upload(MultipartFile file, String folder) {
        if (file.isEmpty()) {
            throw ApiException.badRequest("No file provided.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw ApiException.badRequest("Only image files are allowed.");
        }
        if (isBlank(props.getEndpoint()) || isBlank(props.getAccessKey()) || isBlank(props.getSecretKey())
                || isBlank(props.getPublicBaseUrl())) {
            log.error("Cannot upload image - R2_ENDPOINT/R2_ACCESS_KEY/R2_SECRET_KEY/R2_PUBLIC_BASE_URL "
                    + "are not fully set in the backend's environment.");
            throw ApiException.badRequest(
                    "Image uploads aren't set up yet. Create a Cloudflare R2 bucket and API token, then add "
                    + "R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY, R2_BUCKET and R2_PUBLIC_BASE_URL to the backend "
                    + ".env and restart the backend.");
        }

        String extension = "";
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) {
            extension = original.substring(original.lastIndexOf('.'));
        }
        String key = folder + "/" + UUID.randomUUID() + extension;

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
        } catch (RuntimeException e) {
            log.error("R2 image upload failed: {}", e.getMessage(), e);
            throw ApiException.badRequest("Could not upload the image to storage. Please try again in a moment.");
        }

        String base = props.getPublicBaseUrl();
        if (base != null && base.endsWith("/")) base = base.substring(0, base.length() - 1);
        return base + "/" + key;
    }

    private static boolean isBlank(String s) { return s == null || s.isBlank(); }

    private S3Client buildClient() {
        return S3Client.builder()
                .endpointOverride(URI.create(props.getEndpoint()))
                .region(Region.of("auto"))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(props.getAccessKey(), props.getSecretKey())))
                .build();
    }
}
