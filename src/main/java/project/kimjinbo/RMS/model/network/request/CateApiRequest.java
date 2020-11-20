package project.kimjinbo.RMS.model.network.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CateApiRequest {
    private Long        id;

    private String      superCate;
    private String      subCateFirst;
    private String      subCateSecond;

    private Long        registerUser;
    private String      registerDate;
    private Long        updateUser;
    private String      updateDate;

    private Long        expireDate;

}
