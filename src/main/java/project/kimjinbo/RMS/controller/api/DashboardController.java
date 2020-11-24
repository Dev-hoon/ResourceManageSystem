package project.kimjinbo.RMS.controller.api;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.request.DepartmentApiRequest;
import project.kimjinbo.RMS.model.network.response.DepartmentApiResponse;
import project.kimjinbo.RMS.service.DashboardApiLogicService;

@RestController
@RequestMapping("/api") //localhost:8080/api
public class DashboardController {

    @Autowired
    DashboardApiLogicService dashboardApiLogicService;

    @GetMapping("/dashboard")
    public Header getSetting( ) {
        return dashboardApiLogicService.getSetting( );
    }

}
