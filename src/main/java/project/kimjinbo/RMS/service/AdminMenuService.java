package project.kimjinbo.RMS.service;

import org.springframework.stereotype.Service;
import project.kimjinbo.RMS.model.front.AdminMenu;

import java.util.List;
import java.util.Arrays;


@Service
public class AdminMenuService {

    public List<AdminMenu> getAdminMenu(){

        return Arrays.asList(
                AdminMenu.builder().title("고객 관리").url("/pages/user").code("user").build()
        );

    }

}