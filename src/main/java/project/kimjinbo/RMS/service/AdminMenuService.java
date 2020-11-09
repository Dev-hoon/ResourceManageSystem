package project.kimjinbo.RMS.service;

import org.springframework.stereotype.Service;
import project.kimjinbo.RMS.model.front.AdminMenu;

import java.util.List;
import java.util.Arrays;


@Service
public class AdminMenuService {

    public List<AdminMenu> getAdminMenu(String title) {

        System.out.println("title getAdminMenu : "+title);
        return Arrays.asList(
                AdminMenu.builder().title("자산").mode("header").build(),
                AdminMenu.builder().title("자산등록").url("/pages/item/enroll").mode("item").build().check(title),
                AdminMenu.builder().title("자산상세조회").url("/pages/item/detail").mode("item").build().check(title),
                AdminMenu.builder().title("자산내역조회").url("/pages/item/history").mode("item").build().check(title),


                AdminMenu.builder().title("대여").mode("header").build(),
                AdminMenu.builder().title("대여 관리").url("/pages/rental").mode("item").build().check(title),
                AdminMenu.builder().title("장바구니목록").url("/pages/bookmark").mode("item").build().check(title),
                AdminMenu.builder().title("대여기록조회").url("/pages/rental/history").mode("item").build().check(title),

                AdminMenu.builder().title("관리").mode("header").build(),
                AdminMenu.builder().title("사원 관리").url("/pages/user").mode("item").build().check(title),
                AdminMenu.builder().title("팀/부서관리").url("/pages/department").mode("item").build().check(title),
                AdminMenu.builder().title("카테고리관리").url("/pages/category").mode("item").build().check(title)

        );
    }

}