package project.kimjinbo.RMS.controller.page;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import project.kimjinbo.RMS.service.AdminMenuService;

@Controller
@RequestMapping("/pages")
public class PageController {

    @Autowired
    private AdminMenuService adminMenuService;


    @RequestMapping(path = {""})
    public ModelAndView index() {
        return new ModelAndView("/pages/main")
                .addObject("menuList", adminMenuService.getAdminMenu("사원관리"))
                .addObject("code", "main")
                ;
    }

    @RequestMapping("/user")
    public ModelAndView user() {
        return new ModelAndView("/pages/user")
                .addObject("menuList", adminMenuService.getAdminMenu("사원관리"))
                .addObject("code", "user")
                ;
    }

    //***  자산관련 페이지  ***//
    @RequestMapping("/item/enroll")
    public ModelAndView itemEnroll() {
        return new ModelAndView("/pages/itemEnroll")
                .addObject("menuList", adminMenuService.getAdminMenu("자산등록"))
                .addObject("code", "user")
                .addObject("title", "자산")
                ;
    }
    @RequestMapping("/item/detail")
    public ModelAndView item() {
        return new ModelAndView("/pages/item")
                .addObject("menuList", adminMenuService.getAdminMenu("자산상세조회"))
                .addObject("code", "user")
                .addObject("title", "자산")
                ;
    }
    @RequestMapping("/item/history")
    public ModelAndView itemHistory() {
        return new ModelAndView("/pages/itemHistory")
                .addObject("menuList", adminMenuService.getAdminMenu("자산내역조회"))
                .addObject("code", "user")
                .addObject("title", "자산")
                ;
    }
    @RequestMapping("/temp")
    public ModelAndView itemTemp() {
        return new ModelAndView("/pages/itemTemp")
                .addObject("menuList", adminMenuService.getAdminMenu("임시자산목록"))
                .addObject("code", "user")
                .addObject("title", "자산")
                ;
    }

    //***  사원관련 페이지  ***//
    @RequestMapping("/rental")
    public ModelAndView rental() {
        return new ModelAndView("/pages/rental")
                .addObject("menuList", adminMenuService.getAdminMenu("대여 관리"))
                .addObject("code", "user")
                .addObject("title", "대여")
                ;
    }
    @RequestMapping("/bookmark")
    public ModelAndView bookmark() {
        return new ModelAndView("/pages/bookmark")
                .addObject("menuList", adminMenuService.getAdminMenu("장바구니목록"))
                .addObject("code", "user")
                .addObject("title", "대여")
                ;
    }
    @RequestMapping("/rental/history")
    public ModelAndView rentalHistory() {
        return new ModelAndView("/pages/rentalHistory")
                .addObject("menuList", adminMenuService.getAdminMenu("대여기록조회"))
                .addObject("code", "user")
                .addObject("title", "대여")
                ;
    }



    //***  관리관련 페이지  ***//
    @RequestMapping("/department")
    public ModelAndView department() {
        return new ModelAndView("/pages/department")
                .addObject("menuList", adminMenuService.getAdminMenu("팀/부서관리"))
                .addObject("code", "user")
                .addObject("title", "관리")
                ;
    }

    @RequestMapping("/category")
    public ModelAndView category() {
        return new ModelAndView("/pages/category")
                .addObject("menuList", adminMenuService.getAdminMenu("카테고리관리"))
                .addObject("code", "user")
                .addObject("title", "관리")
                ;
    }


}
