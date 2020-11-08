package project.kimjinbo.RMS.controller.page;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import project.kimjinbo.RMS.model.entity.Category;
import project.kimjinbo.RMS.service.AdminMenuService;

@Controller
@RequestMapping("/pages")
public class PageController {

    @Autowired
    private AdminMenuService adminMenuService;


    @RequestMapping(path = {""})
    public ModelAndView index() {
        return new ModelAndView("/pages/main")
                .addObject("menuList", adminMenuService.getAdminMenu())
                .addObject("code", "main")
                ;
    }

    @RequestMapping("/user")
    public ModelAndView user() {
        return new ModelAndView("/pages/user")
                .addObject("menuList", adminMenuService.getAdminMenu())
                .addObject("code", "user")
                ;
    }

    @RequestMapping("/item/detail")
    public ModelAndView item() {
        return new ModelAndView("/pages/item")
                .addObject("menuList", adminMenuService.getAdminMenu())
                .addObject("code", "user")
                ;
    }

    @RequestMapping("/item/enroll")
    public ModelAndView itemEnroll() {
        return new ModelAndView("/pages/itemEnroll")
                .addObject("menuList", adminMenuService.getAdminMenu())
                .addObject("code", "user")
                ;
    }

    @RequestMapping("/temp")
    public ModelAndView itemTemp() {
        return new ModelAndView("/pages/itemTemp")
                .addObject("menuList", adminMenuService.getAdminMenu())
                .addObject("code", "user")
                ;
    }

    @RequestMapping("/bookmark")
    public ModelAndView bookmark() {
        return new ModelAndView("/pages/bookmark")
                .addObject("menuList", adminMenuService.getAdminMenu())
                .addObject("code", "user")
                ;
    }
}
