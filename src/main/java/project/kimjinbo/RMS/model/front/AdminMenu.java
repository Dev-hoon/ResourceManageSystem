package project.kimjinbo.RMS.model.front;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Accessors(chain = true)
public class AdminMenu {

    private String title;
    private String url;
    private String code;
    private String mode;

    public AdminMenu check(String title){
        this.code = ( this.title.equals(title) )? "user" : "";
        return this;
    }
}