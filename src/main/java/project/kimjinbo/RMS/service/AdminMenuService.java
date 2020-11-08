package project.kimjinbo.RMS.service;

import org.springframework.stereotype.Service;
import project.kimjinbo.RMS.model.front.AdminMenu;

import java.util.List;
import java.util.Arrays;


@Service
public class AdminMenuService {

    public List<AdminMenu> getAdminMenu(){

        return Arrays.asList(
                AdminMenu.builder().title("자산신규등록").url("/pages/item/enroll").code("user").build(),
                AdminMenu.builder().title("자산상세조회").url("/pages/item/detail").code("user").build(),
                AdminMenu.builder().title("자산내역조회").url("/pages/item/history").code("user").build(),
                AdminMenu.builder().title("임시자산목록").url("/pages/temp").code("user").build(),

                AdminMenu.builder().title("대여 관리").url("/pages/rental/detail").code("user").build(),
                AdminMenu.builder().title("장바구니목록").url("/pages/bookmark").code("user").build(),
                AdminMenu.builder().title("대여내역조회").url("/pages/rental/detail").code("user").build(),

                AdminMenu.builder().title("사원 관리").url("/pages/user").code("user").build(),
                AdminMenu.builder().title("팀/부서관리").url("/pages/department").code("user").build()

        );

    }

}