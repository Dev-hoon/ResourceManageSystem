package project.kimjinbo.RMS.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.request.DepartmentApiRequest;
import project.kimjinbo.RMS.model.network.response.DepartmentApiResponse;
import project.kimjinbo.RMS.model.network.response.DepartmentListApiResponse;
import project.kimjinbo.RMS.service.DepartmentApiLogicService;

import java.util.List;

@RestController
@RequestMapping("/api") //localhost:8080/api
public class DepartmentController implements CrudInterface<DepartmentApiRequest, DepartmentApiResponse> {

    @Autowired
    private DepartmentApiLogicService departmentApiLogicService;

    @GetMapping("/department/list")
    public Header departmentList( ) {
        return departmentApiLogicService.getList( );
    }

    @GetMapping("/departments")
    @ResponseBody
    public Header<List<DepartmentApiResponse>> readDepartments(@PageableDefault(sort = { "id" }, direction = Sort.Direction.ASC) Pageable pageable, DepartmentApiRequest departmentApiRequest) {
        System.out.println("request : "+departmentApiRequest);
        return departmentApiLogicService.search( pageable, departmentApiRequest );
    }

    @GetMapping("/departmentList")
    @ResponseBody
    public Header<List<DepartmentListApiResponse>> readDepartmentList( ) {
        return departmentApiLogicService.searchList( );
    }


    @Override
    @PostMapping("/department")
    public Header<DepartmentApiResponse> create(@RequestBody Header<DepartmentApiRequest> request) {
        System.out.println("controller request : "+request);
        return departmentApiLogicService.create( request );
    }

    @Override
    @GetMapping("/department")
    public Header<DepartmentApiResponse> read(@RequestParam(name = "id") Long id) {
        return null;
    }

    @Override
    @PutMapping("/department")
    public Header<DepartmentApiResponse> update(@RequestBody Header<DepartmentApiRequest> request) {
        return departmentApiLogicService.update( request );
    }

    @Override
    @DeleteMapping("/department/{id}")
    public Header delete(@PathVariable(name = "id") Long id) {
        System.out.println("id : "+id);
        return departmentApiLogicService.delete( id );
    }

     /*
    @GetMapping("/item/setting")
    public Header setting( ) {
        return itemApiLogicService.setting();
    }
*/
}

